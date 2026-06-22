'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';
import {
  Plus,
  Megaphone,
  AlertTriangle,
  Pencil,
  Trash2,
  X,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import {
  getAdminAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '@/lib/api-announcements';
import styles from './AdminAnnouncements.module.css';

export default function AdminAnnouncementsPage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formText, setFormText] = useState('');
  const [formLink, setFormLink] = useState('');
  const [formOrder, setFormOrder] = useState(0);
  const [formActive, setFormActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminAnnouncements(page, 20);
      if (res.success) {
        setAnnouncements(res.data.announcements);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Failed to load announcements:', err);
      toast?.error?.('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  }, [page, toast]);

  useEffect(() => {
    if (!authLoading && user?.role === 'admin') {
      loadAnnouncements();
    }
  }, [authLoading, user, loadAnnouncements]);

  // ── Auth Guards ────────────────────────────────────
  if (authLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.messageCard}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.unauthorizedContainer}>
        <div className={styles.messageCard}>
          <Megaphone size={40} color="#aaa" />
          <h2 className={styles.title}>Login Required</h2>
          <p className={styles.description}>You must be logged in to access this page.</p>
          <Link href="/login" className={styles.emptyBtn}>Go to Login</Link>
        </div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className={styles.unauthorizedContainer}>
        <div className={styles.messageCard}>
          <AlertTriangle size={40} color="#f59e0b" />
          <h2 className={styles.title}>Access Denied</h2>
          <p className={styles.description}>Your account does not have admin permissions.</p>
        </div>
      </div>
    );
  }

  // ── Handlers ──────────────────────────────────────
  const openCreateModal = () => {
    setEditingId(null);
    setFormText('');
    setFormLink('');
    setFormOrder(announcements.length);
    setFormActive(true);
    setModalOpen(true);
  };

  const openEditModal = (ann) => {
    setEditingId(ann._id);
    setFormText(ann.text);
    setFormLink(ann.link || '');
    setFormOrder(ann.order);
    setFormActive(ann.isActive);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!formText.trim()) {
      toast?.error?.('Announcement text is required');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateAnnouncement(editingId, {
          text: formText.trim(),
          link: formLink.trim() || null,
          order: formOrder,
          isActive: formActive,
        });
        toast?.success?.('Announcement updated');
      } else {
        await createAnnouncement({
          text: formText.trim(),
          link: formLink.trim() || undefined,
          order: formOrder,
          isActive: formActive,
        });
        toast?.success?.('Announcement created');
      }
      closeModal();
      loadAnnouncements();
    } catch (err) {
      toast?.error?.(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await deleteAnnouncement(id);
      toast?.success?.('Announcement deleted');
      loadAnnouncements();
    } catch (err) {
      toast?.error?.('Failed to delete');
    }
  };

  const handleToggleActive = async (ann) => {
    try {
      await updateAnnouncement(ann._id, { isActive: !ann.isActive });
      toast?.success?.(`Announcement ${!ann.isActive ? 'activated' : 'deactivated'}`);
      loadAnnouncements();
    } catch (err) {
      toast?.error?.('Failed to update status');
    }
  };

  // ── Render ────────────────────────────────────────
  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerContent}>
            <div className={styles.headerTitleGroup}>
              <div className={styles.headerIcon}>
                <Megaphone color="#fff" size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h1 className={styles.headerTitle}>Announcements</h1>
                <p className={styles.headerSubtitle}>
                  Manage the top banner offers visible on your website
                </p>
              </div>
            </div>

            <div className={styles.headerActions}>
              <button onClick={openCreateModal} className={styles.newBtn}>
                <Plus size={16} />
                <span>New Announcement</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.tableCard}>
          {loading ? (
            <div className={styles.emptyState}>
              <div className={styles.spinner} />
              <p className={styles.loadingText}>Loading announcements...</p>
            </div>
          ) : announcements.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIconWrapper}>
                <Megaphone className={styles.emptyIcon} size={28} />
              </div>
              <h3 className={styles.emptyTitle}>No announcements yet</h3>
              <p className={styles.emptyDescription}>
                Create your first announcement to display promotional offers at the top of your website.
              </p>
              <button onClick={openCreateModal} className={styles.emptyBtn}>
                <Plus size={16} />
                Create Announcement
              </button>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Text</th>
                  <th>Link</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {announcements.map((ann) => (
                  <tr key={ann._id}>
                    <td>{ann.order}</td>
                    <td>
                      <span className={styles.announcementText}>{ann.text}</span>
                    </td>
                    <td>
                      <span className={styles.announcementLink}>
                        {ann.link || '—'}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          ann.isActive ? styles.statusActive : styles.statusInactive
                        }`}
                      >
                        <span
                          className={`${styles.statusDot} ${
                            ann.isActive ? styles.statusDotActive : styles.statusDotInactive
                          }`}
                        />
                        {ann.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.actionBtn}
                          onClick={() => handleToggleActive(ann)}
                          title={ann.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {ann.isActive ? (
                            <ToggleRight size={16} />
                          ) : (
                            <ToggleLeft size={16} />
                          )}
                        </button>
                        <button
                          className={styles.actionBtn}
                          onClick={() => openEditModal(ann)}
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                          onClick={() => handleDelete(ann._id)}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingId ? 'Edit Announcement' : 'New Announcement'}
              </h2>
              <button className={styles.modalCloseBtn} onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Announcement Text *</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="e.g. Get Flat 10% off On Your First Order"
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  maxLength={300}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Link (optional)</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="e.g. /collections/sale or https://..."
                  value={formLink}
                  onChange={(e) => setFormLink(e.target.value)}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Display Order</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={formOrder}
                    onChange={(e) => setFormOrder(parseInt(e.target.value) || 0)}
                    min={0}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Status</label>
                  <div className={styles.checkboxGroup} style={{ marginTop: '0.5rem' }}>
                    <input
                      type="checkbox"
                      id="announcement-active"
                      className={styles.checkbox}
                      checked={formActive}
                      onChange={(e) => setFormActive(e.target.checked)}
                    />
                    <label htmlFor="announcement-active" className={styles.checkboxLabel}>
                      Active
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={closeModal}>
                Cancel
              </button>
              <button
                className={styles.saveBtn}
                onClick={handleSave}
                disabled={saving || !formText.trim()}
              >
                {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
