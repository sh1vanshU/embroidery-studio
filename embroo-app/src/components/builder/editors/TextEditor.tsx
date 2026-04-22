'use client';

import { useState } from 'react';
import { useBuilderStore } from '@/stores/builderStore';
import { EMBROIDERY_FONTS, THREAD_COLORS, STITCH_PRICES } from '@/lib/constants';
import { formatINR, cn } from '@/lib/utils';
import type { DesignType, StitchType } from '@/types';

interface TextEditorProps {
  variant?: DesignType;
}

export function TextEditor({ variant = 'monoText' }: TextEditorProps) {
  const {
    activeZone, threadColor, setThreadColor,
    stitchType, setStitchType, selectedFont, setFont,
    setZoneDesign,
  } = useBuilderStore();

  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const isTwoLine = variant === 'text2Lines';

  const sanitize = (val: string) => val.replace(/[<>'"&]/g, '');

  const handleChange = (l1: string, l2: string) => {
    const s1 = sanitize(l1);
    const s2 = sanitize(l2);
    setLine1(s1);
    setLine2(s2);
    if (activeZone) {
      setZoneDesign(activeZone, {
        type: variant,
        text: isTwoLine ? undefined : s1,
        twoLineTexts: isTwoLine ? [s1, s2] : undefined,
        fontId: selectedFont,
        color: threadColor,
        stitchType,
      });
    }
  };

  return (
    <div className="space-y-5">
      {/* Text Input */}
      <div>
        <label className="text-[0.75rem] text-text-secondary uppercase tracking-[0.08em] mb-2 block">
          {isTwoLine ? 'Line 1' : 'Enter Text'}
        </label>
        <textarea
          value={line1}
          onChange={(e) => handleChange(e.target.value, line2)}
          placeholder="Type your text here..."
          rows={isTwoLine ? 2 : 4}
          className="w-full py-3 px-4 bg-surface border border-[var(--border)] rounded-[8px] text-text-primary font-[var(--font-body)] text-base transition-colors focus:border-gold outline-none resize-y min-h-[60px]"
        />
      </div>

      {isTwoLine && (
        <div>
          <label className="text-[0.75rem] text-text-secondary uppercase tracking-[0.08em] mb-2 block">
            Line 2
          </label>
          <textarea
            value={line2}
            onChange={(e) => handleChange(line1, e.target.value)}
            placeholder="Second line..."
            rows={2}
            className="w-full py-3 px-4 bg-surface border border-[var(--border)] rounded-[8px] text-text-primary font-[var(--font-body)] text-base transition-colors focus:border-gold outline-none resize-y min-h-[60px]"
          />
        </div>
      )}

      {/* Font Picker */}
      <div>
        <label className="text-[0.75rem] text-text-secondary uppercase tracking-[0.08em] mb-2 block">
          Font
        </label>
        <div className="grid grid-cols-3 gap-2">
          {EMBROIDERY_FONTS.slice(0, 3).map((font) => (
            <button
              key={font.id}
              onClick={() => setFont(font.id)}
              className={cn(
                'aspect-square bg-surface border rounded-[8px] flex flex-col items-center justify-center gap-1 transition-all',
                selectedFont === font.id
                  ? 'border-gold bg-[var(--gold-muted)]'
                  : 'border-[var(--border)] hover:border-gold'
              )}
            >
              <span className="text-[1.6rem] text-text-primary" style={{ fontFamily: font.family, fontStyle: font.style }}>
                Aa
              </span>
              <span className="text-[0.55rem] text-text-muted uppercase">{font.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Thread Color */}
      <div>
        <label className="text-[0.75rem] text-text-secondary uppercase tracking-[0.08em] mb-2 block">
          Thread Color
        </label>
        <div className="flex flex-wrap gap-2">
          {THREAD_COLORS.slice(0, 6).map((color) => (
            <button
              key={color.id}
              onClick={() => setThreadColor(color.hex)}
              className={cn(
                'w-8 h-8 rounded-full border-2 transition-all',
                threadColor === color.hex
                  ? 'border-gold shadow-[0_0_0_3px_var(--gold-muted)]'
                  : 'border-transparent hover:scale-[1.2]'
              )}
              style={{ background: color.hex }}
              title={color.name}
              aria-label={`Thread color: ${color.name}`}
            />
          ))}
        </div>
      </div>

      {/* Stitch Type */}
      <div>
        <label className="text-[0.75rem] text-text-secondary uppercase tracking-[0.08em] mb-2 block">
          Stitch Type
        </label>
        <div className="flex gap-2">
          {(['embroidery', 'chenille'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setStitchType(type as StitchType)}
              className={cn(
                'flex-1 py-3 bg-surface border rounded-[8px] text-center transition-all',
                stitchType === type
                  ? 'border-gold bg-[var(--gold-muted)]'
                  : 'border-[var(--border)] hover:border-gold'
              )}
            >
              <div className="text-[0.8rem] font-medium capitalize">{type}</div>
              <div className="text-[0.7rem] text-text-muted mt-0.5">{formatINR(STITCH_PRICES[type])}/zone</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
