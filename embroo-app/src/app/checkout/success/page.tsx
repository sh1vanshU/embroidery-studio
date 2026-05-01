'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { formatINR } from '@/lib/utils';

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-charcoal-deep"><p className="text-text-secondary">Loading...</p></div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order') || 'EMB-XXXXXX';
  const amountParam = searchParams.get('amount');
  const amount = amountParam ? Number(amountParam) : 0;

  const [deliveryRange, setDeliveryRange] = useState({ start: '', end: '' });

  useEffect(() => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() + 7);
    const end = new Date(now);
    end.setDate(end.getDate() + 10);

    const fmt = (d: Date) =>
      d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

    // toLocaleDateString output depends on timezone, so the value is
    // computed after hydration to avoid SSR/CSR mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDeliveryRange({ start: fmt(start), end: fmt(end) });
  }, []);

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
      {/* Animated checkmark */}
      <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-green-500/15 flex items-center justify-center relative">
        <div className="absolute inset-0 rounded-full bg-green-500/10 animate-ping" />
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" className="relative z-10">
          <circle
            cx="22"
            cy="22"
            r="20"
            stroke="#22c55e"
            strokeWidth="2"
            fill="none"
            style={{
              strokeDasharray: 126,
              strokeDashoffset: 126,
              animation: 'drawCircle 0.6s ease-out forwards',
            }}
          />
          <path
            d="M12 22l7 7 13-15"
            stroke="#22c55e"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 40,
              strokeDashoffset: 40,
              animation: 'drawCheck 0.5s 0.5s ease-out forwards',
            }}
          />
        </svg>
      </div>

      <h1 className="font-[var(--font-display)] text-[2rem] sm:text-[2.5rem] text-text-primary mb-2">
        Order Placed Successfully!
      </h1>
      <p className="text-text-muted text-[0.9rem] mb-8 max-w-sm mx-auto">
        Thank you for choosing Embroo India. We are crafting your custom embroidery with care.
      </p>

      {/* Order summary card */}
      <div className="bg-surface border border-[var(--border)] rounded-[12px] p-6 text-left space-y-4 mb-8">
        <div className="flex justify-between items-center">
          <span className="text-text-muted text-[0.8rem] tracking-wider uppercase">
            Order Number
          </span>
          <span className="text-gold font-semibold text-[1rem] font-mono tracking-wider">
            {orderId}
          </span>
        </div>

        {amount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-text-muted text-[0.8rem] tracking-wider uppercase">
              Total Paid
            </span>
            <span className="text-text-primary font-semibold text-[1rem]">
              {formatINR(amount)}
            </span>
          </div>
        )}

        <div className="border-t border-[var(--border)] pt-4 flex justify-between items-center">
          <span className="text-text-muted text-[0.8rem] tracking-wider uppercase">
            Estimated Delivery
          </span>
          <span className="text-text-primary text-[0.9rem]">
            {deliveryRange.start && deliveryRange.end
              ? `${deliveryRange.start} - ${deliveryRange.end}`
              : '7-10 business days'}
          </span>
        </div>

        <div className="flex items-start gap-2 bg-charcoal-light/30 rounded-[8px] p-3 mt-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="text-gold mt-0.5 flex-shrink-0"
          >
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
          </svg>
          <p className="text-text-muted text-[0.75rem] leading-relaxed">
            A confirmation email has been sent with your order details and tracking information
            will be shared once your order is shipped.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
        <button
          className="flex-1 py-3 bg-transparent border border-[var(--border)] text-text-secondary text-[0.85rem] font-medium tracking-[0.04em] rounded-[8px] hover:bg-surface-hover transition-all cursor-pointer"
          onClick={() => {
            // Placeholder: track order
          }}
        >
          Track Order
        </button>
        <Link
          href="/"
          className="flex-1 py-3 bg-gold text-charcoal-deep font-semibold text-[0.85rem] tracking-[0.06em] rounded-[8px] hover:bg-gold-light hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(212,168,83,0.3)] transition-all text-center"
        >
          Continue Shopping
        </Link>
      </div>

      <style>{`
        @keyframes drawCircle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
