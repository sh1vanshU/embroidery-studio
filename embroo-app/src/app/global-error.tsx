'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Global Error]', error.digest ?? error.message);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          background: '#0E0E13',
          color: '#E8E8EE',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <div style={{ maxWidth: 480, textAlign: 'center' }}>
          <h1 style={{ fontSize: 28, marginBottom: 12 }}>Something went wrong</h1>
          <p style={{ color: '#9999A6', marginBottom: 20, fontSize: 14 }}>
            An unexpected error occurred. Please refresh the page or contact us if it persists.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              background: '#D4A853',
              color: '#0E0E13',
              fontWeight: 600,
              fontSize: 14,
              border: 0,
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
