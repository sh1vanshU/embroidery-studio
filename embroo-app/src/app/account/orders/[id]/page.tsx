'use client';

export const dynamic = 'force-dynamic';

import { useParams } from 'next/navigation';
import Link from 'next/link';

const timelineSteps = [
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'designing', label: 'Designing' },
  { key: 'stitching', label: 'Stitching' },
  { key: 'qc', label: 'Quality Check' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
];

// Mock data
const mockOrderData = {
  id: 'ORD-1042',
  date: '2026-04-05',
  currentStep: 4, // index into timelineSteps (0-based) — "shipped"
  items: [
    { name: 'Custom Varsity Hoodie', garmentType: 'Hoodie', size: 'L', qty: 1, price: 1999, color: '#1A1A2E' },
    { name: 'Team Logo T-Shirt', garmentType: 'T-Shirt', size: 'M', qty: 1, price: 1491, color: '#FFFFFF' },
  ],
  subtotal: 3490,
  shipping: 0,
  total: 3490,
  shippingAddress: {
    name: 'Rahul Sharma',
    line1: '42, MG Road, Koramangala',
    city: 'Bangalore',
    state: 'Karnataka',
    pinCode: '560034',
    phone: '+91 9876543210',
  },
  payment: {
    method: 'UPI',
    transactionId: 'TXN-984721',
  },
  trackingNumber: 'DTDC1234567890',
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  // In production, fetch from API using orderId
  const order = mockOrderData;

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <Link href="/account/orders" className="text-sm text-text-muted hover:text-text-secondary transition-colors mb-1 inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to orders
          </Link>
          <h1 className="font-[var(--font-display)] text-2xl font-semibold text-text-primary">
            Order {orderId}
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">Placed on {order.date}</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-surface rounded-[var(--radius-md)] border border-[var(--border)] p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-text-primary mb-5">Order Tracking</h2>
        <div className="relative">
          {/* Progress bar */}
          <div className="hidden sm:block absolute top-4 left-0 right-0 h-0.5 bg-charcoal-light">
            <div
              className="h-full bg-gold transition-all duration-500"
              style={{ width: `${(order.currentStep / (timelineSteps.length - 1)) * 100}%` }}
            />
          </div>

          {/* Steps */}
          <div className="sm:flex sm:justify-between relative">
            {timelineSteps.map((step, i) => {
              const isCompleted = i <= order.currentStep;
              const isCurrent = i === order.currentStep;
              return (
                <div key={step.key} className="flex sm:flex-col items-center gap-3 sm:gap-2 mb-4 sm:mb-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-colors ${
                      isCompleted
                        ? 'bg-gold border-gold text-charcoal-deep'
                        : 'bg-charcoal-light border-[var(--border)] text-text-muted'
                    } ${isCurrent ? 'ring-2 ring-gold/30 ring-offset-2 ring-offset-surface' : ''}`}
                  >
                    {isCompleted ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      <span className="text-xs font-medium">{i + 1}</span>
                    )}
                  </div>
                  <span className={`text-xs font-medium text-center ${isCompleted ? 'text-gold' : 'text-text-muted'}`}>
                    {step.label}
                  </span>
                  {/* Mobile connector */}
                  {i < timelineSteps.length - 1 && (
                    <div className="sm:hidden w-0.5 h-4 bg-charcoal-light absolute left-[15px]" style={{ top: `${i * 52 + 36}px` }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 bg-surface rounded-[var(--radius-md)] border border-[var(--border)]">
          <div className="p-5 border-b border-[var(--border)]">
            <h2 className="text-sm font-semibold text-text-primary">Items</h2>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {order.items.map((item, i) => (
              <div key={i} className="p-4 sm:p-5 flex items-start gap-4">
                {/* Mini thumbnail */}
                <div className="w-14 h-14 rounded-[var(--radius-sm)] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.color }}>
                  <svg className="w-6 h-6 opacity-30" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">{item.name}</p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {item.garmentType} &middot; Size {item.size} &middot; Qty {item.qty}
                  </p>
                </div>
                <p className="text-sm font-medium text-text-primary">&#8377;{item.price.toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
          {/* Totals */}
          <div className="p-5 border-t border-[var(--border)] space-y-2">
            <div className="flex justify-between text-sm text-text-secondary">
              <span>Subtotal</span>
              <span>&#8377;{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm text-text-secondary">
              <span>Shipping</span>
              <span>{order.shipping === 0 ? 'Free' : `₹${order.shipping}`}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-text-primary pt-2 border-t border-[var(--border)]">
              <span>Total</span>
              <span>&#8377;{order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Shipping */}
          <div className="bg-surface rounded-[var(--radius-md)] border border-[var(--border)] p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Shipping Address</h3>
            <div className="text-sm text-text-secondary space-y-0.5">
              <p className="font-medium text-text-primary">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.line1}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pinCode}</p>
              <p>{order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-surface rounded-[var(--radius-md)] border border-[var(--border)] p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Payment</h3>
            <div className="text-sm text-text-secondary space-y-1">
              <p>Method: <span className="text-text-primary">{order.payment.method}</span></p>
              <p>Transaction: <span className="text-text-primary font-mono text-xs">{order.payment.transactionId}</span></p>
            </div>
          </div>

          {/* Tracking */}
          {order.trackingNumber && (
            <div className="bg-surface rounded-[var(--radius-md)] border border-[var(--border)] p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-3">Tracking</h3>
              <p className="text-sm text-text-primary font-mono">{order.trackingNumber}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
