// Webcam + MediaPipe HandLandmarker (Tasks API, VIDEO mode). The render loop calls poll() once per frame;
// detection only runs when the camera delivered a new frame, and timestamps strictly increase.
const VISION = '/node_modules/@mediapipe/tasks-vision/vision_bundle.mjs';
const WASM = '/node_modules/@mediapipe/tasks-vision/wasm';
const MODEL = '/models/hand_landmarker.task';

export class HandCamera {
  constructor(video) {
    this.video = video;
    this.landmarker = null;
    this.stream = null;
    this.running = false;
    this.delegate = null;
    this.lastVideoTime = -1;
    this.lastTs = 0;
    this.frames = 0;             // camera frames processed
    this.fps = 0;
    this.detectMs = 0;
    this._n = 0; this._t = performance.now();
    this.newFrame = false;       // a new video frame arrived since the last poll (renderer uploads it)
  }

  async start(onStatus = () => {}) {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('This browser cannot access a camera (getUserMedia missing — please use http://localhost or HTTPS).');
    }
    onStatus('Requesting webcam access…');
    let stream = null;
    // Laptop-friendly resolution (640x480 or 720p): dramatically cuts GPU memory & runs fast on Intel Iris / UHD
    const constraintsList = [
      { video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user', frameRate: { ideal: 30 } }, audio: false },
      { video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }, audio: false },
      { video: { facingMode: 'user' }, audio: false },
      { video: true, audio: false }
    ];
    let lastErr = null;
    for (const c of constraintsList) {
      try {
        stream = await navigator.mediaDevices.getUserMedia(c);
        if (stream) break;
      } catch (err) {
        lastErr = err;
        console.warn('Constraint attempt failed, trying next:', err.message);
      }
    }
    if (!stream) {
      if (lastErr?.name === 'NotAllowedError' || lastErr?.name === 'PermissionDeniedError' || String(lastErr?.message).includes('denied')) {
        const e = new Error('Camera access was blocked by your browser. Please click the camera / lock icon 🔒 next to localhost:5173 in your address bar and choose "Allow".');
        e.name = 'NotAllowedError';
        throw e;
      } else if (lastErr?.name === 'NotFoundError' || lastErr?.name === 'DevicesNotFoundError') {
        const e = new Error('No webcam detected. Please connect your webcam or continue without camera.');
        e.name = 'NotFoundError';
        throw e;
      } else if (lastErr?.name === 'NotReadableError' || lastErr?.name === 'TrackStartError') {
        const e = new Error('Webcam is already in use by another application (Zoom, Teams, etc.). Please close it and retry.');
        e.name = 'NotReadableError';
        throw e;
      }
      throw lastErr || new Error('Could not open webcam with available device constraints.');
    }

    this.stream = stream;
    this.video.srcObject = this.stream;
    this.video.muted = true;
    this.video.playsInline = true;
    this.video.setAttribute('playsinline', '');
    this.video.setAttribute('muted', '');

    // Wait until video metadata is loaded so dimensions are known
    await new Promise((resolve) => {
      if (this.video.readyState >= 2 && this.video.videoWidth > 0) return resolve();
      const onReady = () => {
        this.video.removeEventListener('loadedmetadata', onReady);
        this.video.removeEventListener('canplay', onReady);
        resolve();
      };
      this.video.addEventListener('loadedmetadata', onReady);
      this.video.addEventListener('canplay', onReady);
      setTimeout(resolve, 1500);
    });

    try { await this.video.play(); } catch (e) { console.warn('video.play notice:', e); }

    onStatus('Loading AI Hand Tracker…');
    let FilesetResolver, HandLandmarker;
    try {
      const mod = await import(VISION);
      FilesetResolver = mod.FilesetResolver;
      HandLandmarker = mod.HandLandmarker;
    } catch (e) {
      console.warn('Local vision bundle failed, falling back to CDN...', e);
      const mod = await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.mjs');
      FilesetResolver = mod.FilesetResolver;
      HandLandmarker = mod.HandLandmarker;
    }

    let fileset;
    try {
      fileset = await FilesetResolver.forVisionTasks(WASM);
    } catch (e) {
      console.warn('Local wasm failed, falling back to CDN...', e);
      fileset = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm');
    }

    const makeLandmarker = (delegate, modelPath = MODEL) => HandLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: modelPath, delegate },
      runningMode: 'VIDEO',
      numHands: 2,
      minHandDetectionConfidence: 0.5,
      minHandPresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    // Helper timeout to prevent laptop GPU shader hangs
    const withTimeout = (prom, ms) => new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('GPU initialization timed out')), ms);
      prom.then((v) => { clearTimeout(timer); resolve(v); }, (e) => { clearTimeout(timer); reject(e); });
    });

    const qs = typeof location !== 'undefined' ? new URLSearchParams(location.search) : new URLSearchParams();
    const forceGpu = qs.get('delegate') === 'GPU' || qs.get('gpu') === '1';

    if (forceGpu) {
      try {
        this.landmarker = await withTimeout(makeLandmarker('GPU'), 3500);
        this.delegate = 'GPU';
      } catch (e) {
        console.warn('GPU delegate failed or timed out, falling back to CPU:', e);
        onStatus('Optimizing for Laptop CPU…');
        this.landmarker = await makeLandmarker('CPU');
        this.delegate = 'CPU';
      }
    } else {
      // Laptop-safe & crash-proof default: MediaPipe WebAssembly CPU delegate.
      // Runs smoothly on CPU cores with SIMD, preventing GPU shader stalls, driver TDR timeouts, and black screens on laptops.
      try {
        this.landmarker = await makeLandmarker('CPU');
        this.delegate = 'CPU';
      } catch (e) {
        console.warn('Local CPU model failed, trying CDN fallback:', e);
        const cdnModel = 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';
        try {
          this.landmarker = await makeLandmarker('CPU', cdnModel);
          this.delegate = 'CPU';
        } catch (e2) {
          console.warn('CPU CDN fallback failed, trying GPU as last resort:', e2);
          this.landmarker = await makeLandmarker('GPU');
          this.delegate = 'GPU';
        }
      }
    }

    this.running = true;
    onStatus('');
  }

  /** Returns undefined when there is no new camera frame, else a list of hands (mirrored, selfie view), possibly empty. */
  poll() {
    const v = this.video;
    if (!this.running || !this.landmarker || v.readyState < 2 || !v.videoWidth || !v.videoHeight || v.currentTime === this.lastVideoTime) {
      return undefined;
    }
    this.lastVideoTime = v.currentTime;
    this.newFrame = true;
    const ts = Math.max(Math.round(performance.now()), this.lastTs + 1);      // must strictly increase
    this.lastTs = ts;
    const t0 = performance.now();
    try {
      const res = this.landmarker.detectForVideo(v, ts);
      this.detectMs = performance.now() - t0;
      this.frames++;
      this._n++;
      const now = performance.now();
      if (now - this._t > 1000) {
        this.fps = (this._n * 1000) / (now - this._t);
        this._n = 0;
        this._t = now;
      }
      return (res.landmarks || []).map((lm) => lm.map((p) => [1 - p.x, p.y]));   // mirror x: selfie view
    } catch (err) {
      console.warn('Frame detection notice:', err);
      return undefined;
    }
  }

  stop() {
    this.running = false;
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    this.landmarker?.close?.();
    this.landmarker = null;
  }
}
