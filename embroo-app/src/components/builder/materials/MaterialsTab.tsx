'use client';

import { useState } from 'react';
import { useBuilderStore } from '@/stores/builderStore';
import { GARMENT_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';

type MaterialView = 'list' | 'picker';
type MaterialSection = 'body' | 'hood' | 'cuffs';

const SECTION_LABELS: Record<MaterialSection, string> = {
  body: 'Body',
  hood: 'Hood',
  cuffs: 'Cuffs & Hem',
};

export function MaterialsTab() {
  const [view, setView] = useState<MaterialView>('list');
  const [activeSection, setActiveSection] = useState<MaterialSection>('body');
  const { colors, setColor } = useBuilderStore();

  const openPicker = (section: MaterialSection) => {
    setActiveSection(section);
    setView('picker');
  };

  if (view === 'picker') {
    return (
      <div className="animate-[panelFade_0.3s_var(--ease-out)]">
        {/* Navigation */}
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-[var(--border)]">
          <button
            onClick={() => setView('list')}
            className="bg-transparent text-text-secondary text-base p-1 transition-colors hover:text-gold"
            aria-label="Go back"
          >
            &larr;
          </button>
          <span className="text-[0.9rem] font-semibold text-text-primary">
            {SECTION_LABELS[activeSection]} Color
          </span>
        </div>

        {/* Color Grid */}
        <div className="grid grid-cols-4 gap-3">
          {GARMENT_COLORS.map((color) => (
            <button
              key={color.id}
              onClick={() => setColor(activeSection, color.hex)}
              className={cn(
                'aspect-square rounded-full border-[3px] transition-all duration-300 relative group',
                colors[activeSection] === color.hex
                  ? 'border-gold shadow-[0_0_0_3px_var(--gold-muted)] scale-[1.08]'
                  : 'border-transparent hover:scale-[1.12]'
              )}
              style={{ background: color.hex }}
              title={color.name}
              aria-label={`Select ${color.name}`}
            >
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[0.65rem] text-text-muted whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {color.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5 animate-[panelFade_0.3s_var(--ease-out)]">
      {(Object.keys(SECTION_LABELS) as MaterialSection[]).map((section) => {
        const colorName = GARMENT_COLORS.find((c) => c.hex === colors[section])?.name || 'Custom';
        return (
          <button
            key={section}
            onClick={() => openPicker(section)}
            className="bg-surface border border-[var(--border)] rounded-[8px] p-4 flex items-center justify-between transition-all hover:border-gold group text-left w-full"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-full border-2 border-white/10"
                style={{ background: colors[section] }}
              />
              <div>
                <div className="text-[0.9rem] font-medium">{SECTION_LABELS[section]}</div>
                <div className="text-[0.75rem] text-text-muted">{colorName}</div>
              </div>
            </div>
            <span className="text-text-muted text-[0.8rem] group-hover:text-gold transition-colors">
              &rarr;
            </span>
          </button>
        );
      })}

      <style jsx>{`
        @keyframes panelFade {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
