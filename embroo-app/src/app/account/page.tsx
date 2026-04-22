'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

// Mock data for demonstration
const mockStats = {
  totalOrders: 5,
  savedDesigns: 8,
  accountStatus: 'Active',
};

const mockRecentOrders = [
  { id: 'ORD-1042', date: '2026-04-05', items: 2, total: 3490, status: 'Shipped' as const },
  { id: 'ORD-1038', date: '2026-03-28', items: 1, total: 1849, status: 'Delivered' as const },
  { id: 'ORD-1031', date: '2026-03-15', items: 3, total: 5250, status: 'Delivered' as const },
];

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  Confirmed: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  Shipped: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  Delivered: 'bg-green-500/15 text-green-400 border-green-500/30',
};

export default function AccountDashboard() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(' ')[0] || 'there';

  return (
    <div className="max-w-5xl space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="font-[var(--font-display)] text-2xl sm:text-3xl font-semibold text-text-primary">
          Welcome back, {firstName}
        </h1>
        <p className="text-text-secondary text-sm mt-1">Here is what is happening with your account.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Orders', value: mockStats.totalOrders, icon: 'M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z' },
          { label: 'Saved Designs', value: mockStats.savedDesigns, icon: 'M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z' },
          { label: 'Account Status', value: mockStats.accountStatus, icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-surface rounded-[var(--radius-md)] border border-[var(--border)] p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-gold/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                </svg>
              </div>
              <span className="text-sm text-text-secondary">{stat.label}</span>
            </div>
            <p className="text-2xl font-semibold text-text-primary">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-surface rounded-[var(--radius-md)] border border-[var(--border)]">
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
          <h2 className="font-semibold text-text-primary">Recent Orders</h2>
          <Link href="/account/orders" className="text-sm text-gold hover:text-gold-light transition-colors">
            View all
          </Link>
        </div>
        {mockRecentOrders.length === 0 ? (
          <div className="p-8 text-center text-text-muted text-sm">No orders yet.</div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {mockRecentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between p-4 sm:p-5 hover:bg-surface-hover transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{order.id}</p>
                    <p className="text-xs text-text-muted mt-0.5">{order.date} &middot; {order.items} item{order.items > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                  <span className="text-sm font-medium text-text-primary hidden sm:block">
                    &#8377;{order.total.toLocaleString('en-IN')}
                  </span>
                  <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: '/account/designs', label: 'My Designs', desc: 'View and edit saved designs', icon: 'M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z' },
          { href: '/account/orders', label: 'My Orders', desc: 'Track and manage orders', icon: 'M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z' },
          { href: '/account/settings', label: 'Settings', desc: 'Profile, addresses, password', icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z' },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-surface rounded-[var(--radius-md)] border border-[var(--border)] p-5 hover:border-gold/40 hover:shadow-[var(--shadow-gold)] transition-all group"
          >
            <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-gold/10 flex items-center justify-center mb-3 group-hover:bg-gold/20 transition-colors">
              <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-text-primary">{link.label}</h3>
            <p className="text-xs text-text-muted mt-0.5">{link.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
