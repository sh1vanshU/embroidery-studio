import type {
  ColorOption,
  PlacementZone,
  Font,
  BestsellerItem,
  Testimonial,
  GarmentType,
} from '@/types';

// ═══════════════════════════════════════════
// PRICING
// ═══════════════════════════════════════════

export const BASE_PRICES: Record<GarmentType, number> = {
  hoodie: 1499,
  tshirt: 799,
  polo: 999,
  cap: 499,
};

export const STITCH_PRICES = {
  embroidery: 199,
  chenille: 349,
} as const;

export const DISCOUNT_PERCENT = 20;

// ═══════════════════════════════════════════
// GARMENT COLORS (12 options)
// ═══════════════════════════════════════════

export const GARMENT_COLORS: ColorOption[] = [
  { id: 'black', name: 'Black', hex: '#0A0A0A' },
  { id: 'dark-navy', name: 'Dark Navy', hex: '#1A1A2E' },
  { id: 'scarlet-red', name: 'Scarlet Red', hex: '#8B2635' },
  { id: 'forest-green', name: 'Forest Green', hex: '#2D5016' },
  { id: 'royal-blue', name: 'Royal Blue', hex: '#1A3C6D' },
  { id: 'burgundy', name: 'Burgundy', hex: '#6B2D5B' },
  { id: 'sand', name: 'Sand', hex: '#C2956B' },
  { id: 'charcoal', name: 'Charcoal', hex: '#4A4A4A' },
  { id: 'cream', name: 'Cream', hex: '#F5F3EE' },
  { id: 'gold', name: 'Gold', hex: '#D4A853' },
  { id: 'olive', name: 'Olive', hex: '#5B7553' },
  { id: 'blush', name: 'Blush', hex: '#D4A5A5' },
];

// ═══════════════════════════════════════════
// THREAD COLORS (12 options)
// ═══════════════════════════════════════════

export const THREAD_COLORS: ColorOption[] = [
  { id: 'black', name: 'Black', hex: '#000000' },
  { id: 'navy', name: 'Navy', hex: '#1B3A4B' },
  { id: 'red', name: 'Red', hex: '#C0392B' },
  { id: 'forest', name: 'Forest Green', hex: '#2D5016' },
  { id: 'royal', name: 'Royal Blue', hex: '#1A3C6D' },
  { id: 'purple', name: 'Purple', hex: '#6B2D5B' },
  { id: 'tan', name: 'Tan', hex: '#C2956B' },
  { id: 'grey', name: 'Grey', hex: '#4A4A4A' },
  { id: 'white', name: 'White', hex: '#F5F3EE' },
  { id: 'gold', name: 'Gold', hex: '#D4A853' },
  { id: 'sage', name: 'Sage', hex: '#5B7553' },
  { id: 'brown', name: 'Brown', hex: '#8B4513' },
];

// ═══════════════════════════════════════════
// DIY COLOR SWATCHES (landing page)
// ═══════════════════════════════════════════

export const DIY_BODY_COLORS = [
  '#1A1A2E', '#1B3A4B', '#8B2635', '#2D5016',
  '#F5F3EE', '#D4A853', '#4A4A4A', '#C2956B',
];

export const DIY_HOOD_COLORS = [
  '#252542', '#1B3A4B', '#8B2635', '#2D5016',
  '#F5F3EE', '#D4A853', '#4A4A4A', '#C2956B',
];

export const DIY_ACCENT_COLORS = [
  '#252542', '#D4A853', '#F5F3EE', '#1A1A2E',
  '#8B2635', '#C2956B',
];

export const COLOR_PRESETS = [
  { body: '#1A1A2E', hood: '#D4A853', accent: '#D4A853' },
  { body: '#8B2635', hood: '#1A1A2E', accent: '#D4A853' },
  { body: '#F5F3EE', hood: '#1A1A2E', accent: '#4A4A4A' },
  { body: '#2D5016', hood: '#1A1A2E', accent: '#D4A853' },
  { body: '#1B3A4B', hood: '#F5F3EE', accent: '#D4A853' },
  { body: '#C2956B', hood: '#1A1A2E', accent: '#252542' },
];

// ═══════════════════════════════════════════
// HOODIE ZONES (12)
// ═══════════════════════════════════════════

