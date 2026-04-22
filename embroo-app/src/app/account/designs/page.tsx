'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';

type GarmentFilter = 'all' | 'hoodie' | 'tshirt' | 'polo' | 'cap';

interface SavedDesign {
  id: string;
  name: string;
  garmentType: 'hoodie' | 'tshirt' | 'polo' | 'cap';
  date: string;
  colors: { body: string; hood: string; cuffs: string };
}

// Mock data
const mockDesigns: SavedDesign[] = [
  { id: 'd1', name: 'College Varsity Hoodie', garmentType: 'hoodie', date: '2026-04-07', colors: { body: '#1A1A2E', hood: '#D4A853', cuffs: '#1A1A2E' } },
  { id: 'd2', name: 'Team Logo Tee', garmentType: 'tshirt', date: '2026-04-03', colors: { body: '#FFFFFF', hood: '#FFFFFF', cuffs: '#FFFFFF' } },
  { id: 'd3', name: 'Event Polo', garmentType: 'polo', date: '2026-03-25', colors: { body: '#0F3460', hood: '#0F3460', cuffs: '#E94560' } },
  { id: 'd4', name: 'Summer Hoodie', garmentType: 'hoodie', date: '2026-03-20', colors: { body: '#16213E', hood: '#E94560', cuffs: '#16213E' } },
  { id: 'd5', name: 'Classic Black Tee', garmentType: 'tshirt', date: '2026-03-15', colors: { body: '#111111', hood: '#111111', cuffs: '#111111' } },
];

const garmentLabels: Record<string, string> = {
  hoodie: 'Hoodie',
  tshirt: 'T-Shirt',
  polo: 'Polo',
  cap: 'Cap',
};

export default function DesignsPage() {
  const [filter, setFilter] = useState<GarmentFilter>('all');
  const [search, setSearch] = useState('');
  const [designs, setDesigns] = useState(mockDesigns);

  const filtered = designs.filter((d) => {
    if (filter !== 'all' && d.garmentType !== filter) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this design?')) {
      setDesigns((prev) => prev.filter((d) => d.id !== id));
    }
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="font-[var(--font-display)] text-2xl font-semibold text-text-primary">
          My Designs
        </h1>
        <Link
          href="/builder"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-sm)] bg-gold text-charcoal-deep font-semibold text-sm hover:bg-gold-light transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Design
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search designs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-[var(--radius-sm)] bg-charcoal-light border border-[var(--border)] text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-gold transition-colors"
        />
        <div className="flex gap-2 flex-wrap">
          {(['all', 'hoodie', 'tshirt', 'polo', 'cap'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-2 rounded-[var(--radius-sm)] text-xs font-medium transition-colors cursor-pointer ${
                filter === f
                  ? 'bg-gold/15 text-gold border border-gold/30'
                  : 'bg-surface border border-[var(--border)] text-text-secondary hover:text-text-primary'
              }`}
            >
              {f === 'all' ? 'All' : garmentLabels[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-surface rounded-[var(--radius-md)] border border-[var(--border)] p-12 text-center">
          <svg className="w-12 h-12 mx-auto text-text-muted mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
          </svg>
          <h3 className="text-text-primary font-medium mb-1">No designs yet</h3>
          <p className="text-text-muted text-sm mb-4">Create your first custom design in the builder.</p>
          <Link
            href="/builder"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-sm)] bg-gold text-charcoal-deep font-semibold text-sm hover:bg-gold-light transition-colors"
          >
            Open Builder
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((design) => (
            <div
              key={design.id}
              className="bg-surface rounded-[var(--radius-md)] border border-[var(--border)] overflow-hidden group hover:border-gold/30 transition-all"
            >
              {/* Thumbnail placeholder */}
              <div className="aspect-[4/3] relative flex items-center justify-center" style={{ background: design.colors.body }}>
                <svg className="w-16 h-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={0.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                {/* Color swatches */}
                <div className="absolute bottom-2 left-2 flex gap-1">
                  {Object.values(design.colors).map((color, i) => (
                    <div key={i} className="w-4 h-4 rounded-full border border-white/30" style={{ backgroundColor: color }} />
                  ))}
                </div>
                {/* Type badge */}
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-medium bg-black/40 text-white backdrop-blur-sm">
                  {garmentLabels[design.garmentType]}
                </span>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-sm font-medium text-text-primary truncate">{design.name}</h3>
                <p className="text-xs text-text-muted mt-0.5">{design.date}</p>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--border)]">
                  <Link
                    href={`/builder?design=${design.id}`}
                    className="flex-1 text-center py-1.5 rounded text-xs font-medium text-gold bg-gold/10 hover:bg-gold/20 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      const dup = { ...design, id: `${design.id}-copy`, name: `${design.name} (Copy)` };
                      setDesigns((prev) => [dup, ...prev]);
                    }}
                    className="flex-1 text-center py-1.5 rounded text-xs font-medium text-text-secondary bg-surface-hover hover:text-text-primary transition-colors cursor-pointer"
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={() => handleDelete(design.id)}
                    className="py-1.5 px-2 rounded text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors cursor-pointer"
                    aria-label="Delete"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(`${window.location.origin}/designs/${design.id}`)}
                    className="py-1.5 px-2 rounded text-xs text-text-secondary bg-surface-hover hover:text-text-primary transition-colors cursor-pointer"
                    aria-label="Share"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
