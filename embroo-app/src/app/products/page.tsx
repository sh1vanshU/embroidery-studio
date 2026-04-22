import Link from 'next/link';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { Footer } from '@/components/layout/Footer';

const PRODUCTS = [
  { slug: 'classic-hoodie', name: 'Classic Hoodie', type: 'hoodie', price: 1499, sale: 1199, desc: 'Premium heavyweight hoodie with kangaroo pocket. Perfect for custom embroidery.', sizes: 'XS - 5XL' },
  { slug: 'classic-tshirt', name: 'Classic T-Shirt', type: 'tshirt', price: 799, sale: 639, desc: '100% cotton crew neck tee. Soft, durable, ready for your design.', sizes: 'XS - 3XL' },
  { slug: 'classic-polo', name: 'Classic Polo', type: 'polo', price: 999, sale: 799, desc: 'Piqué cotton polo with collar. Professional look with embroidery.', sizes: 'S - 2XL' },
  { slug: 'classic-cap', name: 'Classic Cap', type: 'cap', price: 499, sale: 399, desc: 'Structured cotton cap. Custom embroidery on front panel.', sizes: 'One Size' },
];

export default function ProductsPage() {
  return (
    <>
      <SiteHeader />
      <main className="pt-[160px] pb-20 min-h-screen">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="mb-12">
            <div className="text-[0.65rem] tracking-[0.5em] uppercase text-gold mb-3">Collection</div>
            <h1 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-normal">Our Products</h1>
            <div className="w-12 h-0.5 bg-gradient-to-r from-gold to-transparent mt-4 mb-3" />
            <p className="text-text-secondary max-w-lg">Premium garments ready for your custom embroidery. Choose your canvas and start designing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PRODUCTS.map((p) => (
              <div key={p.slug} className="bg-surface border border-[var(--border)] rounded-[16px] overflow-hidden transition-all duration-500 hover:border-gold hover:-translate-y-1 hover:shadow-[var(--shadow-gold)] group">
                <div className="h-[240px] bg-gradient-to-br from-charcoal-light to-charcoal-mid flex items-center justify-center">
                  <span className="text-[4rem] opacity-30 group-hover:opacity-50 transition-opacity">👕</span>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="font-display text-xl">{p.name}</h2>
                    <div className="text-right">
                      <span className="text-text-muted line-through text-sm">₹{p.price.toLocaleString('en-IN')}</span>
                      <span className="text-gold font-bold text-lg ml-2">₹{p.sale.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <p className="text-text-secondary text-sm mb-1">{p.desc}</p>
                  <p className="text-text-muted text-xs mb-5">Sizes: {p.sizes}</p>
                  <div className="flex gap-3">
                    <Link href={`/builder?garment=${p.type}`} className="flex-1 py-3 bg-gold text-charcoal-deep text-center font-semibold text-sm rounded-[8px] transition-all hover:bg-gold-light">
                      Customize Now
                    </Link>
                    <Link href={`/products/${p.slug}`} className="py-3 px-5 border border-[var(--border)] text-gold text-sm font-medium rounded-[8px] transition-all hover:bg-surface-hover">
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
