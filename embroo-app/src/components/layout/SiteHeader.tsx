'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TOP_NAV_LINKS } from '@/lib/constants';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function SiteHeader() {
  const [hidden, setHidden] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const [cartCount] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setHidden(current > lastScroll && current > 200);
      setLastScroll(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastScroll]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[1000] transition-transform duration-400 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      {/* Top Bar */}
      <div className="bg-charcoal-deep border-b border-gold/[0.08] py-1.5 text-[0.75rem] tracking-[0.08em] uppercase">
        <div className="max-w-[1280px] mx-auto px-6 flex justify-end items-center gap-6">
          {TOP_NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-text-secondary hover:text-gold transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-charcoal/[0.92] backdrop-blur-[20px] border-b border-[var(--border)] py-3">
        <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden flex flex-col justify-between w-8 h-6"
              aria-label="Menu"
            >
              <span className="block w-full h-0.5 bg-gold" />
              <span className="block w-full h-0.5 bg-gold" />
              <span className="block w-full h-0.5 bg-gold" />
            </button>
          </div>

          <div className="text-center flex-1">
            <Link href="/" className="inline-block">
              <div className="font-display text-[1.8rem] font-semibold tracking-[0.25em] text-gold leading-none relative">
                EMBROO INDIA
                <span className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-3/5 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
              </div>
              <div className="text-[0.6rem] tracking-[0.35em] uppercase text-text-secondary mt-1.5">
                Wear Your Story, Stitched to Perfection
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-5">
            <ThemeToggle />
            <button className="relative text-text-primary text-xl p-1.5 hover:text-gold transition-colors" aria-label="Cart">
              <span>&#128722;</span>
              <span className="absolute -top-1 -right-2 bg-gold text-charcoal-deep text-[0.65rem] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-charcoal-deep py-2 border-b border-gold/[0.06]">
        <div className="max-w-[600px] mx-auto px-6">
          <div className="relative">
            <input
              type="search"
              placeholder="Search embroidery designs, garments..."
              className="w-full py-2.5 pl-4 pr-11 bg-surface border border-[var(--border)] rounded-full text-text-primary font-[var(--font-body)] text-[0.85rem] transition-all focus:border-gold focus:shadow-[0_0_0_3px_var(--gold-muted)] outline-none placeholder:text-text-muted"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted text-[0.9rem]">
              &#128269;
            </span>
          </div>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="bg-gradient-to-r from-gold-dark via-gold to-gold-dark text-charcoal-deep py-1.5 text-[0.78rem] font-semibold tracking-[0.06em] overflow-hidden whitespace-nowrap">
        <div className="inline-flex animate-marquee">
          <span className="px-8">
            Launch Offer &#9733; Flat 20% Off on All Custom Embroidery
          </span>
          <span className="px-8">|</span>
          <span className="px-8">
            Free Shipping Above ₹2,999
          </span>
          <span className="px-8">|</span>
          <span className="px-8">
            Launch Offer &#9733; Flat 20% Off on All Custom Embroidery
          </span>
          <span className="px-8">|</span>
          <span className="px-8">
            Free Shipping Above ₹2,999
          </span>
        </div>
      </div>
    </header>
  );
}
