'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface Address {
  id: string;
  label: string;
  name: string;
  line1: string;
  city: string;
  state: string;
  pinCode: string;
  phone: string;
  isDefault: boolean;
}

const mockAddresses: Address[] = [
  { id: 'a1', label: 'Home', name: 'Rahul Sharma', line1: '42, MG Road, Koramangala', city: 'Bangalore', state: 'Karnataka', pinCode: '560034', phone: '+91 9876543210', isDefault: true },
  { id: 'a2', label: 'Office', name: 'Rahul Sharma', line1: '12th Floor, Tech Park', city: 'Bangalore', state: 'Karnataka', pinCode: '560103', phone: '+91 9876543210', isDefault: false },
];

type SettingsTab = 'profile' | 'addresses' | 'password' | 'danger';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [addresses, setAddresses] = useState(mockAddresses);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Profile state
  const [name, setName] = useState(session?.user?.name || '');
  const [email] = useState(session?.user?.email || '');
  const [phone, setPhone] = useState('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const tabs: { key: SettingsTab; label: string }[] = [
    { key: 'profile', label: 'Profile' },
    { key: 'addresses', label: 'Addresses' },
    { key: 'password', label: 'Password' },
    { key: 'danger', label: 'Danger Zone' },
  ];

  const inputClass =
    'w-full px-4 py-3 rounded-[var(--radius-sm)] bg-charcoal-light border border-[var(--border)] text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors';

  async function handleSaveProfile() {
    setSaving(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
  }

  async function handleChangePassword() {
    if (newPassword !== confirmPassword) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setSaving(false);
  }

  function setDefault(id: string) {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  }

  function deleteAddress(id: string) {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-[var(--font-display)] text-2xl font-semibold text-text-primary">
        Settings
      </h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface rounded-[var(--radius-sm)] border border-[var(--border)] p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-[6px] text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-gold/15 text-gold'
                : 'text-text-secondary hover:text-text-primary'
            } ${tab.key === 'danger' ? 'text-red-400' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile */}
      {activeTab === 'profile' && (
        <div className="bg-surface rounded-[var(--radius-md)] border border-[var(--border)] p-6 space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gold/15 flex items-center justify-center text-gold text-xl font-semibold">
              {(session?.user?.name || 'U')[0].toUpperCase()}
            </div>
            <div>
              <button className="text-sm text-gold hover:text-gold-light transition-colors cursor-pointer font-medium">
                Change avatar
              </button>
              <p className="text-xs text-text-muted mt-0.5">JPG or PNG, max 2MB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
              <input type="email" value={email} readOnly className={`${inputClass} opacity-60 cursor-not-allowed`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Phone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="+91 9876543210" />
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="px-6 py-2.5 rounded-[var(--radius-sm)] bg-gold text-charcoal-deep font-semibold text-sm hover:bg-gold-light disabled:opacity-50 transition-colors cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      )}

      {/* Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-surface rounded-[var(--radius-md)] border border-[var(--border)] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-text-primary">{addr.label}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30 font-medium">Default</span>
                    )}
                  </div>
                  <div className="text-sm text-text-secondary space-y-0.5">
                    <p>{addr.name}</p>
                    <p>{addr.line1}</p>
                    <p>{addr.city}, {addr.state} {addr.pinCode}</p>
                    <p>{addr.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!addr.isDefault && (
                    <button
                      onClick={() => setDefault(addr.id)}
                      className="text-xs text-gold hover:text-gold-light transition-colors cursor-pointer"
                    >
                      Set default
                    </button>
                  )}
                  <button className="text-xs text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
                    Edit
                  </button>
                  <button
                    onClick={() => deleteAddress(addr.id)}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button className="w-full py-3 rounded-[var(--radius-md)] border-2 border-dashed border-[var(--border)] text-sm text-text-muted hover:border-gold/30 hover:text-gold transition-colors cursor-pointer">
            + Add new address
          </button>
        </div>
      )}

      {/* Password */}
      {activeTab === 'password' && (
        <div className="bg-surface rounded-[var(--radius-md)] border border-[var(--border)] p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Current Password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} placeholder="Min 8 chars, uppercase, number, symbol" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="mt-1 text-xs text-red-400">Passwords do not match</p>
            )}
          </div>
          <button
            onClick={handleChangePassword}
            disabled={saving || !currentPassword || !newPassword || newPassword !== confirmPassword}
            className="px-6 py-2.5 rounded-[var(--radius-sm)] bg-gold text-charcoal-deep font-semibold text-sm hover:bg-gold-light disabled:opacity-50 transition-colors cursor-pointer"
          >
            {saving ? 'Updating...' : 'Update password'}
          </button>
        </div>
      )}

      {/* Danger Zone */}
      {activeTab === 'danger' && (
        <div className="bg-surface rounded-[var(--radius-md)] border border-red-500/30 p-6">
          <h3 className="text-sm font-semibold text-red-400 mb-2">Delete Account</h3>
          <p className="text-sm text-text-secondary mb-4">
            Once you delete your account, there is no going back. All your designs, orders, and data will be permanently removed.
          </p>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors cursor-pointer"
            >
              Delete my account
            </button>
          ) : (
            <div className="p-4 rounded-[var(--radius-sm)] bg-red-500/10 border border-red-500/30 space-y-3">
              <p className="text-sm text-red-400 font-medium">Are you absolutely sure?</p>
              <p className="text-xs text-text-secondary">
                Type &quot;DELETE&quot; to confirm. This action cannot be undone.
              </p>
              <input
                type="text"
                placeholder='Type "DELETE"'
                className={`${inputClass} border-red-500/30`}
              />
              <div className="flex gap-3">
                <button className="px-4 py-2 rounded-[var(--radius-sm)] bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer">
                  Permanently delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-[var(--radius-sm)] bg-surface border border-[var(--border)] text-text-secondary text-sm hover:text-text-primary transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
