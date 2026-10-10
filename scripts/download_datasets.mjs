// Dataset downloader and builder script for Vector: Hand Gesture 3D Particle Manipulation System
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const DATASETS_DIR = join(ROOT, 'datasets');
const MODELS_DIR = join(ROOT, 'models');

if (!existsSync(DATASETS_DIR)) mkdirSync(DATASETS_DIR, { recursive: true });
if (!existsSync(MODELS_DIR)) mkdirSync(MODELS_DIR, { recursive: true });

console.log('📦 Initializing Vector 3D Anatomical and Gesture Datasets...');

// 1. Verify MediaPipe Model
const MP_MODEL_PATH = join(MODELS_DIR, 'hand_landmarker.task');
if (existsSync(MP_MODEL_PATH)) {
  console.log('✅ MediaPipe Hand Landmarker model verified (models/hand_landmarker.task)');
} else {
  console.log('⚠️ MediaPipe Hand Landmarker model missing, downloading...');
  const res = await fetch('https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task');
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(MP_MODEL_PATH, buf);
  console.log(`✅ Downloaded hand_landmarker.task (${(buf.length / 1024 / 1024).toFixed(2)} MB)`);
}

// 2. Generate 3D Anatomical Point Cloud Datasets
function generateHumanBodyDataset(n = 60000) {
  const points = [];
  const parts = [
    { name: 'Skeleton', count: Math.round(n * 0.35), color: [0.95, 0.93, 0.85], info: '206 bones: frame, levers and blood factory' },
    { name: 'Brain', count: Math.round(n * 0.08), color: [1.0, 0.5, 0.7], info: 'control centre: 86 billion neurons' },
    { name: 'Heart', count: Math.round(n * 0.05), color: [1.0, 0.25, 0.3], info: 'pumps ~7,000 litres of blood a day' },
    { name: 'Lungs', count: Math.round(n * 0.10), color: [0.55, 0.75, 1.0], info: 'swap carbon dioxide for oxygen' },
    { name: 'Liver', count: Math.round(n * 0.06), color: [0.8, 0.4, 0.25], info: '500+ jobs: filters, stores, makes bile' },
    { name: 'Stomach', count: Math.round(n * 0.04), color: [1.0, 0.65, 0.5], info: 'acid bath that starts digestion' },
    { name: 'Intestines', count: Math.round(n * 0.08), color: [1.0, 0.8, 0.55], info: '7 m that absorb the nutrients' },
    { name: 'Kidneys', count: Math.round(n * 0.04), color: [1.0, 0.55, 0.45], info: 'filter the blood, make urine' },
    { name: 'Nervous system', count: Math.round(n * 0.08), color: [1.0, 0.9, 0.3], info: 'brain, spinal cord and 72 km of nerves' },
    { name: 'Cardiovascular system', count: Math.round(n * 0.12), color: [1.0, 0.3, 0.25], info: 'arteries and veins circulating oxygenated blood' },
  ];

  for (const part of parts) {
    for (let i = 0; i < part.count; i++) {
      let x = 0, y = 0, z = 0;
      if (part.name === 'Skeleton') {
        const seg = Math.random();
        if (seg < 0.25) { // Skull
          const u = Math.random() * Math.PI * 2, v = (Math.random() - 0.5) * Math.PI;
          x = 0.18 * Math.cos(v) * Math.cos(u);
          y = 0.75 + 0.22 * Math.sin(v);
          z = 0.20 * Math.cos(v) * Math.sin(u);
        } else if (seg < 0.55) { // Spine + ribs
          const h = (Math.random() - 0.5) * 0.6;
          const a = Math.random() * Math.PI * 2;
          const ribR = 0.25 * (1 - Math.abs(h) * 0.5);
          x = ribR * Math.cos(a);
          y = 0.25 + h;
          z = ribR * 0.6 * Math.sin(a);
        } else { // Limbs
          const side = Math.random() < 0.5 ? 1 : -1;
          const isLeg = Math.random() < 0.6;
          if (isLeg) {
            x = side * (0.12 + Math.random() * 0.05);
            y = -0.5 - Math.random() * 0.45;
            z = (Math.random() - 0.5) * 0.08;
          } else {
            x = side * (0.35 + Math.random() * 0.1);
            y = 0.35 - Math.random() * 0.5;
            z = (Math.random() - 0.5) * 0.08;
          }
        }
      } else if (part.name === 'Brain') {
        const u = Math.random() * Math.PI * 2, v = (Math.random() - 0.5) * Math.PI;
        const bump = 1 + 0.05 * Math.sin(8 * u) * Math.cos(6 * v);
        x = 0.14 * bump * Math.cos(v) * Math.cos(u);
        y = 0.78 + 0.12 * bump * Math.sin(v);
        z = 0.14 * bump * Math.cos(v) * Math.sin(u);
      } else if (part.name === 'Heart') {
        const u = Math.random() * Math.PI * 2, v = (Math.random() - 0.5) * Math.PI;
        x = 0.04 + 0.09 * Math.cos(v) * Math.cos(u);
        y = 0.32 + 0.11 * Math.sin(v);
        z = 0.08 + 0.09 * Math.cos(v) * Math.sin(u);
      } else if (part.name === 'Lungs') {
        const side = Math.random() < 0.5 ? 1 : -1;
        const u = Math.random() * Math.PI * 2, v = (Math.random() - 0.5) * Math.PI;
        x = side * 0.15 + 0.11 * Math.cos(v) * Math.cos(u);
        y = 0.35 + 0.18 * Math.sin(v);
        z = 0.02 + 0.11 * Math.cos(v) * Math.sin(u);
      } else if (part.name === 'Liver') {
        const u = Math.random() * Math.PI * 2, v = (Math.random() - 0.5) * Math.PI;
        x = -0.12 + 0.18 * Math.cos(v) * Math.cos(u);
        y = 0.18 + 0.09 * Math.sin(v);
        z = 0.05 + 0.12 * Math.cos(v) * Math.sin(u);
      } else if (part.name === 'Kidneys') {
        const side = Math.random() < 0.5 ? 1 : -1;
        const u = Math.random() * Math.PI * 2, v = (Math.random() - 0.5) * Math.PI;
        x = side * 0.13 + 0.05 * Math.cos(v) * Math.cos(u);
        y = 0.12 + 0.08 * Math.sin(v);
        z = -0.09 + 0.05 * Math.cos(v) * Math.sin(u);
      } else if (part.name === 'Stomach') {
        const u = Math.random() * Math.PI * 2, v = (Math.random() - 0.5) * Math.PI;
        x = 0.11 + 0.10 * Math.cos(v) * Math.cos(u);
        y = 0.16 + 0.09 * Math.sin(v);
        z = 0.06 + 0.09 * Math.cos(v) * Math.sin(u);
      } else if (part.name === 'Intestines') {
        const t = Math.random() * 12 * Math.PI;
        const r = 0.15 * Math.sin(t * 0.3) + 0.02;
        x = r * Math.cos(t) * 0.8;
        y = 0.02 + (Math.random() - 0.5) * 0.18;
        z = 0.07 + r * Math.sin(t) * 0.5;
      } else if (part.name === 'Nervous system') {
        const t = Math.random();
        x = (Math.random() - 0.5) * 0.02;
        y = 0.7 - t * 0.9;
        z = -0.04 + (Math.random() - 0.5) * 0.02;
      } else { // Cardiovascular
        const t = Math.random();
        x = (Math.random() - 0.5) * (0.05 + t * 0.25);
        y = 0.65 - t * 1.4;
        z = (Math.random() - 0.5) * 0.08;
      }
      points.push({
        x: Number(x.toFixed(4)),
        y: Number(y.toFixed(4)),
        z: Number(z.toFixed(4)),
        part: part.name,
        color: part.color,
      });
    }
  }

  return {
    name: 'Human Body',
    category: 'Anatomy',
    description: '11 organ systems · 37 trillion cells (Full multi-part point cloud)',
    totalPoints: points.length,
    parts: parts.map(p => ({ name: p.name, points: p.count, color: p.color, info: p.info })),
    points,
  };
}

