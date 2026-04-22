'use client';

import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'sm';
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    'relative overflow-hidden font-medium tracking-wide transition-all duration-400 rounded-[8px] cursor-pointer';

  const variants = {
    primary:
      'bg-gold text-charcoal-deep px-9 py-3.5 text-[0.9rem] font-semibold tracking-[0.06em] btn-shimmer hover:bg-gold-light hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(212,168,83,0.3)]',
    outline:
      'bg-transparent text-gold px-9 py-3.5 text-[0.9rem] font-medium tracking-[0.06em] border-[1.5px] border-gold hover:bg-[rgba(212,168,83,0.15)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-gold)]',
    sm: 'w-full py-2.5 bg-transparent border border-[var(--border)] text-gold text-[0.8rem] font-medium tracking-[0.08em] hover:bg-gold hover:text-charcoal-deep hover:border-gold',
  };

  return (
    <button
      className={cn(base, variants[variant], fullWidth && 'w-full', className)}
      {...props}
    >
      {children}
    </button>
  );
}
