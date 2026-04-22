'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '@/stores/cartStore';
import { formatINR, cn } from '@/lib/utils';
import { SIZE_DATA } from '@/lib/constants';
import type { CartItem } from '@/types';

// ---------------------------------------------------------------------------
// Indian States & UTs
// ---------------------------------------------------------------------------

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman & Nicobar', 'Chandigarh', 'Dadra & Nagar Haveli and Daman & Diu',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

// ---------------------------------------------------------------------------
// Shipping Address Schema
// ---------------------------------------------------------------------------

const shippingSchema = z.object({
  fullName: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().trim().regex(/^(\+91[\s-]?)?[6-9]\d{9}$/, 'Enter a valid Indian phone number'),
  addressLine1: z.string().trim().min(5, 'Address is too short').max(200),
  addressLine2: z.string().trim().max(200).optional(),
  city: z.string().trim().min(2, 'City is required').max(100),
  state: z.string().trim().min(2, 'State is required'),
  pinCode: z.string().trim().regex(/^[1-9][0-9]{5}$/, 'Enter a valid 6-digit PIN code'),
  saveForNext: z.boolean().optional(),
});

type ShippingInput = z.infer<typeof shippingSchema>;

// ---------------------------------------------------------------------------
// Payment methods
// ---------------------------------------------------------------------------

const PAYMENT_OPTIONS = [
  { id: 'upi', label: 'UPI', desc: 'Google Pay, PhonePe, Paytm', icon: 'U' },
  { id: 'card', label: 'Card', desc: 'Credit / Debit Card', icon: 'C' },
  { id: 'netbanking', label: 'Net Banking', desc: 'All major banks', icon: 'N' },
  { id: 'wallet', label: 'Wallet', desc: 'Paytm, Amazon Pay, etc.', icon: 'W' },
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive', icon: '$' },
] as const;

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------

const STEPS = ['Review Cart', 'Shipping', 'Payment', 'Confirmation'] as const;

// ---------------------------------------------------------------------------
// Garment thumbnail
// ---------------------------------------------------------------------------

