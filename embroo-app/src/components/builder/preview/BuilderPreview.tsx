'use client';

import { useState, useEffect } from 'react';
import { useBuilderStore } from '@/stores/builderStore';
import { HOODIE_ZONES, TSHIRT_ZONES, EMBROIDERY_FONTS } from '@/lib/constants';
import { formatINR, calculatePrice, cn } from '@/lib/utils';
import { HoodieFrontSVG, HoodieBackSVG, TshirtFrontSVG, TshirtBackSVG, PoloFrontSVG } from './GarmentSVGs';
import type { GarmentType, GarmentView } from '@/types';
import dynamic from 'next/dynamic';

// Lazy load the 3D viewer (SSR disabled — WebGL is client-only)
const GarmentViewer = dynamic(
  () => import('@/components/3d/GarmentViewer'),
  { ssr: false }
);

type PreviewMode = '2D' | '3D';

function detectWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return !!gl;
  } catch {
    return false;
  }
}

export function BuilderPreview() {
  const {
    garmentType, setGarmentType,
    view, setView,
    colors, activeZone, zoneDesigns, stitchType,
    threadColor, selectedFont,
  } = useBuilderStore();

  const [previewMode, setPreviewMode] = useState<PreviewMode>('2D');

  // Default to 3D if WebGL is available — detectWebGL touches `document`, so
  // it must run after hydration. The first paint at '2D' is intentional to
  // keep server and client output identical.
  useEffect(() => {
    if (detectWebGL()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewMode('3D');
    }
  }, []);

  const zones = garmentType === 'tshirt' ? TSHIRT_ZONES : HOODIE_ZONES;
  const activeZoneData = zones.find((z) => z.key === activeZone);
  const activeDesign = activeZone ? zoneDesigns[activeZone] : null;
  const pricing = calculatePrice(garmentType, zoneDesigns, stitchType);

  const garmentTabs: { type: GarmentType; label: string }[] = [
    { type: 'hoodie', label: 'Hoodie' },
    { type: 'tshirt', label: 'T-Shirt' },
    { type: 'polo', label: 'Polo' },
  ];

  const renderGarment = () => {
    const svgProps = { bodyColor: colors.body, hoodColor: colors.hood, cuffColor: colors.cuffs };

    if (garmentType === 'tshirt') {
      return view === 'front' ? <TshirtFrontSVG {...svgProps} /> : <TshirtBackSVG {...svgProps} />;
    }
    if (garmentType === 'polo') {
      return <PoloFrontSVG {...svgProps} />;
    }
    return view === 'front' ? <HoodieFrontSVG {...svgProps} /> : <HoodieBackSVG {...svgProps} />;
  };

  return (
    <div className="flex-1 bg-cream flex flex-col items-center justify-center relative overflow-hidden min-h-[45vh]">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(212,168,83,0.03)_0%,transparent_60%)] pointer-events-none" />

      {/* Garment Type Tabs */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1 bg-charcoal-deep/[0.06] p-1 rounded-[8px] z-5">
        {garmentTabs.map((tab) => (
          <button
            key={tab.type}
            onClick={() => setGarmentType(tab.type)}
            className={cn(
              'py-2 px-5 rounded-[6px] text-[0.8rem] font-medium transition-all',
              garmentType === tab.type
                ? 'bg-charcoal-deep text-gold'
                : 'text-[#666] hover:text-[#333]'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 2D / 3D Toggle */}
      <div className="absolute top-4 right-4 flex gap-1 bg-charcoal-deep/[0.06] p-1 rounded-[8px] z-5">
        {(['2D', '3D'] as PreviewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setPreviewMode(mode)}
            className={cn(
              'py-1.5 px-3.5 rounded-[6px] text-[0.75rem] font-semibold transition-all',
              previewMode === mode
                ? 'bg-charcoal-deep text-gold shadow-[0_0_0_1px_var(--color-gold)]'
                : 'text-[#666] hover:text-[#333]'
            )}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Preview Content */}
      {previewMode === '3D' ? (
        <div className="relative z-[2] w-full h-full min-h-[400px] flex-1">
          <GarmentViewer />
        </div>
      ) : (
        <>
          {/* Garment SVG */}
          <div className="relative z-[2] transition-all duration-500">
            <div className="w-[280px] sm:w-[340px] h-auto drop-shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
              {renderGarment()}
            </div>

            {/* Zone Highlight */}
            {activeZoneData && activeZoneData.view === view && (
              <div
                className="absolute border-2 border-dashed border-gold rounded bg-gold/[0.08] pointer-events-none transition-all duration-400 animate-pulse"
                style={{
                  top: activeZoneData.pos.top,
                  left: activeZoneData.pos.left,
                  width: activeZoneData.pos.w,
                  height: activeZoneData.pos.h,
                }}
              />
            )}

            {/* Text Overlay */}
            {activeDesign?.text && activeZoneData && activeZoneData.view === view && (
              <div
                className="absolute pointer-events-none z-[11] text-center"
                style={{
                  top: activeZoneData.pos.top,
                  left: activeZoneData.pos.left,
                  width: activeZoneData.pos.w,
                  color: activeDesign.color || threadColor,
                  fontSize: (activeDesign.text?.length || 0) > 10 ? '0.6rem'
                    : (activeDesign.text?.length || 0) > 3 ? '0.85rem' : '1.4rem',
                  fontFamily: EMBROIDERY_FONTS.find((f) => f.id === (activeDesign.fontId || selectedFont))?.family,
                  fontWeight: 700,
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                }}
              >
                {activeDesign.text}
              </div>
            )}
          </div>
        </>
      )}

      {/* View Toggle */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-5">
        {(['front', 'back'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={cn(
              'py-2 px-6 bg-charcoal-deep rounded-[8px] text-[0.8rem] transition-all capitalize',
              view === v ? 'text-gold shadow-[0_0_0_1px_var(--color-gold)]' : 'text-text-secondary hover:text-text-primary'
            )}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="absolute bottom-5 right-5 bg-charcoal-deep border border-[var(--border)] rounded-[16px] p-4 min-w-[220px] z-5 hidden sm:block">
        <div className="flex justify-between text-[0.8rem] text-text-secondary py-1">
          <span>Base Garment</span>
          <span>{formatINR(pricing.base)}</span>
        </div>
        {pricing.zoneCount > 0 && (
          <div className="flex justify-between text-[0.8rem] text-text-secondary py-1">
            <span>Embroidery ({pricing.zoneCount} zones)</span>
            <span>{formatINR(pricing.embTotal)}</span>
          </div>
        )}
        <div className="flex justify-between text-[0.8rem] text-text-secondary py-1">
          <span>Launch Discount (20%)</span>
          <span className="text-green-400">-{formatINR(pricing.discount)}</span>
        </div>
        <div className="flex justify-between text-[0.95rem] text-gold font-semibold pt-2.5 mt-2 border-t border-[var(--border)]">
          <span>Total</span>
          <span>{formatINR(pricing.total)}</span>
        </div>
      </div>
    </div>
  );
}
