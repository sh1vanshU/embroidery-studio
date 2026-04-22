'use client';

import { SectionHeader } from '@/components/ui/SectionHeader';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';

const steps = [
  { icon: '👕', num: 'STEP 01', title: 'Choose Your Canvas', desc: 'Pick from hoodies, t-shirts, polos, caps and more. Select your size and base color.' },
  { icon: '🧵', num: 'STEP 02', title: 'Craft Your Design', desc: 'Add text, upload logos, browse patches or use AI to generate embroidery designs.' },
  { icon: '🔮', num: 'STEP 03', title: 'Preview & Order', desc: 'See your creation in 3D, try it on with AR, and place your order. Delivered in 7-10 days.' },
];

export function HowItWorks() {
  return (
    <section className="py-25 bg-charcoal relative stitch-bg">
      <div className="max-w-[1280px] mx-auto px-6">
        <RevealOnScroll>
          <SectionHeader label="Simple Process" title="How It Works" subtitle="From idea to embroidered garment in three simple steps" center />
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          {/* Connecting stitch line */}
          <div className="hidden md:block absolute top-[50px] left-[15%] right-[15%] h-0.5 bg-[repeating-linear-gradient(90deg,var(--color-gold)_0,var(--color-gold)_8px,transparent_8px,transparent_16px)] opacity-30" />

          {steps.map((step, i) => (
            <RevealOnScroll key={step.num} delay={i * 0.1}>
              <div className="text-center relative z-[1]">
                <div className="w-[100px] h-[100px] mx-auto mb-6 bg-surface border border-[var(--border)] rounded-full flex items-center justify-center text-[2rem] transition-all duration-500 hover:border-gold hover:shadow-[var(--shadow-gold)] hover:-translate-y-2">
                  {step.icon}
                </div>
                <div className="font-display text-[0.75rem] text-gold tracking-[0.2em] mb-3">
                  {step.num}
                </div>
                <h3 className="font-display text-[1.4rem] mb-2">{step.title}</h3>
                <p className="text-text-secondary text-[0.9rem] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