export const HOODIE_ZONES: PlacementZone[] = [
  { key: 'rightChest', label: 'Right Chest', view: 'front', pos: { top: '32%', left: '30%', w: '16%', h: '10%' } },
  { key: 'leftChest', label: 'Left Chest', view: 'front', pos: { top: '32%', left: '54%', w: '16%', h: '10%' } },
  { key: 'rightShoulder', label: 'Right Shoulder', view: 'front', pos: { top: '22%', left: '22%', w: '14%', h: '8%' } },
  { key: 'leftShoulder', label: 'Left Shoulder', view: 'front', pos: { top: '22%', left: '64%', w: '14%', h: '8%' } },
  { key: 'aboveRightElbow', label: 'Above Right Elbow', view: 'front', pos: { top: '34%', left: '14%', w: '10%', h: '10%' } },
  { key: 'aboveLeftElbow', label: 'Above Left Elbow', view: 'front', pos: { top: '34%', left: '76%', w: '10%', h: '10%' } },
  { key: 'belowRightElbow', label: 'Below Right Elbow', view: 'front', pos: { top: '46%', left: '14%', w: '10%', h: '10%' } },
  { key: 'belowLeftElbow', label: 'Below Left Elbow', view: 'front', pos: { top: '46%', left: '76%', w: '10%', h: '10%' } },
  { key: 'bottomRightSleeve', label: 'Bottom Right Sleeve', view: 'front', pos: { top: '42%', left: '12%', w: '8%', h: '8%' } },
  { key: 'bottomLeftSleeve', label: 'Bottom Left Sleeve', view: 'front', pos: { top: '42%', left: '80%', w: '8%', h: '8%' } },
  { key: 'back', label: 'Back', view: 'back', pos: { top: '35%', left: '30%', w: '40%', h: '25%' } },
  { key: 'front', label: 'Front', view: 'front', pos: { top: '45%', left: '30%', w: '40%', h: '20%' } },
];

// ═══════════════════════════════════════════
// T-SHIRT ZONES (8)
// ═══════════════════════════════════════════

export const TSHIRT_ZONES: PlacementZone[] = [
  { key: 'rightChest', label: 'Right Chest', view: 'front', pos: { top: '28%', left: '28%', w: '18%', h: '12%' } },
  { key: 'leftChest', label: 'Left Chest', view: 'front', pos: { top: '28%', left: '54%', w: '18%', h: '12%' } },
  { key: 'rightSleeve' as 'rightShoulder', label: 'Right Sleeve', view: 'front', pos: { top: '22%', left: '16%', w: '12%', h: '12%' } },
  { key: 'leftSleeve' as 'leftShoulder', label: 'Left Sleeve', view: 'front', pos: { top: '22%', left: '72%', w: '12%', h: '12%' } },
  { key: 'back', label: 'Back', view: 'back', pos: { top: '30%', left: '28%', w: '44%', h: '30%' } },
  { key: 'front', label: 'Front', view: 'front', pos: { top: '42%', left: '28%', w: '44%', h: '25%' } },
  { key: 'backNeck' as 'back', label: 'Back Neck', view: 'back', pos: { top: '18%', left: '38%', w: '24%', h: '8%' } },
  { key: 'pocketArea' as 'front', label: 'Pocket Area', view: 'front', pos: { top: '35%', left: '34%', w: '14%', h: '10%' } },
];

// ═══════════════════════════════════════════
// FONTS
// ═══════════════════════════════════════════

export const EMBROIDERY_FONTS: Font[] = [
  { id: 'classic', name: 'Classic', family: 'Georgia, serif', weight: 700 },
  { id: 'script', name: 'Script', family: "'Cormorant Garamond', serif", style: 'italic' },
  { id: 'modern', name: 'Modern', family: "'Outfit', sans-serif", weight: 700 },
  { id: 'block', name: 'Block', family: 'Impact, sans-serif' },
  { id: 'stencil', name: 'Stencil', family: "'Courier New', monospace", weight: 700 },
];

// ═══════════════════════════════════════════
// OUTLINE OPTIONS
// ═══════════════════════════════════════════

export const OUTLINE_OPTIONS = [
  { id: 'none', name: 'None', color: null },
  { id: 'gold', name: 'Gold', color: '#D4A853' },
  { id: 'white', name: 'White', color: '#FFFFFF' },
  { id: 'black', name: 'Black', color: '#000000' },
];

// ═══════════════════════════════════════════
// DESIGN TYPES
// ═══════════════════════════════════════════

export const DESIGN_TYPES = [
  { key: 'myPatches', name: 'My Designs', desc: 'Your saved designs', icon: '💾' },
  { key: 'upload', name: 'Upload', desc: 'Upload custom artwork', icon: '📤' },
  { key: 'ai', name: 'AI Assisted', desc: 'Generate with AI', icon: '🤖' },
  { key: 'letters', name: 'Letters', desc: '1-3 letter monogram', icon: 'A' },
  { key: 'patch', name: 'Patch', desc: 'Browse patch library', icon: '🏅' },
  { key: 'monoText', name: 'Text', desc: 'Multiline text design', icon: 'T' },
  { key: 'patchText', name: 'Patch + Text', desc: 'Combined design', icon: '🎨' },
  { key: 'textPatch', name: 'Text + Patch', desc: 'Text above patch', icon: '📄' },
  { key: 'text2Lines', name: '2-Line Text', desc: 'Two text lines', icon: '≡' },
] as const;

// ═══════════════════════════════════════════
// PATCH CATEGORIES
// ═══════════════════════════════════════════

export const PATCH_CATEGORIES = [
  'Recommended', 'Sports', 'Flags', 'Music',
  'Military', 'Travel', 'Symbols', 'People',
] as const;

// ═══════════════════════════════════════════
// BESTSELLER DATA
// ═══════════════════════════════════════════

