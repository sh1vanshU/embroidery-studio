'use client';

// ═══════════════════════════════════════════
// EMBROO INDIA — AR TRY-ON BUTTON
// Entry point for the AR try-on experience
// ═══════════════════════════════════════════

import { useCallback, useEffect, useState } from 'react';
import { ARTryOn } from './ARTryOn';

type SupportStatus = 'checking' | 'supported' | 'unsupported';

function checkARSupport(): SupportStatus {
  if (typeof window === 'undefined') return 'checking';

  const hasMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  const hasCanvas = (() => {
    try {
      const c = document.createElement('canvas');
      return !!(c.getContext('2d') || c.getContext('webgl'));
    } catch {
      return false;
    }
  })();

  return hasMediaDevices && hasCanvas ? 'supported' : 'unsupported';
}

export function ARButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [support, setSupport] = useState<SupportStatus>('checking');

  useEffect(() => {
    setSupport(checkARSupport());
  }, []);

  const handleOpen = useCallback(() => {
    if (support === 'supported') {
      setIsOpen(true);
    }
  }, [support]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Don't render during SSR check
  if (support === 'checking') {
    return null;
  }

  if (support === 'unsupported') {
    return (
      <button
        disabled
        className="bg-surface text-text-secondary/50 px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 cursor-not-allowed"
        title="AR Try-On requires a camera and WebGL support"
        aria-label="AR Try-On is not supported on this device"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-40">
          <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
        <span>Try It On</span>
        <span className="text-[0.6rem] bg-surface px-1.5 py-0.5 rounded-full opacity-60 ml-1">
          Coming Soon
        </span>
      </button>
    );
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="bg-surface text-text-secondary px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-all hover:text-gold hover:border-[var(--border)] border border-transparent hover:bg-surface/80"
        aria-label="Open AR Try-On to see yourself wearing this garment"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
        <span>Try It On</span>
      </button>

      {isOpen && <ARTryOn onClose={handleClose} />}
    </>
  );
}
