'use client';

import { useRef } from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { BESTSELLERS } from '@/lib/constants';
import { formatINR } from '@/lib/utils';

export function BestSellers() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    trackRef.current?.scrollBy({ left: dir * 260, behavior: 'smooth' });
  };

  return (
    <section className="py-25 bg-charcoal">
      <div className="max-w-[1280px] mx-auto px-6">
        <RevealOnScroll>
          <SectionHeader label="Popular Picks" title="Best Sellers" />
        </RevealOnScroll>

        <div className="relative">
          <div
            ref={trackRef}
            className="flex gap-5 overflow-x-auto scroll-snap-x-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-3"
          >
            {BESTSELLERS.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-[220px] scroll-snap-start bg-surface border border-[var(--border)] rounded-[16px] overflow-hidden transition-all duration-400 hover:border-gold hover:-translate-y-1 cursor-pointer"
              >
                <div className="h-[180px] bg-charcoal-light flex items-center justify-center text-[2.5rem]">
                  👕
                </div>
                <div className="p-3.5">
                  <div className="text-[0.85rem] mb-1.5">{item.name}</div>
                  <div className="flex gap-2 items-center">
                    <span className="text-text-muted line-through text-[0.8rem]">
                      {formatINR(item.originalPrice)}
                    </span>
                    <span className="text-gold font-semibold text-[0.95rem]">
                      {formatINR(item.salePrice)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll(-1)}
            className="absolute left-[-16px] top-1/2 -translate-y-1/2 w-10 h-10 bg-charcoal border border-[var(--border)] rounded-full text-gold text-[1.1rem] flex items-center justify-center transition-all hover:bg-gold hover:text-charcoal-deep z-5"
          >
            &larr;
          </button>
          <button
            onClick={() => scroll(1)}
            className="absolute right-[-16px] top-1/2 -translate-y-1/2 w-10 h-10 bg-charcoal border border-[var(--border)] rounded-full text-gold text-[1.1rem] flex items-center justify-center transition-all hover:bg-gold hover:text-charcoal-deep z-5"
          >
            &rarr;
          </button>
        </div>
      </div>
    </section>
  );
}
