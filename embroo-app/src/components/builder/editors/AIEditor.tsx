'use client';

import { useState } from 'react';
import { useBuilderStore } from '@/stores/builderStore';

export function AIEditor() {
  const { activeZone, setZoneDesign } = useBuilderStore();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(false);

  const sanitize = (val: string) => val.replace(/[<>]/g, '').slice(0, 500);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);

    // Placeholder: In production, this calls /api/ai/generate
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setLoading(false);
    setResult(true);
  };

  const handleUse = () => {
    if (activeZone) {
      setZoneDesign(activeZone, {
        type: 'ai',
        aiPrompt: prompt,
        aiResultUrl: '/placeholder-ai-result.png',
        stitchType: 'embroidery',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-[0.75rem] text-text-secondary uppercase tracking-[0.08em] mb-2 block">
          What patch would you like?
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(sanitize(e.target.value))}
          placeholder="Describe your design... e.g. 'A golden lion with a crown'"
          rows={3}
          maxLength={500}
          className="w-full py-3 px-4 bg-surface border border-[var(--border)] rounded-[8px] text-text-primary font-[var(--font-body)] text-base transition-colors focus:border-gold outline-none resize-y min-h-[80px]"
        />
        <div className="text-[0.65rem] text-text-muted text-right mt-1">
          {prompt.length}/500
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !prompt.trim()}
        className="w-full bg-gold text-charcoal-deep py-3 rounded-[8px] font-semibold text-[0.85rem] transition-all hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-charcoal-deep border-t-transparent rounded-full animate-spin" />
            Generating...
          </span>
        ) : (
          'Generate Design'
        )}
      </button>

      {result && (
        <div className="mt-5 space-y-3">
          <div className="bg-[var(--gold-muted)] border border-[var(--border)] rounded-[8px] p-6 text-center min-h-[120px] flex items-center justify-center">
            <span className="text-[3rem]">&#129302;</span>
          </div>
          <p className="text-text-muted text-[0.8rem] text-center">
            AI-generated preview (connect OpenAI API in production)
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleGenerate}
              className="flex-1 py-2.5 bg-transparent border border-gold text-gold rounded-[8px] text-[0.8rem] font-medium transition-all hover:bg-[var(--gold-muted)]"
            >
              Try Again
            </button>
            <button
              onClick={handleUse}
              className="flex-1 py-2.5 bg-gold text-charcoal-deep rounded-[8px] text-[0.8rem] font-semibold transition-all hover:bg-gold-light"
            >
              Use This
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
