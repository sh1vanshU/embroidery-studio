import { DISCOUNT_PERCENT, BASE_PRICES, STITCH_PRICES } from './constants';
import type { GarmentType, StitchType, ZoneDesign } from '@/types';

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function calculatePrice(
  garmentType: GarmentType,
  zoneDesigns: Record<string, ZoneDesign>,
  stitchType: StitchType = 'embroidery'
) {
  const base = BASE_PRICES[garmentType];
  const zoneCount = Object.keys(zoneDesigns).length;
  const stitchCost = STITCH_PRICES[stitchType];
  const embTotal = zoneCount * stitchCost;
  const subtotal = base + embTotal;
  const discount = Math.round(subtotal * (DISCOUNT_PERCENT / 100));
  const total = subtotal - discount;

  return { base, embTotal, zoneCount, discount, subtotal, total };
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
