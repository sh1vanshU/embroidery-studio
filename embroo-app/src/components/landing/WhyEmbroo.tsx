'use client';

import { SectionHeader } from '@/components/ui/SectionHeader';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';

const features = [
  { icon: '🧵', title: 'Premium Threads', desc: 'Madeira & Isacord certified threads for vibrant, long-lasting embroidery that won\'t fade.' },
  { icon: '🔮', title: '3D Visualization', desc: 'See your design come alive in an interactive 3D preview before placing your order.' },
  { icon: '📷', title: 'AR Try-On', desc: 'Use your webcam to see yourself wearing your custom garment. The future is here.' },
  { icon: '⚡', title: 'Fast Delivery', desc: '7-10 business days across India. Rush orders available with express delivery.' },
  { icon: '💰', title: 'Bulk Discounts', desc: 'Special pricing for teams, schools, and corporates. Get a quote for 10+ pieces.' },
  { icon: '🇮🇳', title: 'Made in India', desc: 'Proudly crafted with Indian craftsmanship. Supporting local artisans and manufacturers.' },
];

export function WhyEmbroo() {
  return (
    <section className="py-25 bg-charcoal" id="whyEmbroo">
      <div className="max-w-[1280px] mx-auto px-6">
        <RevealOnScroll>
          <SectionHeader label="Why Choose Us" title="The Embroo Difference" center />
        </RevealOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <RevealOnScroll key={f.title} delay={i * 0.08}>
              <div className="bg-surface border border-[var(--border)] border-l-[3px] border-l-gold rounded-[8px] p-7 transition-all duration-400 hover:translate-x-1 hover:border-l-gold-light hover:shadow-[var(--shadow-gold)]">
                <span className="text-[1.6rem] block mb-4">{f.icon}</span>
                <h3 className="font-display text-[1.2rem] mb-2">{f.title}</h3>
                <p className="text-text-secondary text-[0.85rem] leading-relaxed">{f.desc}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
