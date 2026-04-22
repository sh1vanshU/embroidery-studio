// ═══════════════════════════════════════════
// EMBROO INDIA — POSE DETECTION UTILITY
// MediaPipe Pose Landmarker wrapper
// ═══════════════════════════════════════════

import type { PoseLandmarker as PoseLandmarkerType, NormalizedLandmark } from '@mediapipe/tasks-vision';

export interface TorsoBounds {
  leftShoulder: { x: number; y: number };
  rightShoulder: { x: number; y: number };
  leftHip: { x: number; y: number };
  rightHip: { x: number; y: number };
  shoulderWidth: number;
  torsoHeight: number;
  centerX: number;
  centerY: number;
  angle: number; // rotation angle in radians
}

export interface PoseResult {
  landmarks: NormalizedLandmark[];
  torso: TorsoBounds;
}

export type PoseError =
  | { type: 'LOAD_FAILED'; message: string }
  | { type: 'NO_PERSON'; message: string }
  | { type: 'CAMERA_DENIED'; message: string }
  | { type: 'UNKNOWN'; message: string };

// MediaPipe landmark indices
const LEFT_SHOULDER = 11;
const RIGHT_SHOULDER = 12;
const LEFT_HIP = 23;
const RIGHT_HIP = 24;

let landmarkerInstance: PoseLandmarkerType | null = null;
let loadPromise: Promise<PoseLandmarkerType> | null = null;

/**
 * Initialize or return the cached PoseLandmarker instance.
 * Uses dynamic import so the heavy WASM bundle is only loaded when needed.
 */
export async function initPoseLandmarker(): Promise<PoseLandmarkerType> {
  if (landmarkerInstance) return landmarkerInstance;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    try {
      const vision = await import('@mediapipe/tasks-vision');
      const { PoseLandmarker, FilesetResolver } = vision;

      const filesetResolver = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      const landmarker = await PoseLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numPoses: 1,
      });

      landmarkerInstance = landmarker;
      return landmarker;
    } catch (err) {
      loadPromise = null;
      throw err;
    }
  })();

  return loadPromise;
}

/**
 * Compute torso bounds from pose landmarks.
 * All coordinates are normalized 0..1.
 */
function computeTorsoBounds(landmarks: NormalizedLandmark[]): TorsoBounds {
  const ls = landmarks[LEFT_SHOULDER];
  const rs = landmarks[RIGHT_SHOULDER];
  const lh = landmarks[LEFT_HIP];
  const rh = landmarks[RIGHT_HIP];

  const shoulderWidth = Math.sqrt(
    Math.pow(rs.x - ls.x, 2) + Math.pow(rs.y - ls.y, 2)
  );

  const shoulderMidY = (ls.y + rs.y) / 2;
  const hipMidY = (lh.y + rh.y) / 2;
  const torsoHeight = hipMidY - shoulderMidY;

  const centerX = (ls.x + rs.x + lh.x + rh.x) / 4;
  const centerY = (ls.y + rs.y + lh.y + rh.y) / 4;

  // Compute rotation angle from shoulder line
  const angle = Math.atan2(rs.y - ls.y, rs.x - ls.x);

  return {
    leftShoulder: { x: ls.x, y: ls.y },
    rightShoulder: { x: rs.x, y: rs.y },
    leftHip: { x: lh.x, y: lh.y },
    rightHip: { x: rh.x, y: rh.y },
    shoulderWidth,
    torsoHeight,
    centerX,
    centerY,
    angle,
  };
}

/**
 * Detect a pose from a video frame.
 * Returns landmarks + torso bounds, or a PoseError.
 */
export function detectPoseFromVideo(
  landmarker: PoseLandmarkerType,
  video: HTMLVideoElement,
  timestampMs: number
): PoseResult | PoseError {
  try {
    const result = landmarker.detectForVideo(video, timestampMs);

    if (!result.landmarks || result.landmarks.length === 0) {
      return { type: 'NO_PERSON', message: 'No person detected. Please step into the frame.' };
    }

    const landmarks = result.landmarks[0];

    if (
      !landmarks[LEFT_SHOULDER] ||
      !landmarks[RIGHT_SHOULDER] ||
      !landmarks[LEFT_HIP] ||
      !landmarks[RIGHT_HIP]
    ) {
      return { type: 'NO_PERSON', message: 'Could not detect your upper body. Please face the camera.' };
    }

    const torso = computeTorsoBounds(landmarks);

    return { landmarks, torso };
  } catch {
    return { type: 'UNKNOWN', message: 'Pose detection failed. Please try again.' };
  }
}

/**
 * Detect a pose from a static image.
 * Switches the landmarker to IMAGE mode, runs detection, then switches back.
 */
export async function detectPoseFromImage(
  image: HTMLImageElement | HTMLCanvasElement
): Promise<PoseResult | PoseError> {
  try {
    const landmarker = await initPoseLandmarker();

    // Switch to IMAGE mode for static detection
    landmarker.setOptions({ runningMode: 'IMAGE' });
    const result = landmarker.detect(image);

    // Switch back to VIDEO mode
    landmarker.setOptions({ runningMode: 'VIDEO' });

    if (!result.landmarks || result.landmarks.length === 0) {
      return { type: 'NO_PERSON', message: 'No person detected in the photo. Please upload a clear photo of yourself.' };
    }

    const landmarks = result.landmarks[0];

    if (
      !landmarks[LEFT_SHOULDER] ||
      !landmarks[RIGHT_SHOULDER] ||
      !landmarks[LEFT_HIP] ||
      !landmarks[RIGHT_HIP]
    ) {
      return { type: 'NO_PERSON', message: 'Could not detect upper body. Please use a photo showing your full torso.' };
    }

    const torso = computeTorsoBounds(landmarks);
    return { landmarks, torso };
  } catch {
    return { type: 'UNKNOWN', message: 'Pose detection failed on this image.' };
  }
}

/**
 * Clean up the landmarker instance.
 */
export function disposePoseLandmarker(): void {
  if (landmarkerInstance) {
    landmarkerInstance.close();
    landmarkerInstance = null;
    loadPromise = null;
  }
}

/**
 * Type guard for PoseError
 */
export function isPoseError(result: PoseResult | PoseError): result is PoseError {
  return 'type' in result && 'message' in result && !('landmarks' in result);
}
