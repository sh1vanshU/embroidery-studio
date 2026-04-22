'use client';

// ═══════════════════════════════════════════
// EMBROO INDIA — AR TRY-ON COMPONENT
// Webcam + photo upload AR garment preview
// ═══════════════════════════════════════════

import { useCallback, useEffect, useRef, useState } from 'react';
import { useBuilderStore } from '@/stores/builderStore';
import { GarmentOverlay } from './GarmentOverlay';
import {
  initPoseLandmarker,
  detectPoseFromVideo,
  detectPoseFromImage,
  disposePoseLandmarker,
  isPoseError,
} from './PoseDetector';
import type { PoseResult, PoseError, TorsoBounds } from './PoseDetector';
import type { PoseLandmarker } from '@mediapipe/tasks-vision';

type Mode = 'webcam' | 'photo';
type Status = 'idle' | 'loading' | 'ready' | 'error';

interface ARTryOnProps {
  onClose: () => void;
}

export function ARTryOn({ onClose }: ARTryOnProps) {
  const { garmentType, colors, zoneDesigns } = useBuilderStore();

  const [mode, setMode] = useState<Mode>('webcam');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [torso, setTorso] = useState<TorsoBounds | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<PoseLandmarker | null>(null);
  const rafRef = useRef<number>(0);
  const lastTimestampRef = useRef<number>(-1);

  const [canvasDimensions, setCanvasDimensions] = useState({ width: 640, height: 480 });

  // ── Cleanup ──────────────────────────────

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
      disposePoseLandmarker();
    };
  }, [stopCamera]);

  // ── Webcam mode ──────────────────────────

  const startWebcam = useCallback(async () => {
    setStatus('loading');
    setErrorMsg('');
    setTorso(null);

    try {
      // Init pose landmarker
      const landmarker = await initPoseLandmarker();
      landmarkerRef.current = landmarker;
    } catch {
      setStatus('error');
      setErrorMsg(
        'Could not load pose detection model. This may be blocked by your network. Please try again or use Photo mode.'
      );
      return;
    }

    try {
      // Request camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) return;

      video.srcObject = stream;
      await video.play();

      const vw = video.videoWidth || 640;
      const vh = video.videoHeight || 480;
      setCanvasDimensions({ width: vw, height: vh });

      setStatus('ready');
      runDetectionLoop();
    } catch (err) {
      setStatus('error');
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setErrorMsg('Camera access was denied. Please allow camera permission in your browser settings.');
      } else if (err instanceof DOMException && err.name === 'NotFoundError') {
        setErrorMsg('No camera found on this device. Try uploading a photo instead.');
      } else {
        setErrorMsg('Could not start camera. Please check permissions and try again.');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  const runDetectionLoop = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const landmarker = landmarkerRef.current;
    if (!video || !canvas || !landmarker) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      if (!video.paused && !video.ended && video.readyState >= 2) {
        const now = performance.now();
        // Avoid duplicate timestamps
        if (now !== lastTimestampRef.current) {
          lastTimestampRef.current = now;

          // Draw video frame to canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Run pose detection
          const result = detectPoseFromVideo(landmarker, video, now);
          if (!isPoseError(result)) {
            setTorso(result.torso);
          } else {
            // Keep last known torso for smooth UX, but clear after timeout
            // (in a real app you might fade it out)
          }
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
  }, []);

  // ── Switch camera ────────────────────────

  const switchCamera = useCallback(() => {
    stopCamera();
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  }, [stopCamera]);

  // Re-start webcam when facingMode changes (but only if in webcam mode & was ready)
  useEffect(() => {
    if (mode === 'webcam' && (status === 'ready' || status === 'loading')) {
      startWebcam();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  // ── Photo upload mode ────────────────────

  const handlePhotoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    stopCamera();
    setStatus('loading');
    setErrorMsg('');
    setTorso(null);

    const url = URL.createObjectURL(file);
    setUploadedImage(url);

    // Load the image and detect pose
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      setCanvasDimensions({ width: img.naturalWidth, height: img.naturalHeight });

      // Draw to canvas
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
      }

      try {
        const result = await detectPoseFromImage(img);
        if (isPoseError(result)) {
          setStatus('error');
          setErrorMsg((result as PoseError).message);
        } else {
          setTorso((result as PoseResult).torso);
          setStatus('ready');
        }
      } catch {
        setStatus('error');
        setErrorMsg('Could not load pose detection. Try again or check your network connection.');
      }
    };
    img.onerror = () => {
      setStatus('error');
      setErrorMsg('Could not load the image. Please try a different file.');
    };
    img.src = url;
  }, [stopCamera]);

  // ── Screenshot / Download ────────────────

  const takeScreenshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Composite canvas + overlay into a single image
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return;

    // Draw video/photo frame
    ctx.drawImage(canvas, 0, 0);

    // Draw the garment overlay SVG onto the canvas
    const svgEl = containerRef.current?.querySelector('svg');
    if (svgEl) {
      const svgData = new XMLSerializer().serializeToString(svgEl);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(svgUrl);
        const dataUrl = tempCanvas.toDataURL('image/png');
        setScreenshotUrl(dataUrl);
      };
      img.src = svgUrl;
    } else {
      const dataUrl = tempCanvas.toDataURL('image/png');
      setScreenshotUrl(dataUrl);
    }
  }, []);

  const downloadImage = useCallback(() => {
    const url = screenshotUrl;
    if (!url) {
      takeScreenshot();
      return;
    }
    const a = document.createElement('a');
    a.href = url;
    a.download = `embroo-tryon-${Date.now()}.png`;
    a.click();
  }, [screenshotUrl, takeScreenshot]);

  // ── Mode switch ──────────────────────────

  const handleModeSwitch = useCallback(
    (newMode: Mode) => {
      if (newMode === mode) return;
      stopCamera();
      setMode(newMode);
      setStatus('idle');
      setTorso(null);
      setErrorMsg('');
      setUploadedImage(null);
      setScreenshotUrl(null);
    },
    [mode, stopCamera]
  );

  // ── Render ───────────────────────────────

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="AR Try-On"
    >
      <div className="bg-charcoal-deep rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-[var(--border)]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-gold font-display text-lg tracking-wide">Try It On</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-gold transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface"
            aria-label="Close AR try-on"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="4" x2="14" y2="14" />
              <line x1="14" y1="4" x2="4" y2="14" />
            </svg>
          </button>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-1 px-5 pt-4" role="tablist" aria-label="Try-on mode">
          <button
            role="tab"
            aria-selected={mode === 'webcam'}
            onClick={() => handleModeSwitch('webcam')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'webcam'
                ? 'bg-gold text-charcoal-deep'
                : 'bg-surface text-text-secondary hover:text-gold'
            }`}
          >
            <span className="mr-1.5" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline -mt-0.5">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </span>
            Webcam
          </button>
          <button
            role="tab"
            aria-selected={mode === 'photo'}
            onClick={() => handleModeSwitch('photo')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'photo'
                ? 'bg-gold text-charcoal-deep'
                : 'bg-surface text-text-secondary hover:text-gold'
            }`}
          >
            <span className="mr-1.5" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline -mt-0.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </span>
            Photo Upload
          </button>
        </div>

        {/* Canvas area */}
        <div ref={containerRef} className="relative mx-5 mt-4 rounded-xl overflow-hidden bg-black/40 aspect-[4/3]">
          {/* Hidden video element for webcam */}
          <video
            ref={videoRef}
            className="hidden"
            playsInline
            muted
            aria-hidden="true"
          />

          {/* Visible canvas */}
          <canvas
            ref={canvasRef}
            width={canvasDimensions.width}
            height={canvasDimensions.height}
            className="w-full h-full object-contain"
            aria-label="AR preview canvas"
          />

          {/* Garment overlay */}
          {torso && status === 'ready' && (
            <GarmentOverlay
              torso={torso}
              canvasWidth={canvasDimensions.width}
              canvasHeight={canvasDimensions.height}
              garmentType={garmentType}
              colors={colors}
              zoneDesigns={zoneDesigns}
            />
          )}

          {/* Status overlays */}
          {status === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-text-secondary">
              {mode === 'webcam' ? (
                <>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3 opacity-50">
                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  <p className="text-sm mb-4">Start your camera to try on the garment</p>
                  <button
                    onClick={startWebcam}
                    className="bg-gold text-charcoal-deep px-6 py-2.5 rounded-lg font-semibold text-sm tracking-wide hover:bg-gold-light transition-all"
                    aria-label="Start camera"
                  >
                    Start Camera
                  </button>
                </>
              ) : (
                <>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3 opacity-50">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                  <p className="text-sm mb-4">Upload a photo of yourself to try on the garment</p>
                  <label className="bg-gold text-charcoal-deep px-6 py-2.5 rounded-lg font-semibold text-sm tracking-wide hover:bg-gold-light transition-all cursor-pointer">
                    Choose Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      aria-label="Upload photo for try-on"
                    />
                  </label>
                </>
              )}
            </div>
          )}

          {status === 'loading' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
              <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-text-secondary text-sm">
                {mode === 'webcam' ? 'Starting camera & loading pose detection...' : 'Analyzing your photo...'}
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 px-6 text-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" className="mb-3">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <p className="text-red-400 text-sm mb-4 max-w-xs">{errorMsg}</p>
              <div className="flex gap-3">
                {mode === 'webcam' && (
                  <button
                    onClick={startWebcam}
                    className="bg-surface text-text-secondary px-4 py-2 rounded-lg text-sm hover:text-gold transition-all"
                  >
                    Retry
                  </button>
                )}
                {mode === 'webcam' && (
                  <button
                    onClick={() => handleModeSwitch('photo')}
                    className="bg-gold text-charcoal-deep px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Try Photo Instead
                  </button>
                )}
                {mode === 'photo' && (
                  <label className="bg-gold text-charcoal-deep px-4 py-2 rounded-lg text-sm font-medium cursor-pointer">
                    Try Another Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      aria-label="Upload another photo"
                    />
                  </label>
                )}
              </div>
            </div>
          )}

          {/* Ready state — no person detected hint */}
          {status === 'ready' && !torso && mode === 'webcam' && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 rounded-lg px-4 py-2">
              <p className="text-text-secondary text-xs">Step into the frame so we can detect your body</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div className="flex gap-2">
            {mode === 'webcam' && status === 'ready' && (
              <>
                <button
                  onClick={switchCamera}
                  className="bg-surface text-text-secondary px-4 py-2 rounded-lg text-sm hover:text-gold hover:border-[var(--border)] border border-transparent transition-all"
                  aria-label="Switch camera between front and back"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline mr-1.5 -mt-0.5">
                    <path d="M1 4v6h6M23 20v-6h-6" />
                    <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
                  </svg>
                  Switch Camera
                </button>
                <button
                  onClick={takeScreenshot}
                  className="bg-gold text-charcoal-deep px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold-light transition-all"
                  aria-label="Take screenshot of current view"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline mr-1.5 -mt-0.5">
                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  Take Screenshot
                </button>
              </>
            )}

            {mode === 'photo' && status === 'ready' && (
              <>
                <label className="bg-surface text-text-secondary px-4 py-2 rounded-lg text-sm hover:text-gold border border-transparent hover:border-[var(--border)] transition-all cursor-pointer">
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    aria-label="Upload a different photo"
                  />
                </label>
                <button
                  onClick={downloadImage}
                  className="bg-gold text-charcoal-deep px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold-light transition-all"
                  aria-label="Download composite image"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline mr-1.5 -mt-0.5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download
                </button>
              </>
            )}
          </div>

          {/* Garment indicator */}
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <span
              className="w-4 h-4 rounded-full border border-[var(--border)]"
              style={{ backgroundColor: colors.body }}
              aria-hidden="true"
            />
            <span className="capitalize">{garmentType}</span>
            {Object.keys(zoneDesigns).length > 0 && (
              <span className="text-gold">
                + {Object.keys(zoneDesigns).length} design{Object.keys(zoneDesigns).length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Screenshot preview */}
        {screenshotUrl && (
          <div className="mx-5 mb-4 p-4 bg-surface rounded-xl border border-[var(--border)]">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-text-secondary">Screenshot captured</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = screenshotUrl;
                    a.download = `embroo-tryon-${Date.now()}.png`;
                    a.click();
                  }}
                  className="bg-gold text-charcoal-deep px-3 py-1.5 rounded-lg text-xs font-medium"
                  aria-label="Save screenshot"
                >
                  Save
                </button>
                <button
                  onClick={() => setScreenshotUrl(null)}
                  className="text-text-secondary hover:text-gold text-xs px-2 py-1.5"
                  aria-label="Dismiss screenshot"
                >
                  Dismiss
                </button>
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={screenshotUrl}
              alt="AR try-on screenshot"
              className="w-full rounded-lg"
            />
          </div>
        )}

        {/* Accessibility note */}
        <p className="px-5 pb-4 text-[0.7rem] text-text-secondary/50">
          Tip: For best results, stand 3-5 feet from the camera in a well-lit room. Wear fitted clothing for accurate overlay.
        </p>
      </div>
    </div>
  );
}