function generateCardiacDataset(n = 25000) {
  const points = [];
  const parts = [
    { name: 'Left Ventricle', count: Math.round(n * 0.3), color: [1.0, 0.2, 0.25], info: 'thick muscular pump feeding the systemic circuit' },
    { name: 'Right Ventricle', count: Math.round(n * 0.25), color: [0.9, 0.25, 0.3], info: 'pumps deoxygenated blood to the lungs' },
    { name: 'Left Atrium', count: Math.round(n * 0.15), color: [0.85, 0.35, 0.45], info: 'receives oxygenated blood from pulmonary veins' },
    { name: 'Right Atrium', count: Math.round(n * 0.15), color: [0.8, 0.3, 0.4], info: 'receives blood from venae cavae' },
    { name: 'Aorta & Great Vessels', count: Math.round(n * 0.15), color: [1.0, 0.4, 0.3], info: 'major arterial trunk and arch' },
  ];
  for (const part of parts) {
    for (let i = 0; i < part.count; i++) {
      const u = Math.random() * Math.PI * 2, v = (Math.random() - 0.5) * Math.PI;
      let x = 0, y = 0, z = 0;
      if (part.name.includes('Aorta')) {
        const t = Math.random() * Math.PI;
        x = 0.15 * Math.cos(t);
        y = 0.35 + 0.25 * Math.sin(t);
        z = (Math.random() - 0.5) * 0.1;
      } else {
        const offset = part.name.includes('Left') ? 0.08 : -0.08;
        x = offset + 0.22 * Math.cos(v) * Math.cos(u);
        y = 0.25 * Math.sin(v);
        z = 0.2 * Math.cos(v) * Math.sin(u);
      }
      points.push({ x: Number(x.toFixed(4)), y: Number(y.toFixed(4)), z: Number(z.toFixed(4)), part: part.name, color: part.color });
    }
  }
  return {
    name: 'Human Heart',
    category: 'Anatomy',
    description: 'Beating 4-chamber cardiac anatomy with systemic and pulmonary trunks',
    totalPoints: points.length,
    parts,
    points,
  };
}

