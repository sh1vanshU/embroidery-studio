'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type GarmentFilter = 'all' | 'HOODIE' | 'TSHIRT' | 'POLO' | 'CAP';

interface SavedDesign {
  id: string;
  name: string;
  garmentType: 'HOODIE' | 'TSHIRT' | 'POLO' | 'CAP';
  thumbnailUrl: string | null;
  colors: { body: string; hood: string; cuffs: string };
  updatedAt: string;
}

const garmentLabels: Record<string, string> = {
  HOODIE: 'Hoodie',
  TSHIRT: 'T-Shirt',
  POLO: 'Polo',
  CAP: 'Cap',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function DesignsPage() {
  const [filter, setFilter] = useState<GarmentFilter>('all');
  const [search, setSearch] = useState('');
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/designs')
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error ?? 'Failed to load designs');
        return r.json();
      })
      .then((data) => {
        if (cancelled) return;
        setDesigns(
          (data.designs ?? []).map(
            (d: { id: string; name: string; garmentType: SavedDesign['garmentType']; thumbnailUrl: string | null; colors: SavedDesign['colors']; updatedAt: string }) => ({
              id: d.id,
              name: d.name,
              garmentType: d.garmentType,
              thumbnailUrl: d.thumbnailUrl,
              colors: d.colors,
              updatedAt: d.updatedAt,
            }),
          ),
        );
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load designs');
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = designs.filter((d) => {
    if (filter !== 'all' && d.garmentType !== filter) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this design?')) return;
    const res = await fetch(`/api/designs/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      alert('Failed to delete design.');
      return;
    }
    setDesigns((prev) => prev.filter((d) => d.id !== id));
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
          {(['all', 'HOODIE', 'TSHIRT', 'POLO', 'CAP'] as const).map((f) => (
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

      {/* States */}
      {loading ? (
        <div className="bg-surface rounded-[var(--radius-md)] border border-[var(--border)] p-12 text-center">
          <p className="text-text-muted text-sm">Loading designs…</p>
        </div>
      ) : error ? (
        <div className="bg-surface rounded-[var(--radius-md)] border border-red-500/30 p-12 text-center">
          <h3 className="text-red-400 font-medium mb-1">Couldn&apos;t load designs</h3>
          <p className="text-text-muted text-sm">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
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
              <div className="aspect-[4/3] relative flex items-center justify-center" style={{ background: design.colors?.body ?? '#1A1A2E' }}>
                <svg className="w-16 h-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={0.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                {/* Color swatches */}
                <div className="absolute bottom-2 left-2 flex gap-1">
                  {design.colors && Object.values(design.colors).map((color, i) => (
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
                <p className="text-xs text-text-muted mt-0.5">{formatDate(design.updatedAt)}</p>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--border)]">
                  <Link
                    href={`/builder?design=${design.id}`}
                    className="flex-1 text-center py-1.5 rounded text-xs font-medium text-gold bg-gold/10 hover:bg-gold/20 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(design.id)}
                    className="py-1.5 px-2 rounded text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors cursor-pointer"
                    aria-label="Delete"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
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
