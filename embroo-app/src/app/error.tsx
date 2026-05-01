'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[App Error]', error.digest ?? error.message);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-4">
        <h1 className="font-[var(--font-display)] text-3xl text-text-primary">
          Something went wrong
        </h1>
        <p className="text-text-secondary text-[0.9rem]">
          We hit an unexpected snag. Please try again, and if it keeps happening, contact us.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-[8px] bg-gold text-charcoal-deep font-semibold text-sm hover:bg-gold-light transition-colors cursor-pointer"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-[8px] border border-[var(--border)] text-text-secondary font-medium text-sm hover:bg-surface-hover transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
