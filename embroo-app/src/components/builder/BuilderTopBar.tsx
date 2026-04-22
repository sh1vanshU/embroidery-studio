'use client';

import Link from 'next/link';
import { useBuilderStore } from '@/stores/builderStore';
import { useCartStore } from '@/stores/cartStore';
import { useUiStore } from '@/stores/uiStore';
import { formatINR, calculatePrice } from '@/lib/utils';

export function BuilderTopBar() {
  const { garmentType, zoneDesigns, stitchType } = useBuilderStore();
  const { getItemCount } = useCartStore();
  const { openHelp } = useUiStore();

  const pricing = calculatePrice(garmentType, zoneDesigns, stitchType);

  const handleAddToCart = () => {
    const state = useBuilderStore.getState();
    useCartStore.getState().addItem({
      id: crypto.randomUUID(),
      garmentType: state.garmentType,
      colors: { ...state.colors },
      zoneDesigns: { ...state.zoneDesigns },
      size: 'M',
      quantity: 1,
      unitPrice: pricing.total,
    });
  };

  const handleSaveDesign = () => {
    const state = useBuilderStore.getState();
    const saved = JSON.parse(localStorage.getItem('embroo-saved-designs') || '[]');
    saved.push({
      id: crypto.randomUUID(),
      name: `Design ${saved.length + 1}`,
      garmentType: state.garmentType,
      colors: state.colors,
      zoneDesigns: state.zoneDesigns,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('embroo-saved-designs', JSON.stringify(saved));
    alert('Design saved!');
  };

  return (
    <div className="flex items-center justify-between px-5 py-2.5 bg-charcoal-deep border-b border-[var(--border)] gap-4 flex-shrink-0 flex-wrap">
      {/* Back */}
      <Link
        href="/"
        className="bg-transparent text-text-secondary text-[0.85rem] flex items-center gap-1.5 px-3 py-2 rounded-[8px] transition-all hover:text-gold hover:bg-surface"
      >
        &#8592; Back
      </Link>

      {/* Logo */}
      <div className="font-display text-[1.1rem] font-semibold tracking-[0.2em] text-gold hidden sm:block">
        EMBROO INDIA
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Price */}
        <div className="text-[0.85rem] text-text-secondary hidden sm:block">
          <span className="line-through opacity-60">{formatINR(pricing.subtotal)}</span>
          <span className="text-gold font-bold text-[1.1rem] ml-1.5">
            {formatINR(pricing.total)}
          </span>
        </div>

        {/* Save */}
        <button
          onClick={handleSaveDesign}
          className="bg-surface text-text-secondary w-9 h-9 rounded-full flex items-center justify-center text-[0.9rem] transition-all hover:text-gold hover:border hover:border-[var(--border)]"
          title="Save Design"
          aria-label="Save design"
        >
          &#9829;
        </button>

        {/* Help */}
        <button
          onClick={() => openHelp()}
          className="bg-surface text-text-secondary w-9 h-9 rounded-full flex items-center justify-center text-[0.9rem] transition-all hover:text-gold hover:border hover:border-[var(--border)]"
          title="Help"
          aria-label="Help"
        >
          ?
        </button>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="bg-gold text-charcoal-deep px-6 py-2.5 rounded-[8px] font-semibold text-[0.85rem] tracking-[0.04em] transition-all hover:bg-gold-light hover:-translate-y-px relative"
        >
          Add To Cart
          {getItemCount() > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[0.6rem] w-4 h-4 rounded-full flex items-center justify-center">
              {getItemCount()}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
