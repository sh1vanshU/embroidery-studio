'use client';

import { SiteHeader } from '@/components/layout/SiteHeader';
import { Footer } from '@/components/layout/Footer';

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana',
  'Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur',
  'Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Andaman & Nicobar','Chandigarh',
  'Dadra & Nagar Haveli and Daman & Diu','Delhi','Jammu & Kashmir','Ladakh','Lakshadweep','Puducherry',
];

export default function BulkOrdersPage() {
  return (
    <>
      <SiteHeader />
      <main className="pt-[160px] pb-20 min-h-screen">
        <div className="max-w-[720px] mx-auto px-6">
          <div className="mb-10">
            <div className="text-[0.65rem] tracking-[0.5em] uppercase text-gold mb-3">Volume Orders</div>
            <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-normal">Bulk Orders</h1>
            <div className="w-12 h-0.5 bg-gradient-to-r from-gold to-transparent mt-4 mb-3" />
            <p className="text-text-secondary">Special pricing for teams, schools, colleges, and corporates. Minimum 10 pieces per order.</p>
          </div>

          {/* Pricing Tiers */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { qty: '10-24', discount: '15%' },
              { qty: '25-99', discount: '25%' },
              { qty: '100+', discount: '35%' },
            ].map((tier) => (
              <div key={tier.qty} className="bg-surface border border-[var(--border)] rounded-[12px] p-5 text-center">
                <div className="text-gold font-bold text-xl mb-1">{tier.discount}</div>
                <div className="text-text-secondary text-sm">off for {tier.qty} pieces</div>
              </div>
            ))}
          </div>

          {/* Quote Request Form */}
          <form
            className="space-y-5 bg-surface border border-[var(--border)] rounded-[16px] p-8"
            onSubmit={(e) => {
              e.preventDefault();
              alert('Quote request submitted! We\'ll contact you within 24 hours.');
            }}
          >
            <h2 className="font-display text-xl text-gold mb-4">Request a Quote</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-text-secondary mb-1.5 font-medium uppercase tracking-wider">Organisation Name *</label>
                <input required className="w-full py-3 px-4 bg-charcoal-deep border border-[var(--border)] rounded-[8px] text-text-primary text-sm focus:border-gold outline-none" placeholder="Your company or team" />
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-1.5 font-medium uppercase tracking-wider">Contact Person *</label>
                <input required className="w-full py-3 px-4 bg-charcoal-deep border border-[var(--border)] rounded-[8px] text-text-primary text-sm focus:border-gold outline-none" placeholder="Full name" />
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-1.5 font-medium uppercase tracking-wider">Email *</label>
                <input required type="email" className="w-full py-3 px-4 bg-charcoal-deep border border-[var(--border)] rounded-[8px] text-text-primary text-sm focus:border-gold outline-none" placeholder="email@company.com" />
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-1.5 font-medium uppercase tracking-wider">Phone *</label>
                <input required type="tel" className="w-full py-3 px-4 bg-charcoal-deep border border-[var(--border)] rounded-[8px] text-text-primary text-sm focus:border-gold outline-none" placeholder="+91 XXXXX XXXXX" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-text-secondary mb-1.5 font-medium uppercase tracking-wider">Garment Type *</label>
                <select required className="w-full py-3 px-4 bg-charcoal-deep border border-[var(--border)] rounded-[8px] text-text-primary text-sm focus:border-gold outline-none">
                  <option value="">Select garment</option>
                  <option value="hoodie">Hoodies</option>
                  <option value="tshirt">T-Shirts</option>
                  <option value="polo">Polos</option>
                  <option value="cap">Caps</option>
                  <option value="mixed">Mixed (multiple types)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-1.5 font-medium uppercase tracking-wider">Total Quantity *</label>
                <input required type="number" min="10" className="w-full py-3 px-4 bg-charcoal-deep border border-[var(--border)] rounded-[8px] text-text-primary text-sm focus:border-gold outline-none" placeholder="Minimum 10" />
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-1.5 font-medium uppercase tracking-wider">State *</label>
                <select required className="w-full py-3 px-4 bg-charcoal-deep border border-[var(--border)] rounded-[8px] text-text-primary text-sm focus:border-gold outline-none">
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-1.5 font-medium uppercase tracking-wider">Deadline</label>
                <input type="date" className="w-full py-3 px-4 bg-charcoal-deep border border-[var(--border)] rounded-[8px] text-text-primary text-sm focus:border-gold outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs text-text-secondary mb-1.5 font-medium uppercase tracking-wider">Design Description</label>
              <textarea rows={4} className="w-full py-3 px-4 bg-charcoal-deep border border-[var(--border)] rounded-[8px] text-text-primary text-sm focus:border-gold outline-none resize-y" placeholder="Describe your design needs: logo placement, text, colors, etc." />
            </div>

            <div>
              <label className="block text-xs text-text-secondary mb-1.5 font-medium uppercase tracking-wider">Upload Reference (optional)</label>
              <div className="border-2 border-dashed border-[var(--border)] rounded-[12px] p-6 text-center cursor-pointer hover:border-gold transition-colors">
                <span className="text-2xl block mb-2">📎</span>
                <span className="text-text-secondary text-sm">Click to upload logo or design reference</span>
                <input type="file" className="hidden" accept="image/*,.pdf,.ai,.eps" />
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" required id="terms" className="mt-1" />
              <label htmlFor="terms" className="text-text-secondary text-xs">
                I agree to the <a href="#" className="text-gold hover:underline">Terms of Service</a> and <a href="#" className="text-gold hover:underline">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" className="w-full py-4 bg-gold text-charcoal-deep font-bold text-sm rounded-[8px] transition-all hover:bg-gold-light hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(212,168,83,0.3)]">
              Submit Quote Request
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
