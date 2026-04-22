import { NextResponse } from 'next/server';

// Static product catalog — move to database in production
const PRODUCTS = [
  {
    id: 'hoodie-classic',
    slug: 'classic-hoodie',
    name: 'Classic Hoodie',
    type: 'hoodie',
    basePrice: 1499,
    salePrice: 1199,
    description: 'Premium heavyweight hoodie with kangaroo pocket. Perfect canvas for custom embroidery.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
    images: [],
    isActive: true,
  },
  {
    id: 'tshirt-classic',
    slug: 'classic-tshirt',
    name: 'Classic T-Shirt',
    type: 'tshirt',
    basePrice: 799,
    salePrice: 639,
    description: '100% cotton crew neck tee. Soft, durable, and ready for your custom design.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    images: [],
    isActive: true,
  },
  {
    id: 'polo-classic',
    slug: 'classic-polo',
    name: 'Classic Polo',
    type: 'polo',
    basePrice: 999,
    salePrice: 799,
    description: 'Piqué cotton polo with collar. Professional look with custom embroidery.',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    images: [],
    isActive: true,
  },
  {
    id: 'cap-classic',
    slug: 'classic-cap',
    name: 'Classic Cap',
    type: 'cap',
    basePrice: 499,
    salePrice: 399,
    description: 'Structured cotton cap with adjustable strap. Custom embroidery on front panel.',
    sizes: ['One Size'],
    images: [],
    isActive: true,
  },
];

// GET /api/products — List all products
export async function GET() {
  // TODO: Fetch from database when connected
  // const products = await prisma.product.findMany({ where: { isActive: true } });

  return NextResponse.json({ products: PRODUCTS });
}
