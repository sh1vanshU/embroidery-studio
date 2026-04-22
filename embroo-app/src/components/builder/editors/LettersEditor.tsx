'use client';

import { useState } from 'react';
import { useBuilderStore } from '@/stores/builderStore';
import { EMBROIDERY_FONTS, THREAD_COLORS, OUTLINE_OPTIONS, STITCH_PRICES } from '@/lib/constants';
import { formatINR, cn } from '@/lib/utils';
import type { StitchType } from '@/types';

export function LettersEditor() {
  const {
    activeZone, threadColor, setThreadColor,
    stitchType, setStitchType,
    selectedFont, setFont, outline, setOutline,
    setZoneDesign,
  } = useBuilderStore();

  const [text, setText] = useState('ABC');
  const [interlocked, setInterlocked] = useState(false);

  const handleTextChange = (value: string) => {
    const sanitized = value.replace(/[<>'"&]/g, '').slice(0, 3).toUpperCase();
    setText(sanitized);
    if (activeZone && sanitized) {
      setZoneDesign(activeZone, {
        type: 'letters',
        text: sanitized,
        fontId: selectedFont,
        color: threadColor,
        outline: outline ?? undefined,
        stitchType,
        interlocked,
      });
    }
  };

  return (
    <div className="space-y-5">
      {/* Preview */}
      <div className="bg-surface border border-[var(--border)] rounded-[8px] p-6 text-center min-h-[80px] flex items-center justify-center">
        <span
          className="text-[2.2rem] font-bold tracking-[0.1em] transition-all"
          style={{
            color: threadColor,
            fontFamily: EMBROIDERY_FONTS.find((f) => f.id === selectedFont)?.family,
            fontStyle: EMBROIDERY_FONTS.find((f) => f.id === selectedFont)?.style,
            letterSpacing: interlocked ? '-0.1em' : '0.1em',
            textShadow: outline ? `0 0 2px ${outline}` : 'none',
          }}
        >
          {text || 'ABC'}
        </span>
      </div>

      {/* Text Input */}
      <div>
        <label className="text-[0.75rem] text-text-secondary uppercase tracking-[0.08em] mb-2 block">
          Enter Letters (max 3)
        </label>
        <input
          type="text"
          maxLength={3}
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="ABC"
          className="w-full py-3 px-4 bg-surface border border-[var(--border)] rounded-[8px] text-text-primary font-[var(--font-body)] text-base transition-colors focus:border-gold outline-none"
        />
      </div>

      {/* Interlocked Toggle */}
      <div className="flex items-center justify-between py-2.5 border-b border-gold/[0.08]">
        <span className="text-[0.85rem]">Interlocked</span>
        <button
          onClick={() => setInterlocked(!interlocked)}
          className={cn(
            'w-11 h-6 rounded-xl relative transition-colors',
            interlocked ? 'bg-[var(--gold-muted)]' : 'bg-charcoal-light'
          )}
          role="switch"
          aria-checked={interlocked}
        >
          <span
            className={cn(
              'absolute top-[3px] w-[18px] h-[18px] rounded-full transition-all',
              interlocked ? 'left-[23px] bg-gold' : 'left-[3px] bg-text-secondary'
            )}
          />
        </button>
      </div>

      {/* Font Picker */}
      <div>
        <label className="text-[0.75rem] text-text-secondary uppercase tracking-[0.08em] mb-2 block">
          Font
        </label>
        <div className="grid grid-cols-3 gap-2">
          {EMBROIDERY_FONTS.map((font) => (
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
              <span
                className="text-[1.6rem] text-text-primary"
                style={{ fontFamily: font.family, fontStyle: font.style, fontWeight: font.weight }}
              >
                A
              </span>
              <span className="text-[0.55rem] text-text-muted uppercase tracking-[0.05em]">
                {font.name}
              </span>
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
          {THREAD_COLORS.map((color) => (
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

      {/* Outline */}
      <div>
        <label className="text-[0.75rem] text-text-secondary uppercase tracking-[0.08em] mb-2 block">
          Outline
        </label>
        <div className="flex gap-2">
          {OUTLINE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setOutline(opt.color)}
              className={cn(
                'py-2 px-3.5 bg-surface border rounded-[8px] text-[0.75rem] transition-all',
                outline === opt.color
                  ? 'border-gold bg-[var(--gold-muted)] text-gold'
                  : 'border-[var(--border)] text-text-secondary hover:border-gold hover:text-text-primary'
              )}
            >
              {opt.name}
            </button>
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
              <div className="text-[0.7rem] text-text-muted mt-0.5">
                {formatINR(STITCH_PRICES[type])}/zone
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
