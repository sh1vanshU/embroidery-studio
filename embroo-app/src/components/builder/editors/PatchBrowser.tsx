'use client';

import { useState } from 'react';
import { useBuilderStore } from '@/stores/builderStore';
import { PATCH_CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

const SAMPLE_PATCHES = [
  { id: '1', emoji: '⭐', name: 'Star' },
  { id: '2', emoji: '⚽', name: 'Football' },
  { id: '3', emoji: '🏅', name: 'Medal' },
  { id: '4', emoji: '🏆', name: 'Trophy' },
  { id: '5', emoji: '👑', name: 'Crown' },
  { id: '6', emoji: '🇮🇳', name: 'India Flag' },
  { id: '7', emoji: '🎸', name: 'Guitar' },
  { id: '8', emoji: '🔥', name: 'Fire' },
  { id: '9', emoji: '❤️', name: 'Heart' },
];

export function PatchBrowser() {
  const { activeZone, setZoneDesign } = useBuilderStore();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(0);

  const filteredPatches = search
    ? SAMPLE_PATCHES.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : SAMPLE_PATCHES;

  const handleSelect = (patchId: string) => {
    if (activeZone) {
      setZoneDesign(activeZone, {
        type: 'patch',
        patchId,
        stitchType: 'embroidery',
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value.replace(/[<>]/g, ''))}
        placeholder="Search patches..."
        className="w-full py-2.5 px-4 bg-surface border border-[var(--border)] rounded-[8px] text-text-primary text-[0.85rem] transition-colors focus:border-gold outline-none"
      />

      {/* Categories */}
      <div className="flex gap-1.5 flex-wrap">
        {PATCH_CATEGORIES.map((cat, i) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(i)}
            className={cn(
              'py-1.5 px-2.5 rounded-[8px] text-[0.7rem] border transition-all',
              activeCategory === i
                ? 'border-gold bg-[var(--gold-muted)] text-gold'
                : 'border-[var(--border)] text-text-secondary bg-surface hover:border-gold hover:text-text-primary'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Patch Grid */}
      <div className="grid grid-cols-3 gap-2">
        {filteredPatches.map((patch) => (
          <button
            key={patch.id}
            onClick={() => handleSelect(patch.id)}
            className="bg-surface border border-[var(--border)] rounded-[8px] p-3 text-center text-[1.8rem] transition-all hover:border-gold hover:bg-[var(--gold-muted)]"
            title={patch.name}
            aria-label={`Select ${patch.name} patch`}
          >
            {patch.emoji}
          </button>
        ))}
      </div>

      {filteredPatches.length === 0 && (
        <div className="text-center py-8 text-text-muted text-[0.85rem]">
          No patches found for &ldquo;{search}&rdquo;
        </div>
      )}

      {/* Can't find? */}
      <div className="text-center pt-2 border-t border-[var(--border)]">
        <p className="text-text-muted text-[0.75rem] mb-2">
          Can&apos;t find what you&apos;re looking for?
        </p>
        <button className="text-gold text-[0.8rem] font-medium hover:underline">
          Request Custom Design
        </button>
      </div>
    </div>
  );
}
