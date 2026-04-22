import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout — Embroo India',
  description: 'Complete your custom embroidery order.',
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-charcoal-deep flex flex-col">
      {/* Minimal header */}
      <header className="border-b border-[var(--border)] bg-charcoal/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="font-[var(--font-display)] text-[1.4rem] text-gold tracking-wide hover:text-gold-light transition-colors"
          >
            Embroo
          </Link>
          <div className="flex items-center gap-1.5">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="text-green-400"
            >
              <path
                d="M7 1L8.5 5H13L9.5 8L10.5 12L7 9.5L3.5 12L4.5 8L1 5H5.5L7 1Z"
                fill="currentColor"
              />
            </svg>
            <span className="text-text-muted text-[0.72rem] tracking-wider">
              Secure Checkout
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
