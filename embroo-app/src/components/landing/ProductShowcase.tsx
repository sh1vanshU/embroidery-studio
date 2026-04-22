'use client';

import Link from 'next/link';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';

const products = [
  { type: 'hoodie', name: 'Hoodies', price: 'From ₹1,499', svgPath: 'M100 30C80 30 65 40 60 50L40 70C30 80 25 90 25 100L25 200C25 210 30 215 40 215L80 215L80 190L120 190L120 215L160 215C170 215 175 210 175 200L175 100C175 90 170 80 160 70L140 50C135 40 120 30 100 30Z', hoodPath: 'M60 50C65 25 85 10 100 10C115 10 135 25 140 50' },
  { type: 'tshirt', name: 'T-Shirts', price: 'From ₹799', svgPath: 'M70 30L30 60L50 80L70 70L70 210L130 210L130 70L150 80L170 60L130 30Z' },
  { type: 'polo', name: 'Polos', price: 'From ₹999', svgPath: 'M70 35L30 65L50 85L70 75L70 210L130 210L130 75L150 85L170 65L130 35Z', collarPath: 'M85 30L90 50L100 55L110 50L115 30' },
  { type: 'cap', name: 'Caps', price: 'From ₹499', svgPath: 'M30 140C30 100 60 70 100 70C140 70 170 100 170 140', ellipse: true },
];

export function ProductShowcase() {
  return (
    <section className="py-25 bg-charcoal-deep" id="products">
      <div className="max-w-[1280px] mx-auto px-6">
        <RevealOnScroll>
          <SectionHeader label="Our Collection" title="Choose Your Canvas" center />
        </RevealOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <RevealOnScroll key={product.type} delay={i * 0.1}>
              <Link href={`/builder?garment=${product.type}`} className="block">
                <div className="bg-surface border border-[var(--border)] rounded-[16px] overflow-hidden transition-all duration-500 hover:border-gold hover:-translate-y-2 hover:shadow-[var(--shadow-gold),var(--shadow-deep)] group">
                  <div className="h-[220px] flex items-center justify-center bg-gradient-to-br from-charcoal-light to-charcoal-mid relative overflow-hidden">
                    <svg viewBox="0 0 200 240" fill="none" className="w-[120px] h-auto transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                      <path d={product.svgPath} fill="var(--color-gold)" opacity="0.15" stroke="var(--color-gold)" strokeWidth="1.5" />
                      {product.hoodPath && <path d={product.hoodPath} stroke="var(--color-gold)" strokeWidth="1.5" fill="none" />}
                      {product.collarPath && <path d={product.collarPath} stroke="var(--color-gold)" strokeWidth="1.5" fill="none" />}
                      {product.ellipse && <ellipse cx="100" cy="140" rx="70" ry="30" fill="var(--color-gold)" opacity="0.15" stroke="var(--color-gold)" strokeWidth="1.5" />}
                    </svg>
                  </div>
                  <div className="p-5">
                    <div className="font-display text-[1.3rem] mb-1">{product.name}</div>
                    <div className="text-gold font-semibold text-[0.95rem] mb-4">{product.price}</div>
                    <div className="w-full py-2.5 bg-transparent border border-[var(--border)] text-gold text-[0.8rem] font-medium tracking-[0.08em] rounded-[8px] text-center transition-all group-hover:bg-gold group-hover:text-charcoal-deep group-hover:border-gold">
                      Customize Now &rarr;
                    </div>
                  </div>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
