'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, Mail, Lock, MapPin, CreditCard, Bell, Shield, 
  ChevronRight, Plus, Trash2, Edit2, Check, X, LogOut
} from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import styles from './Account.module.css';

export default function AccountPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Profile state
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  
  // Addresses state
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    label: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    isDefault: false,
  });

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadProfile();
    loadAddresses();
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await apiFetch('/auth/profile');
      const data = response.data || response;
      setProfile({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
      });
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAddresses = async () => {
    try {
      const response = await apiFetch('/addresses');
      setAddresses(response.data?.addresses || []);
    } catch (err) {
      console.error('Failed to load addresses:', err);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiFetch('/profile', {
        method: 'PATCH',
        body: JSON.stringify(profile),
      });
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setSaving(true);
    try {
      await apiFetch('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      toast.success('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingAddress) {
        await apiFetch(`/addresses/${editingAddress}`, {
          method: 'PATCH',
          body: JSON.stringify(addressForm),
        });
        toast.success('Address updated');
      } else {
        await apiFetch('/addresses', {
          method: 'POST',
          body: JSON.stringify(addressForm),
        });
        toast.success('Address added');
      }
      await loadAddresses();
      resetAddressForm();
    } catch (err) {
      toast.error('Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await apiFetch(`/addresses/${addressId}`, { method: 'DELETE' });
      toast.success('Address deleted');
      await loadAddresses();
    } catch (err) {
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      await apiFetch(`/addresses/${addressId}/default`, { method: 'POST' });
      toast.success('Default address updated');
      await loadAddresses();
    } catch (err) {
      toast.error('Failed to set default address');
    }
  };

  const editAddress = (address) => {
    setEditingAddress(address._id);
    setAddressForm({
      firstName: address.firstName || '',
      lastName: address.lastName || '',
      email: address.email || '',
      phone: address.phone || '',
      label: address.label || '',
      street: address.street || '',
      apartment: address.apartment || '',
      city: address.city || '',
      state: address.state || '',
      zipCode: address.zipCode || '',
      country: address.country || 'United States',
      isDefault: address.isDefault || false,
    });
    setShowAddressForm(true);
  };

  const resetAddressForm = () => {
    setEditingAddress(null);
    setShowAddressForm(false);
    setAddressForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      label: '',
      street: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      isDefault: false,
    });
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
    if (!window.confirm('This will permanently delete all your data. Continue?')) return;
    
    try {
      await apiFetch('/profile', { method: 'DELETE' });
      toast.success('Account deleted');
      await logout();
      router.push('/');
    } catch (err) {
      toast.error('Failed to delete account');
    }
  };

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <span className={styles.kicker}>My Account</span>
          <h1 className={styles.title}>Account Settings</h1>
        </header>

        <div className={styles.layout}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.userCard}>
              <div className={styles.avatar}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.firstName} />
                ) : (
                  <span>{((user.firstName || user.email || 'U')[0] + (user.lastName || '')[0]).toUpperCase()}</span>
                )}
              </div>
              <div className={styles.userInfo}>
                <h3>{user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || user.email || 'User'}</h3>
                <p>{user.email}</p>
              </div>
            </div>

            <nav className={styles.tabNav}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon size={18} />
                  <span>{tab.label}</span>
                  <ChevronRight size={16} className={styles.chevron} />
                </button>
              ))}
            </nav>

            <div className={styles.sidebarFooter}>
              <Link href="/orders" className={styles.ordersLink}>
                View Order History
              </Link>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className={styles.content}>
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Personal Information</h2>
                <p className={styles.sectionDesc}>Update your personal details here.</p>
                
                <form onSubmit={handleProfileSubmit} className={styles.form}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>First Name</label>
                      <input
                        type="text"
                        value={profile.firstName}
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        placeholder="John"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Last Name</label>
                      <input
                        type="text"
                        value={profile.lastName}
                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <button type="submit" className={styles.submitBtn} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </section>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h2 className={styles.sectionTitle}>Saved Addresses</h2>
                    <p className={styles.sectionDesc}>Manage your shipping and billing addresses.</p>
                  </div>
                  {!showAddressForm && (
                    <button 
                      className={styles.addBtn}
                      onClick={() => setShowAddressForm(true)}
                    >
                      <Plus size={16} />
                      Add Address
                    </button>
                  )}
                </div>

                {showAddressForm && (
                  <form onSubmit={handleAddressSubmit} className={styles.addressForm}>
                    <h3>{editingAddress ? 'Edit Address' : 'New Address'}</h3>
                    
                    <div className={styles.formGroup}>
                      <label>Label (e.g., Home, Work)</label>
                      <input
                        type="text"
                        value={addressForm.label}
                        onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                        placeholder="Home"
                      />
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>First Name</label>
                        <input
                          type="text"
                          value={addressForm.firstName}
                          onChange={(e) => setAddressForm({ ...addressForm, firstName: e.target.value })}
                          placeholder="John"
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Last Name</label>
                        <input
                          type="text"
                          value={addressForm.lastName}
                          onChange={(e) => setAddressForm({ ...addressForm, lastName: e.target.value })}
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Email</label>
                        <input
                          type="email"
                          value={addressForm.email}
                          onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })}
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Phone</label>
                        <input
                          type="tel"
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          placeholder="+1 (555) 000-0000"
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Street Address</label>
                      <input
                        type="text"
                        value={addressForm.street}
                        onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                        placeholder="123 Main St"
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Apartment, suite, etc. (optional)</label>
                      <input
                        type="text"
                        value={addressForm.apartment}
                        onChange={(e) => setAddressForm({ ...addressForm, apartment: e.target.value })}
                        placeholder="Apt 4B"
                      />
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>City</label>
                        <input
                          type="text"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          placeholder="Los Angeles"
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>State</label>
                        <input
                          type="text"
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          placeholder="CA"
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>ZIP Code</label>
                        <input
                          type="text"
                          value={addressForm.zipCode}
                          onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                          placeholder="90001"
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Country</label>
                        <input
                          type="text"
                          value={addressForm.country}
                          onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                          placeholder="United States"
                        />
                      </div>
                    </div>

                    <label className={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={addressForm.isDefault}
                        onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                      />
                      <span>Set as default address</span>
                    </label>

                    <div className={styles.formActions}>
                      <button type="button" className={styles.cancelBtn} onClick={resetAddressForm}>
                        Cancel
                      </button>
                      <button type="submit" className={styles.submitBtn} disabled={saving}>
                        {saving ? 'Saving...' : (editingAddress ? 'Update' : 'Add Address')}
                      </button>
                    </div>
                  </form>
                )}

                <div className={styles.addressList}>
                  {addresses.length === 0 ? (
                    <p className={styles.emptyText}>No addresses saved yet.</p>
                  ) : (
                    addresses.map((address) => (
                      <div key={address._id} className={styles.addressCard}>
                        <div className={styles.addressInfo}>
                          <div className={styles.addressHeader}>
                            <span className={styles.addressLabel}>{address.label || 'Address'}</span>
                            {address.isDefault && <span className={styles.defaultBadge}>Default</span>}
                          </div>
                          <p className={styles.addressName}>
                            {address.firstName} {address.lastName}
                          </p>
                          <p className={styles.addressText}>
                            {address.street}{address.apartment && `, ${address.apartment}`}<br />
                            {address.city}, {address.state} {address.zipCode}<br />
                            {address.country}
                          </p>
                          <p className={styles.addressContact}>
                            {address.email} &bull; {address.phone}
                          </p>
                        </div>
                        <div className={styles.addressActions}>
                          {!address.isDefault && (
                            <button 
                              className={styles.setDefaultBtn}
                              onClick={() => handleSetDefaultAddress(address._id)}
                            >
                              Set Default
                            </button>
                          )}
                          <button 
                            className={styles.editBtn}
                            onClick={() => editAddress(address)}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            className={styles.deleteBtn}
                            onClick={() => handleDeleteAddress(address._id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Password & Security</h2>
                <p className={styles.sectionDesc}>Manage your password and security settings.</p>

                <form onSubmit={handlePasswordSubmit} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label>Current Password</label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>New Password</label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      placeholder="••••••••"
                      required
                      minLength={8}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <button type="submit" className={styles.submitBtn} disabled={saving}>
                    {saving ? 'Updating...' : 'Change Password'}
                  </button>
                </form>

                <div className={styles.dangerZone}>
                  <h3>Danger Zone</h3>
                  <p>Once you delete your account, there is no going back. Please be certain.</p>
                  <button className={styles.deleteAccountBtn} onClick={handleDeleteAccount}>
                    Delete Account
                  </button>
                </div>
              </section>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Notification Preferences</h2>
                <p className={styles.sectionDesc}>Choose what notifications you'd like to receive.</p>

                <div className={styles.notificationList}>
                  <label className={styles.notificationItem}>
                    <div>
                      <h4>Order Updates</h4>
                      <p>Receive updates about your orders</p>
                    </div>
                    <input type="checkbox" defaultChecked />
                  </label>

                  <label className={styles.notificationItem}>
                    <div>
                      <h4>Promotions & Sales</h4>
                      <p>Be the first to know about exclusive offers</p>
                    </div>
                    <input type="checkbox" defaultChecked />
                  </label>

                  <label className={styles.notificationItem}>
                    <div>
                      <h4>New Arrivals</h4>
                      <p>Get notified when new products are available</p>
                    </div>
                    <input type="checkbox" />
                  </label>

                  <label className={styles.notificationItem}>
                    <div>
                      <h4>Stock Alerts</h4>
                      <p>Notify me when items in my wishlist are back in stock</p>
                    </div>
                    <input type="checkbox" defaultChecked />
                  </label>
                </div>

                <button className={styles.submitBtn}>Save Preferences</button>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
