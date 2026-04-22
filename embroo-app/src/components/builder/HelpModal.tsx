'use client';

import { useState } from 'react';
import { useUiStore } from '@/stores/uiStore';
import { SIZE_DATA } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function HelpModal() {
  const { isHelpModalOpen, helpModalTab, closeHelp } = useUiStore();
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  if (!isHelpModalOpen) return null;

  const switchTab = (tab: 'design' | 'size') => {
    useUiStore.setState({ helpModalTab: tab });
  };

  const formatMeasurement = (inches: number) => {
    if (unit === 'cm') return `${Math.round(inches * 2.54)} cm`;
    return `${inches}"`;
  };

  return (
    <div
      className="fixed inset-0 z-[3000] bg-black/60 backdrop-blur-[4px] flex items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && closeHelp()}
      role="dialog"
      aria-modal="true"
      aria-label="Help and support"
    >
      <div className="bg-charcoal border border-[var(--border)] rounded-[24px] w-[90%] max-w-[560px] max-h-[85vh] overflow-hidden animate-[modalIn_0.4s_var(--ease-out)]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-[var(--border)]">
          <h2 className="font-display text-[1.3rem]">Help & Support</h2>
          <button
            onClick={closeHelp}
            className="bg-transparent text-text-secondary text-xl p-1 transition-colors hover:text-gold"
            aria-label="Close help"
          >
            &times;
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--border)]">
          {(['design', 'size'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => switchTab(tab)}
              className={cn(
                'flex-1 py-3 text-[0.85rem] border-b-2 transition-all',
                helpModalTab === tab
                  ? 'text-gold border-b-gold'
                  : 'text-text-secondary border-b-transparent'
              )}
            >
              {tab === 'design' ? 'Design Help' : 'Size Guide'}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {helpModalTab === 'design' ? (
            <form onSubmit={(e) => { e.preventDefault(); alert('Message sent! We\'ll get back to you soon.'); closeHelp(); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-[0.8rem] text-text-secondary mb-1.5">Your Name *</label>
                  <input type="text" required placeholder="Full name" className="w-full py-2.5 px-3.5 bg-surface border border-[var(--border)] rounded-[8px] text-text-primary text-[0.9rem] focus:border-gold outline-none" />
                </div>
                <div>
                  <label className="block text-[0.8rem] text-text-secondary mb-1.5">Your Email *</label>
                  <input type="email" required placeholder="email@example.com" className="w-full py-2.5 px-3.5 bg-surface border border-[var(--border)] rounded-[8px] text-text-primary text-[0.9rem] focus:border-gold outline-none" />
                </div>
                <div>
                  <label className="block text-[0.8rem] text-text-secondary mb-1.5">Your Phone</label>
                  <input type="tel" placeholder="+91 XXXXX XXXXX" className="w-full py-2.5 px-3.5 bg-surface border border-[var(--border)] rounded-[8px] text-text-primary text-[0.9rem] focus:border-gold outline-none" />
                </div>
                <div>
                  <label className="block text-[0.8rem] text-text-secondary mb-1.5">How can we help? *</label>
                  <textarea required placeholder="Describe your design needs..." rows={4} className="w-full py-2.5 px-3.5 bg-surface border border-[var(--border)] rounded-[8px] text-text-primary text-[0.9rem] focus:border-gold outline-none resize-y min-h-[80px]" />
                </div>
                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={closeHelp} className="py-2.5 px-6 bg-transparent border border-gold text-gold rounded-[8px] text-[0.85rem] font-medium transition-all hover:bg-[var(--gold-muted)]">
                    Cancel
                  </button>
                  <button type="submit" className="py-2.5 px-6 bg-gold text-charcoal-deep rounded-[8px] text-[0.85rem] font-semibold transition-all hover:bg-gold-light">
                    Send
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div>
              {/* Unit Toggle */}
              <div className="flex gap-2 mb-4">
                {(['in', 'cm'] as const).map((u) => (
                  <button
                    key={u}
                    onClick={() => setUnit(u)}
                    className={cn(
                      'py-1.5 px-4 rounded-[8px] text-[0.8rem] border transition-all',
                      unit === u
                        ? 'border-gold text-gold bg-[var(--gold-muted)]'
                        : 'border-[var(--border)] text-text-secondary bg-surface'
                    )}
                  >
                    {u === 'in' ? 'Inches' : 'Centimeters'}
                  </button>
                ))}
              </div>

              {/* Size Table */}
              <table className="w-full text-[0.8rem] border-collapse">
                <thead>
                  <tr>
                    <th className="bg-surface p-2.5 text-left text-gold font-medium border-b border-[var(--border)]">Size</th>
                    <th className="bg-surface p-2.5 text-left text-gold font-medium border-b border-[var(--border)]">Chest</th>
                    <th className="bg-surface p-2.5 text-left text-gold font-medium border-b border-[var(--border)]">Length</th>
                    <th className="bg-surface p-2.5 text-left text-gold font-medium border-b border-[var(--border)]">Sleeve</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZE_DATA.map((row) => (
                    <tr key={row.size} className="hover:bg-[var(--gold-muted)] transition-colors">
                      <td className="p-2.5 border-b border-gold/[0.06] text-text-secondary font-medium">{row.size}</td>
                      <td className="p-2.5 border-b border-gold/[0.06] text-text-secondary">{formatMeasurement(row.chest)}</td>
                      <td className="p-2.5 border-b border-gold/[0.06] text-text-secondary">{formatMeasurement(row.length)}</td>
                      <td className="p-2.5 border-b border-gold/[0.06] text-text-secondary">{formatMeasurement(row.sleeve)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
