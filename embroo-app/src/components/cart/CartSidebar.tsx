'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/stores/cartStore';
import { formatINR } from '@/lib/utils';
import { CartItem } from './CartItem';

export function CartSidebar() {
  const { items, isOpen, toggleSidebar, getTotal, getItemCount } = useCartStore();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const itemCount = getItemCount();
  const total = getTotal();

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) toggleSidebar();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, toggleSidebar]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 right-0 z-[100] h-full w-full max-w-[420px] bg-charcoal border-l border-[var(--border)] shadow-[var(--shadow-deep)] flex flex-col transition-transform duration-400 ease-[var(--ease-out)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Shopping bag"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h2 className="font-[var(--font-display)] text-[1.3rem] text-text-primary tracking-wide">
            Your Bag{' '}
            <span className="text-text-muted text-[0.85rem] font-[var(--font-body)]">
              ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </span>
          </h2>
          <button
            onClick={toggleSidebar}
            className="w-9 h-9 flex items-center justify-center rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
            aria-label="Close bag"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="4" x2="14" y2="14" />
              <line x1="14" y1="4" x2="4" y2="14" />
            </svg>
          </button>
        </div>

        {/* Body */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mb-4 opacity-30">
              <path
                d="M16 20h32l-4 28H20L16 20z"
                stroke="currentColor"
                strokeWidth="2"
                className="text-text-muted"
              />
              <path
                d="M24 20V16a8 8 0 0 1 16 0v4"
                stroke="currentColor"
                strokeWidth="2"
                className="text-text-muted"
              />
            </svg>
            <p className="text-text-secondary text-[0.95rem] mb-1">Your bag is empty</p>
            <p className="text-text-muted text-[0.8rem] mb-5">
              Design something beautiful and add it here
            </p>
            <Link
              href="/builder"
              onClick={toggleSidebar}
              className="text-gold text-[0.85rem] font-medium tracking-wide hover:text-gold-light transition-colors"
            >
              Continue Shopping &rarr;
            </Link>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 custom-scrollbar">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[var(--border)] px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary text-[0.85rem] tracking-wide">Subtotal</span>
              <span className="text-text-primary text-[1.05rem] font-semibold">
                {formatINR(total)}
              </span>
            </div>
            <p className="text-text-muted text-[0.7rem]">
              Shipping &amp; taxes calculated at checkout
            </p>
            <div className="flex gap-3">
              <Link
                href="/checkout"
                onClick={toggleSidebar}
                className="flex-1 text-center py-2.5 bg-transparent border border-[var(--border)] text-gold text-[0.8rem] font-medium tracking-[0.06em] rounded-[8px] hover:bg-[rgba(212,168,83,0.15)] transition-all"
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                onClick={toggleSidebar}
                className="flex-1 text-center py-2.5 bg-gold text-charcoal-deep text-[0.8rem] font-semibold tracking-[0.06em] rounded-[8px] hover:bg-gold-light hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(212,168,83,0.3)] transition-all"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
