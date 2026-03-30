'use client';

import React, { useState, useEffect } from 'react';
import styles from './NotificationPreferencesPanel.module.css';
import { useToast } from '../context/ToastContext';

/**
 * NotificationPreferencesPanel Component
 * Manage email notification preferences for user
 */
export default function NotificationPreferencesPanel({ userId }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    orderEmails: true,
    reviewEmails: true,
    wishlistEmails: true,
    promotionEmails: true,
    newsletterEmails: true,
    securityEmails: true,
    emailFrequency: 'instant',
  });

  useEffect(() => {
    fetchPreferences();
  }, [userId]);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notifications/preferences', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch preferences');

      const result = await response.json();
      setPreferences(result.data);
    } catch (error) {
      toast.error('Failed to load notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleFrequencyChange = (e) => {
    setPreferences((prev) => ({
      ...prev,
      emailFrequency: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/notifications/preferences', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) throw new Error('Failed to update preferences');

      toast.success('Notification preferences updated successfully');
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.panel}>
        <div className={styles.loadingState}>Loading preferences...</div>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>Email Notifications</h3>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>Email Types</p>
        <div className={styles.toggleGroup}>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={preferences.orderEmails}
              onChange={() => handleToggle('orderEmails')}
            />
            <span className={styles.toggleLabel}>Order Confirmations & Updates</span>
          </label>

          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={preferences.reviewEmails}
              onChange={() => handleToggle('reviewEmails')}
            />
            <span className={styles.toggleLabel}>Review Notifications</span>
          </label>

          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={preferences.wishlistEmails}
              onChange={() => handleToggle('wishlistEmails')}
            />
            <span className={styles.toggleLabel}>Wishlist Shares</span>
          </label>

          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={preferences.promotionEmails}
              onChange={() => handleToggle('promotionEmails')}
            />
            <span className={styles.toggleLabel}>Promotions & Special Offers</span>
          </label>

          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={preferences.newsletterEmails}
              onChange={() => handleToggle('newsletterEmails')}
            />
            <span className={styles.toggleLabel}>Weekly Newsletter</span>
          </label>

          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={preferences.securityEmails}
              onChange={() => handleToggle('securityEmails')}
              disabled
            />
            <span className={styles.toggleLabel}>
              Security Alerts <span className={styles.required}>(always on)</span>
            </span>
          </label>
        </div>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>Email Frequency</p>
        <div className={styles.frequencyControl}>
          <select
            value={preferences.emailFrequency}
            onChange={handleFrequencyChange}
            className={styles.select}
          >
            <option value="instant">Instant - Receive emails immediately</option>
            <option value="daily">Daily - Receive digest emails daily</option>
            <option value="weekly">Weekly - Receive digest emails weekly</option>
            <option value="never">Never - Turn off all non-essential emails</option>
          </select>
          <p className={styles.frequencyDescription}>
            This setting applies to marketing and promotional emails. Transactional emails (orders,
            security) will always be sent immediately.
          </p>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.saveBtn}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
        <button
          className={styles.resetBtn}
          onClick={fetchPreferences}
          disabled={loading || saving}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
