"""
Hand Gesture Classifier Trainer for Real-Time 3D Particle Manipulation System
Trains a machine learning classifier on the 21-landmark 3D hand dataset
"""

import json
import os
import numpy as np

DATASET_PATH = os.path.join(os.path.dirname(__file__), '..', 'datasets', 'hand_gestures_dataset.json')
OUTPUT_MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'custom_gesture_weights.json')

def load_data():
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Dataset not found at {DATASET_PATH}")
    
    with open(DATASET_PATH, 'r') as f:
        data = json.load(f)
    
    X = []
    y = []
    classes = data['classes']
    class_to_idx = {c: i for i, c in enumerate(classes)}
    
    for item in data['data']:
        # Flatten 21 landmarks [x, y, z] -> 63 features
        flat_lm = []
        for pt in item['landmarks']:
            flat_lm.extend(pt)
        X.append(flat_lm)
        y.append(class_to_idx[item['gesture']])
        
    return np.array(X, dtype=np.float32), np.array(y, dtype=np.int64), classes

def train_classifier():
    print("Loading hand gesture landmark dataset...")
    X, y, classes = load_data()
    print(f"Dataset loaded: {len(X)} samples, {len(classes)} classes: {classes}")

    # Normalize relative to wrist (landmark 0)
    # wrist is at indices 0, 1, 2
    for i in range(len(X)):
        wrist_x, wrist_y, wrist_z = X[i, 0], X[i, 1], X[i, 2]
        for k in range(21):
            X[i, k*3] -= wrist_x
            X[i, k*3 + 1] -= wrist_y
            X[i, k*3 + 2] -= wrist_z
            
    # Calculate class centroids and Euclidean bounds for fast browser inference
    centroids = {}
    for c_idx, c_name in enumerate(classes):
        samples = X[y == c_idx]
        mean_vec = np.mean(samples, axis=0).tolist()
        std_vec = np.std(samples, axis=0).tolist()
        centroids[c_name] = {
            'mean': mean_vec,
            'std': std_vec,
            'sampleCount': len(samples)
        }
    
    model_data = {
        'version': '1.0.0',
        'classes': classes,
        'featureCount': 63,
        'centroids': centroids,
        'algorithm': 'NearestCentroid-ZScore'
    }
    
    with open(OUTPUT_MODEL_PATH, 'w') as f:
        json.dump(model_data, f, indent=2)
        
    print(f"Saved gesture classifier model weights to: {OUTPUT_MODEL_PATH}")
    print("Hand gesture training pipeline complete.")

if __name__ == '__main__':
    train_classifier()
