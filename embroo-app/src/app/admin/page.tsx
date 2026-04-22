'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';

// Mock data
const stats = [
  { label: 'Total Orders', value: '1,247', change: '+12%', icon: 'M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z' },
  { label: 'Revenue', value: '\u20B924.8L', change: '+8%', icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z' },
  { label: 'Active Users', value: '3,421', change: '+5%', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
  { label: 'Pending Orders', value: '28', change: '-3%', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
];

const recentOrders = [
  { id: 'ORD-1050', customer: 'Priya Nair', date: '2026-04-09', items: 2, total: 3998, status: 'Pending' },
  { id: 'ORD-1049', customer: 'Amit Patel', date: '2026-04-09', items: 1, total: 1849, status: 'Pending' },
  { id: 'ORD-1048', customer: 'Sneha Gupta', date: '2026-04-08', items: 3, total: 5697, status: 'Confirmed' },
  { id: 'ORD-1047', customer: 'Rahul Sharma', date: '2026-04-08', items: 1, total: 1999, status: 'Confirmed' },
  { id: 'ORD-1046', customer: 'Kiran Reddy', date: '2026-04-07', items: 2, total: 3490, status: 'Shipped' },
  { id: 'ORD-1045', customer: 'Aisha Khan', date: '2026-04-07', items: 1, total: 1649, status: 'Shipped' },
  { id: 'ORD-1044', customer: 'Vikram Singh', date: '2026-04-06', items: 4, total: 7196, status: 'Shipped' },
  { id: 'ORD-1043', customer: 'Meera Joshi', date: '2026-04-06', items: 2, total: 3698, status: 'Delivered' },
  { id: 'ORD-1042', customer: 'Rahul Sharma', date: '2026-04-05', items: 2, total: 3490, status: 'Delivered' },
  { id: 'ORD-1041', customer: 'Pooja Mehta', date: '2026-04-05', items: 1, total: 1999, status: 'Delivered' },
];

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  Confirmed: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  Shipped: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  Delivered: 'bg-green-500/15 text-green-400 border-green-500/30',
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="font-[var(--font-display)] text-2xl font-semibold text-text-primary">
        Admin Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface rounded-[var(--radius-md)] border border-[var(--border)] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-gold/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                </svg>
              </div>
              <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-semibold text-text-primary">{stat.value}</p>
            <p className="text-xs text-text-muted mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-surface rounded-[var(--radius-md)] border border-[var(--border)]">
          <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
            <h2 className="font-semibold text-text-primary">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-gold hover:text-gold-light transition-colors">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left text-xs text-text-muted font-medium px-5 py-3 uppercase tracking-wider">Order</th>
                  <th className="text-left text-xs text-text-muted font-medium px-5 py-3 uppercase tracking-wider hidden sm:table-cell">Customer</th>
                  <th className="text-left text-xs text-text-muted font-medium px-5 py-3 uppercase tracking-wider hidden md:table-cell">Date</th>
                  <th className="text-right text-xs text-text-muted font-medium px-5 py-3 uppercase tracking-wider">Total</th>
                  <th className="text-right text-xs text-text-muted font-medium px-5 py-3 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-hover transition-colors">
                    <td className="px-5 py-3">
                      <Link href={`/admin/orders`} className="text-sm font-medium text-text-primary hover:text-gold transition-colors">
                        {order.id}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-sm text-text-secondary hidden sm:table-cell">{order.customer}</td>
                    <td className="px-5 py-3 text-sm text-text-secondary hidden md:table-cell">{order.date}</td>
                    <td className="px-5 py-3 text-sm text-text-primary text-right font-medium">&#8377;{order.total.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`inline-block text-xs px-2.5 py-1 rounded-full border ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions + Revenue placeholder */}
        <div className="space-y-4">
          {/* Revenue Chart Placeholder */}
          <div className="bg-surface rounded-[var(--radius-md)] border border-[var(--border)] p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-4">Revenue (30 days)</h3>
            <div className="h-40 flex items-end justify-between gap-1.5 px-1">
              {[35, 50, 45, 60, 40, 70, 55, 80, 65, 90, 75, 85].map((h, i) => (
                <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: 'linear-gradient(to top, var(--color-gold), var(--color-gold-light))' }} />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-text-muted mt-2 px-1">
              <span>Mar</span>
              <span>Apr</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-surface rounded-[var(--radius-md)] border border-[var(--border)] p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { href: '/admin/orders', label: 'Manage Orders', desc: '28 pending' },
                { href: '/admin/products', label: 'Manage Products', desc: '42 active' },
                { href: '/admin/users', label: 'Manage Users', desc: '3,421 total' },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center justify-between p-3 rounded-[var(--radius-sm)] hover:bg-surface-hover transition-colors group"
                >
                  <div>
                    <p className="text-sm font-medium text-text-primary group-hover:text-gold transition-colors">{action.label}</p>
                    <p className="text-xs text-text-muted">{action.desc}</p>
                  </div>
                  <svg className="w-4 h-4 text-text-muted group-hover:text-gold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
