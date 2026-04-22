import { SiteHeader } from '@/components/layout/SiteHeader';
import { Footer } from '@/components/layout/Footer';

export default function OurStoryPage() {
  return (
    <>
      <SiteHeader />
      <main className="pt-[160px] pb-20 min-h-screen">
        <div className="max-w-[760px] mx-auto px-6">
          <div className="mb-12">
            <div className="text-[0.65rem] tracking-[0.5em] uppercase text-gold mb-3">About Us</div>
            <h1 className="font-display text-[clamp(2.2rem,4.5vw,3.5rem)] font-normal leading-tight">
              Every Stitch<br /><em className="text-gold italic">Tells a Story</em>
            </h1>
            <div className="w-12 h-0.5 bg-gradient-to-r from-gold to-transparent mt-6" />
          </div>

          <div className="space-y-8 text-text-secondary text-[1.05rem] leading-[1.85]">
            <p>
              Embroo India was born from a simple frustration: why is it so hard to get quality custom embroidery in India? You either deal with 10 different vendors, wait weeks for a simple proof, or settle for mediocre quality on cheap blanks.
            </p>
            <p>
              We set out to change that. We built India&apos;s first <span className="text-gold font-medium">3D embroidery design studio</span> — a platform where you can design your own embroidered garments, see exactly how they&apos;ll look in interactive 3D, and even try them on using augmented reality. All from your phone or laptop.
            </p>

            <div className="bg-surface border border-[var(--border)] rounded-[16px] p-8 my-10">
              <h3 className="font-display text-xl text-text-primary mb-4">Our Promise</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: '🧵', text: 'Madeira & Isacord certified threads only' },
                  { icon: '👕', text: 'Premium blank garments — no cheap substitutes' },
                  { icon: '🔮', text: 'What you see in 3D is what you get' },
                  { icon: '⚡', text: '7-10 day delivery across India' },
                  { icon: '🛡️', text: 'Free remake if we make an error' },
                  { icon: '🇮🇳', text: '100% made in India' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    <span className="text-sm text-text-primary">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <p>
              We use only <strong className="text-text-primary">Madeira and Isacord certified threads</strong> — the gold standard in the embroidery industry. Our machines run precision patterns that translate your digital design into thousands of perfectly placed stitches.
            </p>
            <p>
              Whether you&apos;re a college student designing your fest hoodie, a startup creating branded merch, or a parent making a birthday gift — Embroo India makes it simple, fast, and beautiful.
            </p>
            <p className="font-display text-xl text-text-primary italic">
              &ldquo;Wear your story, stitched to perfection.&rdquo;
            </p>

            <div className="border-t border-[var(--border)] pt-8 mt-8">
              <h3 className="font-display text-xl text-text-primary mb-4">The Team</h3>
              <p>
                We&apos;re a small, passionate team based in India — engineers, designers, and embroidery craftspeople who believe that custom clothing should be accessible to everyone, not just big brands with big budgets.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