export const BESTSELLERS: BestsellerItem[] = [
  { id: '1', name: 'Classic Black Hoodie', originalPrice: 1499, salePrice: 1199, type: 'hoodie' },
  { id: '2', name: 'Navy Embroidered Tee', originalPrice: 799, salePrice: 639, type: 'tshirt' },
  { id: '3', name: 'Gold Accent Hoodie', originalPrice: 1699, salePrice: 1359, type: 'hoodie' },
  { id: '4', name: 'Team Polo Custom', originalPrice: 999, salePrice: 799, type: 'polo' },
  { id: '5', name: 'Charcoal Script Hoodie', originalPrice: 1499, salePrice: 1199, type: 'hoodie' },
  { id: '6', name: 'Burgundy Crest Tee', originalPrice: 899, salePrice: 719, type: 'tshirt' },
  { id: '7', name: 'Olive Patch Hoodie', originalPrice: 1599, salePrice: 1279, type: 'hoodie' },
  { id: '8', name: 'Cream Monogram Tee', originalPrice: 799, salePrice: 639, type: 'tshirt' },
];

// ═══════════════════════════════════════════
// TESTIMONIALS
// ═══════════════════════════════════════════

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    text: 'The 3D preview blew my mind. I could see exactly how my hoodie would look before ordering. The embroidery quality is absolutely premium.',
    author: 'Priya Sharma',
    location: 'Mumbai, Maharashtra',
    rating: 5,
  },
  {
    id: '2',
    text: 'Ordered 50 custom hoodies for our college fest. The bulk pricing was great and delivery was right on time. Everyone loved the quality!',
    author: 'Arjun Mehta',
    location: 'Delhi NCR',
    rating: 5,
  },
  {
    id: '3',
    text: "Finally a platform where I can actually design my own embroidered t-shirts without talking to 10 vendors. The AR try-on is next level!",
    author: 'Sneha Reddy',
    location: 'Hyderabad, Telangana',
    rating: 5,
  },
];

// ═══════════════════════════════════════════
// SIZE GUIDE
// ═══════════════════════════════════════════

export const SIZE_DATA = [
  { size: 'XS', chest: 34, length: 26, sleeve: 32 },
  { size: 'S', chest: 36, length: 27, sleeve: 33 },
  { size: 'M', chest: 40, length: 28, sleeve: 34 },
  { size: 'L', chest: 44, length: 29, sleeve: 35 },
  { size: 'XL', chest: 48, length: 30, sleeve: 36 },
  { size: '2XL', chest: 52, length: 31, sleeve: 37 },
  { size: '3XL', chest: 56, length: 32, sleeve: 38 },
  { size: '4XL', chest: 60, length: 33, sleeve: 39 },
  { size: '5XL', chest: 64, length: 34, sleeve: 40 },
];

// ═══════════════════════════════════════════
// GALLERY ITEMS
// ═══════════════════════════════════════════

export const GALLERY_ITEMS = [
  { label: 'Custom Hoodie', tag: '#EmbrooIndia', gradient: 'from-[#2D5016] to-[#1A1A2E]' },
  { label: 'Team Order', tag: '#EmbrooIndia', gradient: 'from-[#8B2635] to-[#1A1A2E]' },
  { label: 'College Fest', tag: '#EmbrooIndia', gradient: 'from-[#1B3A4B] to-[#1A1A2E]' },
  { label: 'Corporate Event', tag: '#EmbrooIndia', gradient: 'from-[#C2956B] to-[#1A1A2E]' },
  { label: 'Wedding Gift', tag: '#EmbrooIndia', gradient: 'from-[#D4A853] to-[#1A1A2E]' },
  { label: 'Birthday Special', tag: '#EmbrooIndia', gradient: 'from-[#4A4A4A] to-[#1A1A2E]' },
];

// ═══════════════════════════════════════════
// PAYMENT METHODS
// ═══════════════════════════════════════════

export const PAYMENT_METHODS = [
  'VISA', 'MC', 'UPI', 'Paytm', 'PhonePe', 'GPay', 'RuPay',
];

// ═══════════════════════════════════════════
// NAV LINKS
// ═══════════════════════════════════════════

export const TOP_NAV_LINKS = [
  { label: 'Our Story', href: '#story' },
  { label: 'Products', href: '#products' },
  { label: 'Bulk Orders', href: '#bulk' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Log In', href: '/auth/login' },
];

export const FOOTER_LINKS = {
  about: [
    { label: 'Our Story', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Materials & Quality', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
  ],
  products: [
    { label: 'Hoodies', href: '#' },
    { label: 'T-Shirts', href: '#' },
    { label: 'Polos', href: '#' },
    { label: 'Caps', href: '#' },
    { label: 'Online Builder', href: '/builder' },
  ],
  support: [
    { label: 'FAQ', href: '#' },
    { label: 'Shipping & Returns', href: '#' },
    { label: 'Size Guide', href: '#' },
    { label: 'Bulk Orders', href: '#' },
    { label: 'Contact Us', href: '#' },
  ],
};
