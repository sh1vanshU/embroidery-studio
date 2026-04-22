'use client';

import { useState } from 'react';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { Footer } from '@/components/layout/Footer';

const FAQS = [
  { q: 'What is embroidery and how is it different from printing?', a: 'Embroidery uses actual thread stitched into the fabric, creating a raised, textured design that\'s extremely durable. Unlike screen printing or DTG, embroidery won\'t crack, fade, or peel — it lasts as long as the garment itself.' },
  { q: 'What garments can I customize?', a: 'We currently offer hoodies, t-shirts, polos, and caps. Each garment has multiple placement zones where you can add embroidery — up to 12 zones on hoodies and 8 on t-shirts.' },
  { q: 'How does the 3D preview work?', a: 'Our interactive 3D builder lets you see your design from every angle before ordering. You can rotate the garment, zoom in on details, and even try it on using your webcam with our AR feature.' },
  { q: 'What file formats do you accept for custom designs?', a: 'We accept JPG, JPEG, and PNG files up to 5MB. Our digitizing team will convert your design into embroidery-ready format. For best results, upload high-resolution images with clear details.' },
  { q: 'What thread brands do you use?', a: 'We exclusively use Madeira and Isacord certified threads — the gold standard in the embroidery industry. These threads are colorfast, durable, and available in over 400 colors.' },
  { q: 'How long does delivery take?', a: 'Standard delivery is 7-10 business days across India. Rush orders (3-5 days) are available at an additional charge. We ship via BlueDart and Delhivery with full tracking.' },
  { q: 'Do you offer bulk/team orders?', a: 'Yes! We offer special pricing for orders of 10+ pieces. Visit our Bulk Orders page to request a custom quote. Discounts range from 15% (10-24 pcs) to 35% (100+ pcs).' },
  { q: 'What is the difference between Embroidery and Chenille?', a: 'Standard embroidery creates a flat, detailed design using thin thread. Chenille uses thicker, fuzzy yarn that creates a raised, textured look — similar to varsity letter patches. Chenille costs more (₹349/zone vs ₹199/zone) but creates a premium tactile effect.' },
  { q: 'Can I cancel or modify my order?', a: 'Orders can be modified or cancelled within 2 hours of placement. After that, production begins and we cannot make changes. Contact us immediately at support@embroo.in if you need to modify.' },
  { q: 'What is your return policy?', a: 'Since every item is custom-made, we don\'t accept returns for design preferences. However, if there\'s a manufacturing defect or the design doesn\'t match your approved proof, we\'ll remake it free of charge.' },
  { q: 'Do you ship internationally?', a: 'Currently we only ship within India. International shipping is coming soon — join our newsletter to be notified.' },
  { q: 'What payment methods do you accept?', a: 'We accept UPI (GPay, PhonePe, Paytm), credit/debit cards (Visa, Mastercard, RuPay), net banking, and wallets. All payments are processed securely via Razorpay.' },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <SiteHeader />
      <main className="pt-[160px] pb-20 min-h-screen">
        <div className="max-w-[760px] mx-auto px-6">
          <div className="mb-12">
            <div className="text-[0.65rem] tracking-[0.5em] uppercase text-gold mb-3">Support</div>
            <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-normal">Frequently Asked Questions</h1>
            <div className="w-12 h-0.5 bg-gradient-to-r from-gold to-transparent mt-4" />
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="bg-surface border border-[var(--border)] rounded-[12px] overflow-hidden transition-all duration-300 hover:border-gold/30"
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full text-left px-6 py-5 flex justify-between items-center gap-4"
                >
                  <span className="font-medium text-[0.95rem]">{faq.q}</span>
                  <span className={`text-gold text-xl transition-transform duration-300 flex-shrink-0 ${open === i ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-400 ${open === i ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-6 pb-5 text-text-secondary text-[0.88rem] leading-relaxed border-t border-[var(--border)] pt-4">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center bg-surface border border-[var(--border)] rounded-[16px] p-8">
            <h3 className="font-display text-xl mb-2">Still have questions?</h3>
            <p className="text-text-secondary text-sm mb-5">Our team is here to help</p>
            <a href="mailto:support@embroo.in" className="inline-block bg-gold text-charcoal-deep px-8 py-3 rounded-[8px] font-semibold text-sm transition-all hover:bg-gold-light">
              Contact Support
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
