// ═══════════════════════════════════════════
// EMBROO INDIA — TYPE DEFINITIONS
// ═══════════════════════════════════════════

export type GarmentType = 'hoodie' | 'tshirt' | 'polo' | 'cap';

export type GarmentView = 'front' | 'back';

export type HoodieZoneKey =
  | 'rightChest' | 'leftChest'
  | 'rightShoulder' | 'leftShoulder'
  | 'aboveRightElbow' | 'aboveLeftElbow'
  | 'belowRightElbow' | 'belowLeftElbow'
  | 'bottomRightSleeve' | 'bottomLeftSleeve'
  | 'back' | 'front';

export type TshirtZoneKey =
  | 'rightChest' | 'leftChest'
  | 'rightSleeve' | 'leftSleeve'
  | 'back' | 'front'
  | 'backNeck' | 'pocketArea';

export type ZoneKey = HoodieZoneKey | TshirtZoneKey;

export type DesignType =
  | 'myPatches' | 'upload' | 'ai'
  | 'letters' | 'patch' | 'monoText'
  | 'patchText' | 'textPatch' | 'text2Lines';

export type StitchType = 'embroidery' | 'chenille';

export type PatchCategory =
  | 'recommended' | 'shapes' | 'sports' | 'flags'
  | 'music' | 'military' | 'travel' | 'symbols' | 'people';

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  material?: string;
}

export interface PlacementZone {
  key: ZoneKey;
  label: string;
  pos: {
    top: string;
    left: string;
    w: string;
    h: string;
  };
  view: GarmentView;
}

export interface ZoneDesign {
  type: DesignType;
  text?: string;
  twoLineTexts?: [string, string];
  fontId?: string;
  color?: string;
  outline?: string;
  stitchType: StitchType;
  interlocked?: boolean;
  patchId?: string;
  uploadedFileUrl?: string;
  aiPrompt?: string;
  aiResultUrl?: string;
}

export interface GarmentColors {
  body: string;
  hood: string;
  cuffs: string;
}

export interface CartItem {
  id: string;
  garmentType: GarmentType;
  colors: GarmentColors;
  zoneDesigns: Record<string, ZoneDesign>;
  size: string;
  quantity: number;
  unitPrice: number;
}

export interface Product {
  id: string;
  name: string;
  type: GarmentType;
  basePrice: number;
  salePrice?: number;
  description: string;
  sizes: string[];
  images: string[];
}

export interface Patch {
  id: string;
  name: string;
  category: PatchCategory;
  imageUrl: string;
  tags: string[];
  price: number;
}

export interface Font {
  id: string;
  name: string;
  family: string;
  style?: string;
  weight?: number;
}

export interface Testimonial {
  id: string;
  text: string;
  author: string;
  location: string;
  rating: number;
}

export interface BestsellerItem {
  id: string;
  name: string;
  originalPrice: number;
  salePrice: number;
  type: GarmentType;
}
