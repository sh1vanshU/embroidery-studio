// ---------------------------------------------------------------------------
// EMBROO INDIA — Razorpay Integration Utilities
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: 'created' | 'attempted' | 'paid';
  created_at: number;
}

export interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  handler: (response: RazorpayPaymentResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayCheckoutOptions) => {
      open: () => void;
      close: () => void;
    };
  }
}

// ---------------------------------------------------------------------------
// Server-side: Create Razorpay Order (placeholder)
// ---------------------------------------------------------------------------

export async function createRazorpayOrder(
  amount: number,
  currency: string = 'INR',
  receipt: string
): Promise<RazorpayOrderResponse> {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'Razorpay credentials are not configured. Refusing to create orders in production.'
      );
    }
    // Local development without keys: return a mock order. Note that the
    // server will refuse to verify payment for these orders, so they cannot
    // transition to PAID/CONFIRMED — they remain PENDING.
    console.warn('[Razorpay] No keys configured — returning mock order (dev only).');
    return {
      id: `order_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      entity: 'order',
      amount: amount * 100, // Razorpay expects paise
      amount_paid: 0,
      amount_due: amount * 100,
      currency,
      receipt,
      status: 'created',
      created_at: Math.floor(Date.now() / 1000),
    };
  }

  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
    },
    body: JSON.stringify({
      amount: amount * 100, // Convert to paise
      currency,
      receipt,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.error?.description || 'Failed to create Razorpay order');
  }

  return response.json();
}

// ---------------------------------------------------------------------------
// Client-side: Load Razorpay Script
// ---------------------------------------------------------------------------

let scriptLoaded = false;

export function loadRazorpayScript(): Promise<boolean> {
  if (scriptLoaded && typeof window !== 'undefined' && window.Razorpay) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    if (typeof document === 'undefined') {
      resolve(false);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      scriptLoaded = true;
      resolve(true);
    };
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ---------------------------------------------------------------------------
// Client-side: Open Razorpay Checkout
// ---------------------------------------------------------------------------

export async function openRazorpayCheckout(options: {
  orderId: string;
  amount: number;
  currency?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  onSuccess: (response: RazorpayPaymentResponse) => void;
  onDismiss?: () => void;
}): Promise<void> {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    throw new Error('Failed to load Razorpay SDK');
  }

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  if (!keyId) {
    throw new Error('Razorpay key not configured');
  }

  const rzp = new window.Razorpay({
    key: keyId,
    amount: options.amount * 100,
    currency: options.currency || 'INR',
    name: 'Embroo India',
    description: 'Custom Embroidery Order',
    order_id: options.orderId,
    prefill: {
      name: options.customerName,
      email: options.customerEmail,
      contact: options.customerPhone,
    },
    theme: {
      color: '#D4A853',
    },
    handler: options.onSuccess,
    modal: {
      ondismiss: options.onDismiss,
    },
  });

  rzp.open();
}

// ---------------------------------------------------------------------------
// Server-side: Verify Payment Signature
// ---------------------------------------------------------------------------

export async function verifyPayment(
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    throw new Error(
      'RAZORPAY_KEY_SECRET is not configured. Refusing to verify payment without it.'
    );
  }

  // Use Web Crypto API for HMAC-SHA256 verification
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(keySecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const data = encoder.encode(`${orderId}|${paymentId}`);
  const signatureBytes = await crypto.subtle.sign('HMAC', key, data);
  const expectedSignature = Array.from(new Uint8Array(signatureBytes))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  // Constant-time comparison to mitigate timing-based signature leaks
  if (expectedSignature.length !== signature.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expectedSignature.length; i++) {
    mismatch |= expectedSignature.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return mismatch === 0;
}
