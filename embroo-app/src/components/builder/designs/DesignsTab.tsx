'use client';

import { useState } from 'react';
import { useBuilderStore } from '@/stores/builderStore';
import { HOODIE_ZONES, TSHIRT_ZONES, DESIGN_TYPES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { DesignType, ZoneKey } from '@/types';
import { LettersEditor } from '@/components/builder/editors/LettersEditor';
import { TextEditor } from '@/components/builder/editors/TextEditor';
import { UploadEditor } from '@/components/builder/editors/UploadEditor';
import { AIEditor } from '@/components/builder/editors/AIEditor';
import { PatchBrowser } from '@/components/builder/editors/PatchBrowser';

type DesignView = 'zones' | 'types' | 'editor';

export function DesignsTab() {
  const [view, setView] = useState<DesignView>('zones');
  const { garmentType, activeZone, selectZone, clearZone, activeEditor, setActiveEditor } = useBuilderStore();

  const zones = garmentType === 'tshirt' ? TSHIRT_ZONES : HOODIE_ZONES;
  const activeZoneData = zones.find((z) => z.key === activeZone);

  const handleZoneClick = (key: ZoneKey) => {
    selectZone(key);
    setView('types');
  };

  const handleTypeClick = (type: DesignType) => {
    setActiveEditor(type);
    setView('editor');
  };

  const handleBackToZones = () => {
    clearZone();
    setView('zones');
  };

  const handleBackToTypes = () => {
    setActiveEditor(null);
    setView('types');
  };

  // Editor view
  if (view === 'editor' && activeEditor) {
    return (
      <div className="animate-[panelFade_0.3s_var(--ease-out)]">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-[var(--border)]">
          <button onClick={handleBackToTypes} className="bg-transparent text-text-secondary text-base p-1 hover:text-gold" aria-label="Back">
            &larr;
          </button>
          <span className="text-[0.9rem] font-semibold text-text-primary">
            {DESIGN_TYPES.find((d) => d.key === activeEditor)?.name || 'Editor'}
          </span>
          <span className="text-[0.7rem] text-text-muted ml-auto">
            {activeZoneData?.label}
          </span>
        </div>
        <EditorRouter type={activeEditor} />

        <style jsx>{`
          @keyframes panelFade {
            from { opacity: 0; transform: translateX(-10px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}</style>
      </div>
    );
  }

  // Design type chooser
  if (view === 'types') {
    return (
      <div className="animate-[panelFade_0.3s_var(--ease-out)]">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-[var(--border)]">
          <button onClick={handleBackToZones} className="bg-transparent text-text-secondary text-base p-1 hover:text-gold" aria-label="Back">
            &larr;
          </button>
          <span className="text-[0.9rem] font-semibold text-text-primary">
            {activeZoneData?.label || 'Choose Design Type'}
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          {DESIGN_TYPES.map((dt) => (
            <button
              key={dt.key}
              onClick={() => handleTypeClick(dt.key as DesignType)}
              className="bg-surface border border-[var(--border)] rounded-[8px] p-3.5 flex items-center gap-3 transition-all hover:border-gold hover:bg-surface-hover text-left w-full"
            >
              <div className="w-9 h-9 bg-[var(--gold-muted)] rounded-lg flex items-center justify-center text-base flex-shrink-0">
                {dt.icon}
              </div>
              <div>
                <div className="text-[0.85rem] font-medium">{dt.name}</div>
                <div className="text-[0.7rem] text-text-muted">{dt.desc}</div>
              </div>
            </button>
          ))}
        </div>

        <style jsx>{`
          @keyframes panelFade {
            from { opacity: 0; transform: translateX(-10px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}</style>
      </div>
    );
  }

  // Zone grid (default)
  return (
    <div className="animate-[panelFade_0.3s_var(--ease-out)]">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
        {zones.map((zone) => {
          const hasDesign = useBuilderStore.getState().zoneDesigns[zone.key];
          return (
            <button
              key={zone.key}
              onClick={() => handleZoneClick(zone.key)}
              className={cn(
                'bg-surface border rounded-[8px] p-2 text-center transition-all hover:border-gold relative',
                activeZone === zone.key
                  ? 'border-gold bg-[var(--gold-muted)]'
                  : 'border-[var(--border)]'
              )}
            >
              {/* Mini hoodie SVG with zone highlight */}
              <svg viewBox="0 0 100 120" fill="none" className="w-full h-[60px] mb-1">
                <path
                  d="M50 25 L30 25 L20 35 C15 40 12 45 12 50 L12 100 C12 105 15 107 20 107 L40 107 L40 95 L60 95 L60 107 L80 107 C85 107 88 105 88 100 L88 50 C88 45 85 40 80 35 L70 25 L50 25Z"
                  fill="var(--color-charcoal-light)"
                  stroke="var(--border)"
                  strokeWidth="0.5"
                />
                <path
                  d="M30 25 C33 12 42 5 50 5 C58 5 67 12 70 25Z"
                  fill="var(--color-charcoal-mid)"
                  stroke="var(--border)"
                  strokeWidth="0.5"
                />
                <ZoneHighlightSVG zoneKey={zone.key} />
              </svg>
              <div className="text-[0.6rem] text-text-secondary leading-[1.3]">{zone.label}</div>
              {hasDesign && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-gold rounded-full" title="Has design" />
              )}
            </button>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes panelFade {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

function ZoneHighlightSVG({ zoneKey }: { zoneKey: string }) {
  const highlights: Record<string, React.ReactNode> = {
    rightChest: <rect x="20" y="30" width="22" height="18" rx="2" fill="var(--color-gold)" opacity="0.4" />,
    leftChest: <rect x="58" y="30" width="22" height="18" rx="2" fill="var(--color-gold)" opacity="0.4" />,
    rightShoulder: <rect x="16" y="22" width="20" height="12" rx="2" fill="var(--color-gold)" opacity="0.4" />,
    leftShoulder: <rect x="64" y="22" width="20" height="12" rx="2" fill="var(--color-gold)" opacity="0.4" />,
    aboveRightElbow: <rect x="10" y="38" width="14" height="16" rx="2" fill="var(--color-gold)" opacity="0.4" />,
    aboveLeftElbow: <rect x="76" y="38" width="14" height="16" rx="2" fill="var(--color-gold)" opacity="0.4" />,
    belowRightElbow: <rect x="10" y="56" width="14" height="16" rx="2" fill="var(--color-gold)" opacity="0.4" />,
    belowLeftElbow: <rect x="76" y="56" width="14" height="16" rx="2" fill="var(--color-gold)" opacity="0.4" />,
    bottomRightSleeve: <rect x="10" y="46" width="12" height="12" rx="2" fill="var(--color-gold)" opacity="0.4" />,
    bottomLeftSleeve: <rect x="78" y="46" width="12" height="12" rx="2" fill="var(--color-gold)" opacity="0.4" />,
    back: <rect x="25" y="35" width="50" height="35" rx="2" fill="var(--color-gold)" opacity="0.4" />,
    front: <rect x="25" y="55" width="50" height="30" rx="2" fill="var(--color-gold)" opacity="0.4" />,
  };
  return <>{highlights[zoneKey] || null}</>;
}

function EditorRouter({ type }: { type: DesignType }) {
  switch (type) {
    case 'letters':
      return <LettersEditor />;
    case 'monoText':
    case 'text2Lines':
    case 'textPatch':
      return <TextEditor variant={type} />;
    case 'upload':
      return <UploadEditor />;
    case 'ai':
      return <AIEditor />;
    case 'patch':
    case 'myPatches':
    case 'patchText':
      return <PatchBrowser />;
    default:
      return <LettersEditor />;
  }
}
