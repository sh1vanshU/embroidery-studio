'use client';

import Link from 'next/link';
import { useThemeStore } from '@/stores/themeStore';
import { useEffect } from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="min-h-screen bg-charcoal-deep flex flex-col items-center">
      {/* Logo */}
      <div className="pt-10 pb-6">
        <Link href="/" className="block text-center">
          <span className="font-[var(--font-display)] text-3xl font-semibold tracking-wide text-gold">
            Embroo
          </span>
          <span className="block text-[0.65rem] tracking-[0.35em] uppercase text-text-secondary mt-0.5">
            India
          </span>
        </Link>
      </div>
      {/* Content */}
      <div className="flex-1 w-full flex items-start justify-center px-4 pb-12">
        {children}
      </div>
    </div>
  );
}
