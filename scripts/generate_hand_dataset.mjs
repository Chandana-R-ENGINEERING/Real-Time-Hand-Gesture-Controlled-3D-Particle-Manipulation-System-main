// Script to generate high-fidelity Hand Gesture Landmark Dataset for Hand Detection & Gesture Training
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const DATASETS_DIR = join(ROOT, 'datasets');
if (!existsSync(DATASETS_DIR)) mkdirSync(DATASETS_DIR, { recursive: true });

// 21 MediaPipe hand landmarks:
// 0: WRIST
// 1: THUMB_CMC, 2: THUMB_MCP, 3: THUMB_IP, 4: THUMB_TIP
// 5: INDEX_FINGER_MCP, 6: INDEX_FINGER_PIP, 7: INDEX_FINGER_DIP, 8: INDEX_FINGER_TIP
// 9: MIDDLE_FINGER_MCP, 10: MIDDLE_FINGER_PIP, 11: MIDDLE_FINGER_DIP, 12: MIDDLE_FINGER_TIP
// 13: RING_FINGER_MCP, 14: RING_FINGER_PIP, 15: RING_FINGER_DIP, 16: RING_FINGER_TIP
// 17: PINKY_MCP, 18: PINKY_PIP, 19: PINKY_DIP, 20: PINKY_TIP

function createHandPose(type, noise = 0.01) {
  // Base wrist and palm coordinates
  const lm = [
    [0.5, 0.85, 0.0], // 0: Wrist
    // Thumb
    [0.44, 0.76, -0.01], [0.39, 0.68, -0.02], [0.36, 0.60, -0.03], [0.34, 0.52, -0.04],
    // Index
    [0.45, 0.58, 0.0], [0.44, 0.46, 0.0], [0.44, 0.36, 0.0], [0.44, 0.26, 0.0],
    // Middle
    [0.50, 0.56, 0.0], [0.50, 0.43, 0.0], [0.50, 0.32, 0.0], [0.50, 0.22, 0.0],
    // Ring
    [0.55, 0.58, 0.0], [0.56, 0.46, 0.0], [0.56, 0.37, 0.0], [0.56, 0.28, 0.0],
    // Pinky
    [0.60, 0.62, 0.0], [0.62, 0.52, 0.0], [0.63, 0.44, 0.0], [0.64, 0.36, 0.0],
  ];

  if (type === 'fist') {
    // Curl all fingers tightly into palm
    lm[4] = [0.45, 0.65, 0.05]; // Thumb tucked over fingers
    lm[7] = [0.45, 0.60, 0.04]; lm[8] = [0.45, 0.68, 0.02]; // Index curled
    lm[11] = [0.50, 0.58, 0.04]; lm[12] = [0.50, 0.66, 0.02]; // Middle curled
    lm[15] = [0.55, 0.60, 0.04]; lm[16] = [0.55, 0.67, 0.02]; // Ring curled
    lm[19] = [0.60, 0.63, 0.04]; lm[20] = [0.60, 0.69, 0.02]; // Pinky curled
  } else if (type === 'point') {
    // Index extended straight up, others curled
    lm[7] = [0.44, 0.36, 0.0]; lm[8] = [0.44, 0.24, 0.0]; // Index extended
    lm[4] = [0.43, 0.67, 0.04]; // Thumb over middle
    lm[11] = [0.50, 0.58, 0.04]; lm[12] = [0.50, 0.66, 0.02]; // Middle curled
    lm[15] = [0.55, 0.60, 0.04]; lm[16] = [0.55, 0.67, 0.02]; // Ring curled
    lm[19] = [0.60, 0.63, 0.04]; lm[20] = [0.60, 0.69, 0.02]; // Pinky curled
  } else if (type === 'pinch') {
    // Index tip and thumb tip touch
    lm[4] = [0.42, 0.44, 0.02]; // Thumb tip meets index tip
    lm[7] = [0.43, 0.48, 0.0]; lm[8] = [0.42, 0.44, 0.02]; // Index tip touches thumb tip
    lm[11] = [0.50, 0.56, 0.04]; lm[12] = [0.50, 0.64, 0.02]; // Middle folded
    lm[15] = [0.55, 0.59, 0.04]; lm[16] = [0.55, 0.66, 0.02]; // Ring folded
    lm[19] = [0.60, 0.62, 0.04]; lm[20] = [0.60, 0.68, 0.02]; // Pinky folded
  } else if (type === 'peace') {
    // Index and middle extended, ring and pinky curled
    lm[7] = [0.42, 0.35, 0.0]; lm[8] = [0.40, 0.23, 0.0]; // Index spread left
    lm[11] = [0.52, 0.35, 0.0]; lm[12] = [0.54, 0.23, 0.0]; // Middle spread right
    lm[4] = [0.48, 0.68, 0.04]; // Thumb over ring
    lm[15] = [0.56, 0.60, 0.04]; lm[16] = [0.56, 0.67, 0.02]; // Ring curled
    lm[19] = [0.61, 0.63, 0.04]; lm[20] = [0.61, 0.69, 0.02]; // Pinky curled
  } else if (type === 'snap_ready') {
    // Thumb and middle pressed against each other
    lm[4] = [0.47, 0.50, 0.03]; // Thumb tip pressed
    lm[12] = [0.47, 0.50, 0.03]; // Middle tip pressed to thumb
    lm[8] = [0.43, 0.36, 0.0]; // Index semi-relaxed
  } else if (type === 'snap_release') {
    // Middle snapped down against palm, thumb flicked out
    lm[4] = [0.38, 0.55, -0.02]; // Thumb opened
    lm[12] = [0.50, 0.72, 0.05]; // Middle slammed to thenar eminence
    lm[8] = [0.43, 0.38, 0.0];
  } else if (type === 'open') {
    // All fingers fully extended and spread
    lm[4] = [0.30, 0.52, -0.05]; // Thumb spread wide
    lm[8] = [0.42, 0.24, 0.0];
    lm[12] = [0.50, 0.20, 0.0];
    lm[16] = [0.58, 0.25, 0.0];
    lm[20] = [0.66, 0.33, 0.0];
  }

  // Apply jitter / variation noise
  return lm.map(([x, y, z]) => [
    Number((x + (Math.random() - 0.5) * noise).toFixed(4)),
    Number((y + (Math.random() - 0.5) * noise).toFixed(4)),
    Number((z + (Math.random() - 0.5) * noise).toFixed(4)),
  ]);
}

