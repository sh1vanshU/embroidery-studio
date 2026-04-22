'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';

interface Order {
  id: string;
  date: string;
  items: number;
  total: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered';
}

const mockOrders: Order[] = [
  { id: 'ORD-1042', date: '2026-04-05', items: 2, total: 3490, status: 'Shipped' },
  { id: 'ORD-1038', date: '2026-03-28', items: 1, total: 1849, status: 'Delivered' },
  { id: 'ORD-1031', date: '2026-03-15', items: 3, total: 5250, status: 'Delivered' },
  { id: 'ORD-1024', date: '2026-03-02', items: 1, total: 1999, status: 'Delivered' },
  { id: 'ORD-1019', date: '2026-02-18', items: 2, total: 3698, status: 'Delivered' },
];

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  Confirmed: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  Shipped: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  Delivered: 'bg-green-500/15 text-green-400 border-green-500/30',
};

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = statusFilter === 'all'
    ? mockOrders
    : mockOrders.filter((o) => o.status === statusFilter);

  return (
    <div className="max-w-5xl space-y-6">
      <h1 className="font-[var(--font-display)] text-2xl font-semibold text-text-primary">
        My Orders
      </h1>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'Pending', 'Confirmed', 'Shipped', 'Delivered'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3.5 py-2 rounded-[var(--radius-sm)] text-xs font-medium transition-colors cursor-pointer ${
              statusFilter === s
                ? 'bg-gold/15 text-gold border border-gold/30'
                : 'bg-surface border border-[var(--border)] text-text-secondary hover:text-text-primary'
            }`}
          >
            {s === 'all' ? 'All' : s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-surface rounded-[var(--radius-md)] border border-[var(--border)] overflow-hidden">
        {/* Desktop table header */}
        <div className="hidden sm:grid grid-cols-[1fr_1fr_0.5fr_1fr_0.8fr_auto] gap-4 px-5 py-3 border-b border-[var(--border)] text-xs text-text-muted uppercase tracking-wider font-medium">
          <span>Order</span>
          <span>Date</span>
          <span>Items</span>
          <span>Total</span>
          <span>Status</span>
          <span></span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-8 text-center text-text-muted text-sm">No orders found.</div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {filtered.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="block sm:grid sm:grid-cols-[1fr_1fr_0.5fr_1fr_0.8fr_auto] sm:items-center gap-4 px-5 py-4 hover:bg-surface-hover transition-colors"
              >
                {/* Mobile layout */}
                <div className="sm:hidden flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-primary">{order.id}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                <div className="sm:hidden flex items-center justify-between text-sm text-text-secondary">
                  <span>{order.date} &middot; {order.items} item{order.items > 1 ? 's' : ''}</span>
                  <span className="font-medium text-text-primary">&#8377;{order.total.toLocaleString('en-IN')}</span>
                </div>

                {/* Desktop layout */}
                <span className="hidden sm:block text-sm font-medium text-text-primary">{order.id}</span>
                <span className="hidden sm:block text-sm text-text-secondary">{order.date}</span>
                <span className="hidden sm:block text-sm text-text-secondary">{order.items}</span>
                <span className="hidden sm:block text-sm font-medium text-text-primary">&#8377;{order.total.toLocaleString('en-IN')}</span>
                <span className={`hidden sm:inline-block text-xs px-2.5 py-1 rounded-full border w-fit ${statusColors[order.status]}`}>
                  {order.status}
                </span>
                <svg className="hidden sm:block w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
