'use client';

import { SectionHeader } from '@/components/ui/SectionHeader';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { TESTIMONIALS } from '@/lib/constants';

export function Testimonials() {
  return (
    <section className="py-25 bg-charcoal-deep" id="testimonials">
      <div className="max-w-[1280px] mx-auto px-6">
        <RevealOnScroll>
          <SectionHeader label="What People Say" title="Loved by Thousands" center />
        </RevealOnScroll>
        <RevealOnScroll>
          <div className="flex gap-6 justify-center flex-wrap">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="bg-surface border border-[var(--border)] rounded-[16px] p-8 max-w-[380px] flex-1 min-w-[280px] transition-all duration-400 hover:border-gold hover:-translate-y-1"
              >
                <div className="text-gold text-[0.9rem] mb-4 tracking-[2px]">
                  {'★'.repeat(t.rating)}
                </div>
                <p className="font-display text-[1.1rem] italic leading-relaxed mb-5 text-text-primary">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="font-semibold text-[0.9rem]">{t.author}</div>
                <div className="text-text-muted text-[0.8rem]">{t.location}</div>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