const GESTURE_CLASSES = ['open', 'fist', 'point', 'pinch', 'peace', 'snap_ready', 'snap_release'];
const SAMPLES_PER_CLASS = 150;
const dataset = [];

for (const gesture of GESTURE_CLASSES) {
  for (let i = 0; i < SAMPLES_PER_CLASS; i++) {
    const landmarks = createHandPose(gesture, 0.015);
    dataset.push({
      id: dataset.length + 1,
      gesture,
      landmarks,
      features: {
        openness: gesture === 'open' ? 0.95 : gesture === 'fist' ? 0.05 : 0.45,
        pinchDistance: gesture === 'pinch' ? 0.02 : 0.25,
      }
    });
  }
}

// 1. Save JSON
writeFileSync(join(DATASETS_DIR, 'hand_gestures_dataset.json'), JSON.stringify({
  version: '1.0.0',
  description: 'MediaPipe 21-Landmark Hand Gesture Dataset for Gesture Control Training',
  totalSamples: dataset.length,
  classes: GESTURE_CLASSES,
  samplesPerClass: SAMPLES_PER_CLASS,
  data: dataset,
}, null, 2));

// 2. Save CSV (flattened x0..x20, y0..y20, z0..z20, label)
const csvHeaders = ['id', 'gesture'];
for (let i = 0; i < 21; i++) csvHeaders.push(`x${i}`, `y${i}`, `z${i}`);
const csvRows = [csvHeaders.join(',')];

for (const item of dataset) {
  const row = [item.id, item.gesture];
  for (const [x, y, z] of item.landmarks) {
    row.push(x, y, z);
  }
  csvRows.push(row.join(','));
}

writeFileSync(join(DATASETS_DIR, 'hand_gestures_dataset.csv'), csvRows.join('\n'));

console.log(`✅ Generated Hand Gesture Dataset:`);
console.log(`   - datasets/hand_gestures_dataset.json (${dataset.length} samples across ${GESTURE_CLASSES.length} gestures)`);
console.log(`   - datasets/hand_gestures_dataset.csv (Ready for PyTorch / TensorFlow / Scikit-learn / Browser ML)`);
