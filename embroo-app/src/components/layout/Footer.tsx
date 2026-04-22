import Link from 'next/link';
import { FOOTER_LINKS, PAYMENT_METHODS } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="bg-charcoal-deep border-t border-[var(--border)] pt-15 pb-7">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="font-display text-[1.4rem] font-semibold tracking-[0.25em] text-gold leading-none">
              EMBROO INDIA
            </div>
            <p className="text-text-secondary text-[0.85rem] mt-3 leading-relaxed">
              India&apos;s first 3D custom embroidery studio. Premium embroidered hoodies,
              t-shirts and more, designed by you.
            </p>
            <div className="flex gap-3 mt-5">
              {['📷', 'f', '𝕏', '▶', 'P'].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 border border-[var(--border)] rounded-full flex items-center justify-center text-[0.85rem] text-text-secondary transition-all hover:border-gold hover:text-gold hover:bg-[var(--gold-muted)]"
                  aria-label={`Social media link ${i + 1}`}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="font-display text-[1.1rem] mb-4 text-gold">About</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.about.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-text-secondary text-[0.85rem] hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-display text-[1.1rem] mb-4 text-gold">Products</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.products.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-text-secondary text-[0.85rem] hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display text-[1.1rem] mb-4 text-gold">Support</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-text-secondary text-[0.85rem] hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[var(--border)] pt-6 flex flex-col md:flex-row justify-between items-center gap-4 flex-wrap">
          <div className="flex gap-2 items-center flex-wrap">
            {PAYMENT_METHODS.map((method) => (
              <span
                key={method}
                className="px-2.5 py-1 bg-surface border border-[var(--border)] rounded text-[0.7rem] text-text-secondary font-medium"
              >
                {method}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gold text-[0.8rem]">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
            <span className="text-text-secondary text-[0.8rem]">4.9/5 from 250+ reviews</span>
          </div>

          <div className="text-text-muted text-[0.8rem]">
            &copy; 2026 Embroo India. Made with &#10084; in India.
          </div>
        </div>
      </div>
    </footer>
  );
}
