'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';

interface AdminOrder {
  id: string;
  customer: string;
  email: string;
  date: string;
  items: number;
  total: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered';
}

const allOrders: AdminOrder[] = [
  { id: 'ORD-1050', customer: 'Priya Nair', email: 'priya@example.com', date: '2026-04-09', items: 2, total: 3998, status: 'Pending' },
  { id: 'ORD-1049', customer: 'Amit Patel', email: 'amit@example.com', date: '2026-04-09', items: 1, total: 1849, status: 'Pending' },
  { id: 'ORD-1048', customer: 'Sneha Gupta', email: 'sneha@example.com', date: '2026-04-08', items: 3, total: 5697, status: 'Confirmed' },
  { id: 'ORD-1047', customer: 'Rahul Sharma', email: 'rahul@example.com', date: '2026-04-08', items: 1, total: 1999, status: 'Confirmed' },
  { id: 'ORD-1046', customer: 'Kiran Reddy', email: 'kiran@example.com', date: '2026-04-07', items: 2, total: 3490, status: 'Shipped' },
  { id: 'ORD-1045', customer: 'Aisha Khan', email: 'aisha@example.com', date: '2026-04-07', items: 1, total: 1649, status: 'Shipped' },
  { id: 'ORD-1044', customer: 'Vikram Singh', email: 'vikram@example.com', date: '2026-04-06', items: 4, total: 7196, status: 'Shipped' },
  { id: 'ORD-1043', customer: 'Meera Joshi', email: 'meera@example.com', date: '2026-04-06', items: 2, total: 3698, status: 'Delivered' },
  { id: 'ORD-1042', customer: 'Rahul Sharma', email: 'rahul@example.com', date: '2026-04-05', items: 2, total: 3490, status: 'Delivered' },
  { id: 'ORD-1041', customer: 'Pooja Mehta', email: 'pooja@example.com', date: '2026-04-05', items: 1, total: 1999, status: 'Delivered' },
];

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  Confirmed: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  Shipped: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  Delivered: 'bg-green-500/15 text-green-400 border-green-500/30',
};

const allStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered'] as const;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(allOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.email.toLowerCase().includes(q);
    }
    return true;
  });

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((o) => o.id)));
    }
  }

  function bulkUpdateStatus(newStatus: AdminOrder['status']) {
    setOrders((prev) =>
      prev.map((o) => (selected.has(o.id) ? { ...o, status: newStatus } : o))
    );
    setSelected(new Set());
  }

  return (
    <div className="space-y-6">
      <h1 className="font-[var(--font-display)] text-2xl font-semibold text-text-primary">
        Order Management
      </h1>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by order ID, customer, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-[var(--radius-sm)] bg-charcoal-light border border-[var(--border)] text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-gold transition-colors"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-[var(--radius-sm)] bg-charcoal-light border border-[var(--border)] text-text-primary text-sm focus:outline-none focus:border-gold transition-colors cursor-pointer"
        >
          <option value="all">All statuses</option>
          {allStatuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-[var(--radius-sm)] bg-gold/10 border border-gold/20">
          <span className="text-sm text-gold font-medium">{selected.size} selected</span>
          <span className="text-text-muted text-sm">Update status:</span>
          {allStatuses.map((s) => (
            <button
              key={s}
              onClick={() => bulkUpdateStatus(s)}
              className="px-3 py-1 rounded text-xs font-medium bg-surface border border-[var(--border)] text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="bg-surface rounded-[var(--radius-md)] border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-5 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded accent-gold cursor-pointer"
                  />
                </th>
                <th className="text-left text-xs text-text-muted font-medium px-5 py-3 uppercase tracking-wider">Order</th>
                <th className="text-left text-xs text-text-muted font-medium px-5 py-3 uppercase tracking-wider hidden sm:table-cell">Customer</th>
                <th className="text-left text-xs text-text-muted font-medium px-5 py-3 uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="text-left text-xs text-text-muted font-medium px-5 py-3 uppercase tracking-wider hidden md:table-cell">Items</th>
                <th className="text-right text-xs text-text-muted font-medium px-5 py-3 uppercase tracking-wider">Total</th>
                <th className="text-right text-xs text-text-muted font-medium px-5 py-3 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-text-muted text-sm">No orders found.</td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-hover transition-colors">
                    <td className="px-5 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(order.id)}
                        onChange={() => toggleSelect(order.id)}
                        className="w-4 h-4 rounded accent-gold cursor-pointer"
                      />
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm font-medium text-text-primary">{order.id}</span>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <div>
                        <p className="text-sm text-text-primary">{order.customer}</p>
                        <p className="text-xs text-text-muted">{order.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-text-secondary hidden md:table-cell">{order.date}</td>
                    <td className="px-5 py-3 text-sm text-text-secondary hidden md:table-cell">{order.items}</td>
                    <td className="px-5 py-3 text-sm text-text-primary text-right font-medium">&#8377;{order.total.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`inline-block text-xs px-2.5 py-1 rounded-full border ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
