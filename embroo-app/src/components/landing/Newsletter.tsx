'use client';

import { Button } from '@/components/ui/Button';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';

export function Newsletter() {
  return (
    <section className="py-20 bg-gradient-to-br from-charcoal-light to-charcoal-deep text-center" id="newsletter">
      <div className="max-w-[1280px] mx-auto px-6">
        <RevealOnScroll>
          <div className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-3 text-center">
            Stay Updated
          </div>
          <h2 className="font-display text-[clamp(2rem,3.5vw,3rem)] font-normal leading-[1.15] mb-2 text-center">
            Join the Embroo Community
          </h2>
          <p className="text-text-secondary text-base max-w-[560px] mx-auto mb-6 text-center">
            Get exclusive designs, early access & 10% off your first order
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-[480px] mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              alert('Subscribed! Welcome to Embroo India.');
            }}
          >
            <input
              type="email"
              placeholder="Enter your email address"
              required
              className="flex-1 py-3.5 px-5 bg-surface border border-[var(--border)] rounded-[8px] text-text-primary font-[var(--font-body)] text-[0.9rem] focus:border-gold focus:shadow-[0_0_0_3px_var(--gold-muted)] outline-none"
            />
            <Button type="submit" variant="primary">Subscribe</Button>
          </form>
        </RevealOnScroll>
      </div>
    </section>
  );
}