function MiniThumb({ item }: { item: CartItem }) {
  const c = item.colors.body || '#1A1A2E';
  return (
    <svg viewBox="0 0 48 48" className="w-10 h-10 flex-shrink-0">
      <path
        d="M12 13 L17 9 L21 11 L21 7 Q24 4 27 7 L27 11 L31 9 L36 13 L39 23 L33 23 L33 41 L15 41 L15 23 L9 23 Z"
        fill={c}
        stroke="rgba(212,168,83,0.3)"
        strokeWidth="0.8"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Progress Bar
// ---------------------------------------------------------------------------

function ProgressBar({ current }: { current: number }) {
  return (
    <div className="w-full max-w-xl mx-auto mb-8">
      <div className="flex items-center justify-between mb-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-col items-center flex-1">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-[0.72rem] font-semibold border-2 transition-all duration-300',
                i < current
                  ? 'bg-gold border-gold text-charcoal-deep'
                  : i === current
                    ? 'bg-transparent border-gold text-gold'
                    : 'bg-transparent border-[var(--border)] text-text-muted'
              )}
            >
              {i < current ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span
              className={cn(
                'text-[0.62rem] mt-1 tracking-wider uppercase hidden sm:block',
                i <= current ? 'text-gold' : 'text-text-muted'
              )}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
      <div className="h-0.5 bg-charcoal-light rounded-full overflow-hidden">
        <div
          className="h-full bg-gold transition-all duration-500 ease-[var(--ease-out)]"
          style={{ width: `${(current / (STEPS.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 1: Review Cart
// ---------------------------------------------------------------------------

function StepReviewCart({
  items,
  total,
  onNext,
}: {
  items: CartItem[];
  total: number;
  onNext: () => void;
}) {
  const { updateQuantity, updateSize, removeItem } = useCartStore();
  const sizes = SIZE_DATA.map((s) => s.size);

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-text-secondary text-[0.95rem] mb-4">Your cart is empty</p>
        <Link
          href="/builder"
          className="text-gold text-[0.85rem] font-medium hover:text-gold-light transition-colors"
        >
          Continue Shopping &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-[var(--font-display)] text-[1.5rem] text-text-primary mb-4">Review Your Cart</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-4 rounded-[8px] bg-surface border border-[var(--border)]"
          >
            <MiniThumb item={item} />
            <div className="flex-1 min-w-0">
              <p className="text-text-primary text-[0.85rem] font-semibold capitalize truncate">
                Custom {item.garmentType}
              </p>
              <p className="text-text-muted text-[0.72rem]">
                {Object.keys(item.zoneDesigns).length} design(s) &middot; {formatINR(item.unitPrice)} each
              </p>
            </div>
            <select
              value={item.size}
              onChange={(e) => updateSize(item.id, e.target.value)}
              className="bg-charcoal-deep border border-[var(--border)] text-text-primary text-[0.75rem] rounded-[6px] px-2 py-1 outline-none focus:border-gold cursor-pointer"
            >
              {sizes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <div className="flex items-center border border-[var(--border)] rounded-[6px] overflow-hidden">
              <button
                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                className="w-7 h-7 flex items-center justify-center text-text-secondary hover:text-gold hover:bg-charcoal-deep transition-colors cursor-pointer"
              >
                -
              </button>
              <span className="w-8 h-7 flex items-center justify-center text-text-primary text-[0.75rem] bg-charcoal-deep/40">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, Math.min(100, item.quantity + 1))}
                className="w-7 h-7 flex items-center justify-center text-text-secondary hover:text-gold hover:bg-charcoal-deep transition-colors cursor-pointer"
              >
                +
              </button>
            </div>
            <span className="text-gold font-semibold text-[0.85rem] w-20 text-right">
              {formatINR(item.unitPrice * item.quantity)}
            </span>
            <button
              onClick={() => removeItem(item.id)}
              className="text-text-muted hover:text-red-400 transition-colors cursor-pointer"
              aria-label="Remove item"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="4" y1="4" x2="12" y2="12" />
                <line x1="12" y1="4" x2="4" y2="12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 rounded-[8px] bg-charcoal-light/30 border border-[var(--border)]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-text-secondary text-[0.85rem]">Subtotal</span>
          <span className="text-text-primary text-[1rem] font-semibold">{formatINR(total)}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-text-secondary text-[0.85rem]">Shipping</span>
          <span className="text-text-muted text-[0.85rem]">Calculated next</span>
        </div>
        <div className="border-t border-[var(--border)] mt-3 pt-3 flex justify-between items-center">
          <span className="text-text-primary text-[0.95rem] font-semibold">Estimated Total</span>
          <span className="text-gold text-[1.15rem] font-bold">{formatINR(total)}</span>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full mt-4 py-3 bg-gold text-charcoal-deep font-semibold text-[0.9rem] tracking-[0.06em] rounded-[8px] hover:bg-gold-light hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(212,168,83,0.3)] transition-all cursor-pointer"
      >
        Continue to Shipping
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 2: Shipping Address
// ---------------------------------------------------------------------------

function StepShipping({
  onNext,
  onBack,
  onSaveAddress,
}: {
  onNext: () => void;
  onBack: () => void;
  onSaveAddress: (data: ShippingInput) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingInput>({
    resolver: zodResolver(shippingSchema),
    defaultValues: { saveForNext: false },
  });

  const onSubmit = (data: ShippingInput) => {
    onSaveAddress(data);
    onNext();
  };

  const inputBase =
    'w-full bg-charcoal-deep border border-[var(--border)] text-text-primary text-[0.85rem] rounded-[8px] px-3 py-2.5 outline-none focus:border-gold placeholder:text-text-muted/50 transition-colors';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <h2 className="font-[var(--font-display)] text-[1.5rem] text-text-primary mb-4">
        Shipping Address
      </h2>

      {/* Full Name */}
      <div>
        <label className="block text-text-secondary text-[0.75rem] tracking-wider uppercase mb-1.5">
          Full Name *
        </label>
        <input {...register('fullName')} className={inputBase} placeholder="Priya Sharma" />
        {errors.fullName && (
          <p className="text-red-400 text-[0.72rem] mt-1">{errors.fullName.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-text-secondary text-[0.75rem] tracking-wider uppercase mb-1.5">
          Phone Number *
        </label>
        <input {...register('phone')} className={inputBase} placeholder="+91 9876543210" />
        {errors.phone && (
          <p className="text-red-400 text-[0.72rem] mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* Address Line 1 */}
      <div>
        <label className="block text-text-secondary text-[0.75rem] tracking-wider uppercase mb-1.5">
          Address Line 1 *
        </label>
        <input
          {...register('addressLine1')}
          className={inputBase}
          placeholder="House / Flat No., Building, Street"
        />
        {errors.addressLine1 && (
          <p className="text-red-400 text-[0.72rem] mt-1">{errors.addressLine1.message}</p>
        )}
      </div>

      {/* Address Line 2 */}
      <div>
        <label className="block text-text-secondary text-[0.75rem] tracking-wider uppercase mb-1.5">
          Address Line 2
        </label>
        <input
          {...register('addressLine2')}
          className={inputBase}
          placeholder="Area, Colony, Landmark (optional)"
        />
      </div>

      {/* City + State row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-text-secondary text-[0.75rem] tracking-wider uppercase mb-1.5">
            City *
          </label>
          <input {...register('city')} className={inputBase} placeholder="Mumbai" />
          {errors.city && (
            <p className="text-red-400 text-[0.72rem] mt-1">{errors.city.message}</p>
          )}
        </div>
        <div>
          <label className="block text-text-secondary text-[0.75rem] tracking-wider uppercase mb-1.5">
            State *
          </label>
          <select {...register('state')} className={cn(inputBase, 'cursor-pointer')} defaultValue="">
            <option value="" disabled>
              Select state
            </option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="text-red-400 text-[0.72rem] mt-1">{errors.state.message}</p>
          )}
        </div>
      </div>

      {/* PIN Code */}
      <div className="max-w-[200px]">
        <label className="block text-text-secondary text-[0.75rem] tracking-wider uppercase mb-1.5">
          PIN Code *
        </label>
        <input
          {...register('pinCode')}
          className={inputBase}
          placeholder="400001"
          maxLength={6}
          inputMode="numeric"
        />
        {errors.pinCode && (
          <p className="text-red-400 text-[0.72rem] mt-1">{errors.pinCode.message}</p>
        )}
      </div>

      {/* Save for next */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          {...register('saveForNext')}
          className="w-4 h-4 rounded border-[var(--border)] accent-gold"
        />
        <span className="text-text-secondary text-[0.8rem]">Save this address for next time</span>
      </label>

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-2.5 bg-transparent border border-[var(--border)] text-text-secondary text-[0.85rem] font-medium rounded-[8px] hover:bg-surface-hover transition-all cursor-pointer"
        >
          &larr; Back
        </button>
        <button
          type="submit"
          className="flex-1 py-2.5 bg-gold text-charcoal-deep font-semibold text-[0.85rem] tracking-[0.06em] rounded-[8px] hover:bg-gold-light hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(212,168,83,0.3)] transition-all cursor-pointer"
        >
          Continue to Payment
        </button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Step 3: Payment
// ---------------------------------------------------------------------------

function StepPayment({
  total,
  onNext,
  onBack,
  onSelectPayment,
}: {
  total: number;
  onNext: () => void;
  onBack: () => void;
  onSelectPayment: (method: string) => void;
}) {
  const [selected, setSelected] = useState<string>('upi');

  const handlePay = () => {
    onSelectPayment(selected);
    onNext();
  };

  return (
    <div className="space-y-5">
      <h2 className="font-[var(--font-display)] text-[1.5rem] text-text-primary mb-4">
        Payment Method
      </h2>

      <div className="p-4 rounded-[8px] bg-charcoal-light/30 border border-[var(--border)] mb-4">
        <div className="flex justify-between items-center">
          <span className="text-text-secondary text-[0.85rem]">Amount to Pay</span>
          <span className="text-gold text-[1.15rem] font-bold">{formatINR(total)}</span>
        </div>
      </div>

      <div className="space-y-2">
        {PAYMENT_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            className={cn(
              'w-full flex items-center gap-4 p-4 rounded-[8px] border transition-all cursor-pointer text-left',
              selected === opt.id
                ? 'border-gold bg-[rgba(212,168,83,0.08)]'
                : 'border-[var(--border)] bg-surface hover:border-[var(--border-strong)]'
            )}
          >
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-[0.85rem] font-bold',
                selected === opt.id
                  ? 'bg-gold text-charcoal-deep'
                  : 'bg-charcoal-light text-text-muted'
              )}
            >
              {opt.icon}
            </div>
            <div className="flex-1">
              <p className="text-text-primary text-[0.85rem] font-semibold">{opt.label}</p>
              <p className="text-text-muted text-[0.72rem]">{opt.desc}</p>
            </div>
            <div
              className={cn(
                'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                selected === opt.id ? 'border-gold' : 'border-[var(--border)]'
              )}
            >
              {selected === opt.id && (
                <div className="w-2.5 h-2.5 rounded-full bg-gold" />
              )}
            </div>
          </button>
        ))}
      </div>

      {selected === 'cod' && (
        <p className="text-text-muted text-[0.75rem] bg-charcoal-light/30 rounded-[8px] p-3 border border-[var(--border)]">
          An additional fee of {formatINR(49)} will be charged for Cash on Delivery orders.
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-2.5 bg-transparent border border-[var(--border)] text-text-secondary text-[0.85rem] font-medium rounded-[8px] hover:bg-surface-hover transition-all cursor-pointer"
        >
          &larr; Back
        </button>
        <button
          onClick={handlePay}
          className="flex-1 py-2.5 bg-gold text-charcoal-deep font-semibold text-[0.85rem] tracking-[0.06em] rounded-[8px] hover:bg-gold-light hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(212,168,83,0.3)] transition-all cursor-pointer"
        >
          {selected === 'cod' ? 'Place Order (COD)' : `Pay ${formatINR(total)}`}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 4: Confirmation
// ---------------------------------------------------------------------------

function StepConfirmation({
  orderNumber,
  total,
  items,
}: {
  orderNumber: string;
  total: number;
  items: CartItem[];
}) {
  const deliveryStart = new Date();
  deliveryStart.setDate(deliveryStart.getDate() + 7);
  const deliveryEnd = new Date();
  deliveryEnd.setDate(deliveryEnd.getDate() + 10);

  const fmt = (d: Date) =>
    d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="text-center space-y-6 max-w-md mx-auto">
      {/* Checkmark */}
      <div className="w-20 h-20 mx-auto rounded-full bg-green-500/15 flex items-center justify-center animate-[scaleIn_0.5s_ease-out]">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path
            d="M8 18l8 8 12-14"
            stroke="#22c55e"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-[drawCheck_0.6s_0.3s_ease-out_both]"
            style={{
              strokeDasharray: 40,
              strokeDashoffset: 40,
              animation: 'drawCheck 0.6s 0.3s ease-out forwards',
            }}
          />
        </svg>
      </div>

      <div>
        <h2 className="font-[var(--font-display)] text-[1.8rem] text-text-primary mb-1">
          Order Confirmed!
        </h2>
        <p className="text-text-muted text-[0.85rem]">
          Thank you for your order. We will send a confirmation to your email.
        </p>
      </div>

      <div className="p-4 rounded-[8px] bg-surface border border-[var(--border)] text-left space-y-3">
        <div className="flex justify-between">
          <span className="text-text-muted text-[0.8rem]">Order Number</span>
          <span className="text-gold font-semibold text-[0.85rem]">{orderNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted text-[0.8rem]">Items</span>
          <span className="text-text-primary text-[0.85rem]">
            {items.reduce((s, i) => s + i.quantity, 0)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted text-[0.8rem]">Total</span>
          <span className="text-text-primary font-semibold text-[0.85rem]">{formatINR(total)}</span>
        </div>
        <div className="border-t border-[var(--border)] pt-3 flex justify-between">
          <span className="text-text-muted text-[0.8rem]">Estimated Delivery</span>
          <span className="text-text-primary text-[0.85rem]">
            {fmt(deliveryStart)} &ndash; {fmt(deliveryEnd)}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          className="flex-1 py-2.5 bg-transparent border border-[var(--border)] text-text-secondary text-[0.85rem] font-medium rounded-[8px] hover:bg-surface-hover transition-all cursor-pointer"
          onClick={() => {
            // Placeholder for track order
          }}
        >
          Track Order
        </button>
        <Link
          href="/"
          className="flex-1 py-2.5 bg-gold text-charcoal-deep font-semibold text-[0.85rem] tracking-[0.06em] rounded-[8px] hover:bg-gold-light transition-all text-center"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Checkout Page
// ---------------------------------------------------------------------------

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const total = getTotal();

  const [step, setStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState<ShippingInput | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('upi');
  const [orderNumber, setOrderNumber] = useState('');

  const handlePlaceOrder = useCallback(() => {
    // Generate order number
    const num = `EMB-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    setOrderNumber(num);
    setStep(3);
    clearCart();
  }, [clearCart]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <ProgressBar current={step} />

      {step === 0 && (
        <StepReviewCart items={items} total={total} onNext={() => setStep(1)} />
      )}
      {step === 1 && (
        <StepShipping
          onNext={() => setStep(2)}
          onBack={() => setStep(0)}
          onSaveAddress={setShippingAddress}
        />
      )}
      {step === 2 && (
        <StepPayment
          total={total}
          onNext={handlePlaceOrder}
          onBack={() => setStep(1)}
          onSelectPayment={setPaymentMethod}
        />
      )}
      {step === 3 && (
        <StepConfirmation orderNumber={orderNumber} total={total} items={items} />
      )}

      <style>{`
        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
