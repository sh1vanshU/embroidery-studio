'use client';

import { SectionHeader } from '@/components/ui/SectionHeader';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { GALLERY_ITEMS } from '@/lib/constants';

export function CustomerGallery() {
  return (
    <section className="py-25 bg-charcoal" id="gallery">
      <div className="max-w-[1280px] mx-auto px-6">
        <RevealOnScroll>
          <SectionHeader label="Community" title="Customer Gallery" center />
        </RevealOnScroll>
        <RevealOnScroll>
          <div className="flex gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden">
            {GALLERY_ITEMS.map((item, i) => (
              <div
                key={i}
                className={`flex-shrink-0 w-[200px] h-[200px] bg-gradient-to-br ${item.gradient} border border-[var(--border)] rounded-[16px] flex items-center justify-center text-[0.75rem] text-text-muted text-center transition-all duration-400 cursor-pointer hover:border-gold hover:scale-105 hover:shadow-[var(--shadow-gold)]`}
              >
                {item.label}
                <br />
                {item.tag}
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
