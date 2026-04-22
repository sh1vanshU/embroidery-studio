'use client';

import { useState } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { formatINR, cn } from '@/lib/utils';
import { SIZE_DATA } from '@/lib/constants';
import type { CartItem as CartItemType } from '@/types';

const GARMENT_LABELS: Record<string, string> = {
  hoodie: 'Custom Hoodie',
  tshirt: 'Custom T-Shirt',
  polo: 'Custom Polo',
  cap: 'Custom Cap',
};

function GarmentThumbnail({ item }: { item: CartItemType }) {
  const bodyColor = item.colors.body || '#1A1A2E';
  const hoodColor = item.colors.hood || bodyColor;

  if (item.garmentType === 'tshirt') {
    return (
      <svg viewBox="0 0 80 80" className="w-full h-full">
        <path
          d="M20 20 L30 15 L40 18 L50 15 L60 20 L65 35 L55 35 L55 65 L25 65 L25 35 L15 35 Z"
          fill={bodyColor}
          stroke="rgba(212,168,83,0.3)"
          strokeWidth="1"
        />
        {Object.keys(item.zoneDesigns).length > 0 && (
          <circle cx="40" cy="38" r="6" fill="rgba(212,168,83,0.5)" />
        )}
      </svg>
    );
  }

  if (item.garmentType === 'cap') {
    return (
      <svg viewBox="0 0 80 80" className="w-full h-full">
        <ellipse cx="40" cy="45" rx="25" ry="12" fill={bodyColor} stroke="rgba(212,168,83,0.3)" strokeWidth="1" />
        <path d="M15 45 Q15 25 40 20 Q65 25 65 45" fill={hoodColor} stroke="rgba(212,168,83,0.3)" strokeWidth="1" />
        <path d="M15 45 L5 48 Q4 45 15 42" fill={bodyColor} stroke="rgba(212,168,83,0.3)" strokeWidth="1" />
      </svg>
    );
  }

  // Hoodie / Polo
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full">
      <path
        d="M20 22 L28 15 L35 18 L35 12 Q40 8 45 12 L45 18 L52 15 L60 22 L65 38 L55 38 L55 68 L25 68 L25 38 L15 38 Z"
        fill={bodyColor}
        stroke="rgba(212,168,83,0.3)"
        strokeWidth="1"
      />
      {item.garmentType === 'hoodie' && (
        <path
          d="M35 12 Q40 8 45 12 L45 18 Q42 22 40 22 Q38 22 35 18 Z"
          fill={hoodColor}
          stroke="rgba(212,168,83,0.3)"
          strokeWidth="0.5"
        />
      )}
      {Object.keys(item.zoneDesigns).length > 0 && (
        <circle cx="40" cy="40" r="6" fill="rgba(212,168,83,0.5)" />
      )}
    </svg>
  );
}

export function CartItem({ item }: { item: CartItemType }) {
  const { removeItem, updateQuantity, updateSize } = useCartStore();
  const [showConfirm, setShowConfirm] = useState(false);

  const sizes = SIZE_DATA.map((s) => s.size);
  const zoneCount = Object.keys(item.zoneDesigns).length;
  const lineTotal = item.unitPrice * item.quantity;

  const handleRemove = () => {
    if (showConfirm) {
      removeItem(item.id);
    } else {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 3000);
    }
  };

  return (
    <div className="flex gap-3 p-3 rounded-[8px] bg-charcoal-light/50 border border-[var(--border)]">
      {/* Thumbnail */}
      <div className="w-16 h-16 flex-shrink-0 rounded-[6px] bg-charcoal-deep/60 p-1">
        <GarmentThumbnail item={item} />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-text-primary text-[0.85rem] font-semibold tracking-wide truncate">
            {GARMENT_LABELS[item.garmentType] || 'Custom Item'}
          </h4>
          <span className="text-gold text-[0.85rem] font-semibold whitespace-nowrap">
            {formatINR(lineTotal)}
          </span>
        </div>

        {/* Design summary */}
        <p className="text-text-muted text-[0.72rem] mt-0.5">
          {zoneCount > 0
            ? `${zoneCount} design${zoneCount > 1 ? 's' : ''} placed`
            : 'No designs'}{' '}
          &middot; {formatINR(item.unitPrice)} each
        </p>

        {/* Color chips */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="text-text-muted text-[0.65rem] tracking-wider uppercase">Colors:</span>
          {[item.colors.body, item.colors.hood, item.colors.cuffs]
            .filter((c, i, arr) => arr.indexOf(c) === i)
            .map((hex, i) => (
              <span
                key={i}
                className="w-3.5 h-3.5 rounded-full border border-[var(--border)]"
                style={{ backgroundColor: hex }}
              />
            ))}
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-3 mt-2">
          {/* Size */}
          <select
            value={item.size}
            onChange={(e) => updateSize(item.id, e.target.value)}
            className="bg-charcoal-deep border border-[var(--border)] text-text-primary text-[0.72rem] rounded-[6px] px-1.5 py-1 outline-none focus:border-gold cursor-pointer"
          >
            {sizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Quantity */}
          <div className="flex items-center border border-[var(--border)] rounded-[6px] overflow-hidden">
            <button
              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
              className="w-6 h-6 flex items-center justify-center text-text-secondary hover:text-gold hover:bg-charcoal-deep transition-colors text-[0.8rem] cursor-pointer"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-7 h-6 flex items-center justify-center text-text-primary text-[0.72rem] bg-charcoal-deep/40">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, Math.min(100, item.quantity + 1))}
              className="w-6 h-6 flex items-center justify-center text-text-secondary hover:text-gold hover:bg-charcoal-deep transition-colors text-[0.8rem] cursor-pointer"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Remove */}
          <button
            onClick={handleRemove}
            className={cn(
              'ml-auto text-[0.7rem] tracking-wide transition-colors cursor-pointer',
              showConfirm
                ? 'text-red-400 font-semibold'
                : 'text-text-muted hover:text-red-400'
            )}
          >
            {showConfirm ? 'Confirm?' : 'Remove'}
          </button>
        </div>
      </div>
    </div>
  );
}
