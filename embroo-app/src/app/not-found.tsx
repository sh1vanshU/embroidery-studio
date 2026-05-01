import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-4">
        <p className="text-gold text-sm tracking-[0.2em] uppercase">404</p>
        <h1 className="font-[var(--font-display)] text-3xl text-text-primary">
          Page not found
        </h1>
        <p className="text-text-secondary text-[0.9rem]">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-[8px] bg-gold text-charcoal-deep font-semibold text-sm hover:bg-gold-light transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/builder"
            className="px-5 py-2.5 rounded-[8px] border border-[var(--border)] text-text-secondary font-medium text-sm hover:bg-surface-hover transition-colors"
          >
            Open Builder
          </Link>
        </div>
      </div>
    </div>
  );
}
