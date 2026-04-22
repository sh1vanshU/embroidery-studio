'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  type: 'hoodie' | 'tshirt' | 'polo' | 'cap';
  basePrice: number;
  salePrice?: number;
  sizes: string[];
  description: string;
  active: boolean;
}

const mockProducts: Product[] = [
  { id: 'p1', name: 'Classic Embroidered Hoodie', type: 'hoodie', basePrice: 2499, salePrice: 1999, sizes: ['S', 'M', 'L', 'XL', '2XL'], description: 'Premium cotton blend hoodie with custom embroidery', active: true },
  { id: 'p2', name: 'Essential Embroidered Tee', type: 'tshirt', basePrice: 1499, salePrice: 1249, sizes: ['S', 'M', 'L', 'XL'], description: '100% cotton t-shirt with precision embroidery', active: true },
  { id: 'p3', name: 'Corporate Polo', type: 'polo', basePrice: 1899, sizes: ['S', 'M', 'L', 'XL', '2XL'], description: 'Professional polo with logo embroidery', active: true },
  { id: 'p4', name: 'Varsity Cap', type: 'cap', basePrice: 899, salePrice: 749, sizes: ['One Size'], description: 'Structured cap with front embroidery', active: true },
  { id: 'p5', name: 'Premium Chenille Hoodie', type: 'hoodie', basePrice: 3499, salePrice: 2999, sizes: ['M', 'L', 'XL'], description: 'Chenille lettering on premium heavyweight hoodie', active: false },
];

const typeLabels: Record<string, string> = {
  hoodie: 'Hoodie',
  tshirt: 'T-Shirt',
  polo: 'Polo',
  cap: 'Cap',
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState(mockProducts);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<Product['type']>('hoodie');
  const [formBasePrice, setFormBasePrice] = useState('');
  const [formSalePrice, setFormSalePrice] = useState('');
  const [formSizes, setFormSizes] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formActive, setFormActive] = useState(true);

  function openCreate() {
    setEditingProduct(null);
    setFormName('');
    setFormType('hoodie');
    setFormBasePrice('');
    setFormSalePrice('');
    setFormSizes('S, M, L, XL');
    setFormDesc('');
    setFormActive(true);
    setShowModal(true);
  }

  function openEdit(product: Product) {
    setEditingProduct(product);
    setFormName(product.name);
    setFormType(product.type);
    setFormBasePrice(String(product.basePrice));
    setFormSalePrice(product.salePrice ? String(product.salePrice) : '');
    setFormSizes(product.sizes.join(', '));
    setFormDesc(product.description);
    setFormActive(product.active);
    setShowModal(true);
  }

  function handleSave() {
    const data: Product = {
      id: editingProduct?.id || `p${Date.now()}`,
      name: formName,
      type: formType,
      basePrice: Number(formBasePrice),
      salePrice: formSalePrice ? Number(formSalePrice) : undefined,
      sizes: formSizes.split(',').map((s) => s.trim()).filter(Boolean),
      description: formDesc,
      active: formActive,
    };

    if (editingProduct) {
      setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? data : p)));
    } else {
      setProducts((prev) => [data, ...prev]);
    }
    setShowModal(false);
  }

  function toggleActive(id: string) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
  }

  function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  }

  const inputClass =
    'w-full px-4 py-3 rounded-[var(--radius-sm)] bg-charcoal-light border border-[var(--border)] text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-[var(--font-display)] text-2xl font-semibold text-text-primary">
          Product Management
        </h1>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-sm)] bg-gold text-charcoal-deep font-semibold text-sm hover:bg-gold-light transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-surface rounded-[var(--radius-md)] border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left text-xs text-text-muted font-medium px-5 py-3 uppercase tracking-wider">Product</th>
                <th className="text-left text-xs text-text-muted font-medium px-5 py-3 uppercase tracking-wider hidden sm:table-cell">Type</th>
                <th className="text-left text-xs text-text-muted font-medium px-5 py-3 uppercase tracking-wider hidden md:table-cell">Sizes</th>
                <th className="text-right text-xs text-text-muted font-medium px-5 py-3 uppercase tracking-wider">Price</th>
                <th className="text-center text-xs text-text-muted font-medium px-5 py-3 uppercase tracking-wider">Active</th>
                <th className="text-right text-xs text-text-muted font-medium px-5 py-3 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-surface-hover transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-text-primary">{product.name}</p>
                    <p className="text-xs text-text-muted mt-0.5 hidden sm:block">{product.description}</p>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className="text-xs px-2 py-1 rounded bg-charcoal-light text-text-secondary">
                      {typeLabels[product.type]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-text-secondary hidden md:table-cell">
                    {product.sizes.join(', ')}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {product.salePrice ? (
                      <div>
                        <span className="text-sm font-medium text-text-primary">&#8377;{product.salePrice.toLocaleString('en-IN')}</span>
                        <span className="text-xs text-text-muted line-through ml-1.5">&#8377;{product.basePrice.toLocaleString('en-IN')}</span>
                      </div>
                    ) : (
                      <span className="text-sm font-medium text-text-primary">&#8377;{product.basePrice.toLocaleString('en-IN')}</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => toggleActive(product.id)}
                      className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${product.active ? 'bg-green-500' : 'bg-charcoal-light'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${product.active ? 'left-5.5' : 'left-0.5'}`} />
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(product)}
                        className="text-xs text-gold hover:text-gold-light transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowModal(false)} />
          <div className="relative bg-surface rounded-[var(--radius-md)] border border-[var(--border)] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[var(--shadow-deep)]">
            <div className="p-6 border-b border-[var(--border)]">
              <h2 className="text-lg font-semibold text-text-primary">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Name</label>
                <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} className={inputClass} placeholder="Product name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Type</label>
                  <select value={formType} onChange={(e) => setFormType(e.target.value as Product['type'])} className={`${inputClass} cursor-pointer`}>
                    <option value="hoodie">Hoodie</option>
                    <option value="tshirt">T-Shirt</option>
                    <option value="polo">Polo</option>
                    <option value="cap">Cap</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Sizes</label>
                  <input type="text" value={formSizes} onChange={(e) => setFormSizes(e.target.value)} className={inputClass} placeholder="S, M, L, XL" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Base Price (&#8377;)</label>
                  <input type="number" value={formBasePrice} onChange={(e) => setFormBasePrice(e.target.value)} className={inputClass} placeholder="2499" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Sale Price (&#8377;)</label>
                  <input type="number" value={formSalePrice} onChange={(e) => setFormSalePrice(e.target.value)} className={inputClass} placeholder="Optional" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Description</label>
                <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder="Product description" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formActive} onChange={(e) => setFormActive(e.target.checked)} className="w-4 h-4 rounded accent-gold" />
                <span className="text-sm text-text-secondary">Active (visible in store)</span>
              </label>
            </div>
            <div className="p-6 border-t border-[var(--border)] flex items-center justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-surface border border-[var(--border)] text-text-secondary text-sm font-medium hover:text-text-primary transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formName || !formBasePrice}
                className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-gold text-charcoal-deep font-semibold text-sm hover:bg-gold-light disabled:opacity-50 transition-colors cursor-pointer"
              >
                {editingProduct ? 'Save changes' : 'Create product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