function generateDnaDataset(n = 20000) {
  const points = [];
  const turns = 4;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const strand = Math.random() < 0.4 ? 1 : Math.random() < 0.8 ? 2 : 3;
    const angle = t * turns * Math.PI * 2;
    let x, y, z, col;
    y = (t - 0.5) * 1.8;
    if (strand === 1) {
      x = 0.3 * Math.cos(angle);
      z = 0.3 * Math.sin(angle);
      col = [0.4, 0.8, 1.0];
    } else if (strand === 2) {
      x = 0.3 * Math.cos(angle + Math.PI * 0.8);
      z = 0.3 * Math.sin(angle + Math.PI * 0.8);
      col = [0.8, 0.4, 1.0];
    } else {
      const u = Math.random();
      x = 0.3 * Math.cos(angle) * (1 - u) + 0.3 * Math.cos(angle + Math.PI * 0.8) * u;
      z = 0.3 * Math.sin(angle) * (1 - u) + 0.3 * Math.sin(angle + Math.PI * 0.8) * u;
      col = [1.0, 0.9, 0.3];
    }
    points.push({ x: Number(x.toFixed(4)), y: Number(y.toFixed(4)), z: Number(z.toFixed(4)), color: col });
  }
  return {
    name: 'DNA Double Helix',
    category: 'Biology',
    description: 'B-DNA double helix unzipping into base pairs (Adenine, Thymine, Guanine, Cytosine)',
    totalPoints: points.length,
    points,
  };
}

// Write dataset files
const datasets = [
  { file: 'human_body_particles.json', data: generateHumanBodyDataset() },
  { file: 'human_heart_cardiac.json', data: generateCardiacDataset() },
  { file: 'dna_helix.json', data: generateDnaDataset() },
];

for (const ds of datasets) {
  const outPath = join(DATASETS_DIR, ds.file);
  writeFileSync(outPath, JSON.stringify(ds.data, null, 2));
  console.log(`✅ Saved dataset: datasets/${ds.file} (${ds.data.totalPoints.toLocaleString()} particles)`);
}

// Master index
const masterIndex = {
  version: '1.0.0',
  description: 'Vector Real-Time Gesture 3D Particle Manipulation Datasets',
  updated: new Date().toISOString(),
  datasets: datasets.map(d => ({
    file: d.file,
    name: d.data.name,
    category: d.data.category,
    description: d.data.description,
    totalPoints: d.data.totalPoints,
  })),
  models: [
    {
      name: 'MediaPipe Hand Landmarker',
      file: 'models/hand_landmarker.task',
      size: '7.82 MB',
      description: 'Google MediaPipe on-device 21-landmark 3D hand tracking neural network',
    }
  ]
};

writeFileSync(join(DATASETS_DIR, 'datasets.json'), JSON.stringify(masterIndex, null, 2));
console.log('✅ Generated datasets/datasets.json master catalog!');
console.log('🚀 All datasets ready.');
