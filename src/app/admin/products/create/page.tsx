'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';
import { ArrowLeft, Package, Save } from 'lucide-react';
import styles from '../AdminProductForm.module.css';
import { sanitizeString } from '@/lib/sanitize';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
async function apiFetch(endpoint: string, options: any = {}) {
  const headers: any = {};
  if (options.body) headers['Content-Type'] = 'application/json';
  if (options.headers) { Object.assign(headers, options.headers); }
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  // Use NEXT_PUBLIC_API_URL from environment, validate it's a trusted domain
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  if (!apiUrl.startsWith('http://localhost') && !apiUrl.startsWith('https://')) {
    throw new Error('Invalid API URL configuration');
  }
  const response = await fetch(`${apiUrl}/api${endpoint}`, { ...options, headers });
  
  if (!response.ok) {
    let errorMsg = `HTTP error! status: ${response.status}`;
    try {
      const errData = await response.json();
      if (errData.details && Array.isArray(errData.details)) {
        errorMsg = errData.details.map((d: any) => `${d.path.join('.')}: ${d.message}`).join(', ');
      } else {
        errorMsg = errData.message || errData.error || errorMsg;
      }
    } catch (e) {
      // Ignore JSON parse error on error responses
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

const CATEGORIES = ['POLO', 'OVERSIZE', 'CASUAL', 'DRY-FIT'];
const BADGES = ['bestseller', 'new', 'premium'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38'];

export default function CreateProductPage() {
  const router = useRouter();
  const { user } = useAuth() as any;
  const { toast } = useToast() as any;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    oldPrice: '',
    image: '',
    images: '',
    category: 'Men',
    badge: '',
    colors: '',
    sizes: '',
    materials: '',
    sizeGuide: '',
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    if (!form.title || !form.price || !form.category) {
      toast.error('Please fill required fields');
      return;
    }

    const productData = {
      title: sanitizeString(form.title),
      description: sanitizeString(form.description),
      price: parseFloat(form.price),
      ...(form.oldPrice && { oldPrice: parseFloat(form.oldPrice) }),
      image: form.image,
      ...(form.images && { images: form.images.split(',').map(s => s.trim()).filter(Boolean) }),
      category: form.category,
      ...(form.badge && { badge: form.badge }),
      colors: form.colors ? form.colors.split(',').map(s => sanitizeString(s.trim())).filter(Boolean) : [],
      sizes: form.sizes ? form.sizes.split(',').map(s => s.trim()).filter(Boolean) : SIZES,
      ...(form.materials && { materials: sanitizeString(form.materials) }),
      ...(form.sizeGuide && { sizeGuide: sanitizeString(form.sizeGuide) }),
    };

    try {
      setLoading(true);
      await apiFetch('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
      toast.success('Product created successfully!');
      router.push('/admin/products');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className={styles.unauthorizedContainer}>
        <div className={styles.messageCard}>
          <p className={styles.label}>Access denied</p>
          <Link href="/login" style={{ color: 'var(--color-primary)' }}>Go to login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerContent}>
            <Link href="/admin/products" className={styles.backBtn}>
              <ArrowLeft size={20} />
            </Link>
            <div className={styles.headerIcon}>
              <Package color="var(--color-white)" size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h1 className={styles.headerTitle}>Add Product</h1>
              <p className={styles.headerSubtitle}>Create a new product</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Basic Info */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Basic Information</h2>
            <div className={styles.grid}>
              <div className={styles.colSpan2}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="Product name"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className={styles.colSpan2}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className={styles.textarea}
                    placeholder="Product description"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Price *</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  placeholder="999"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Old Price (optional)</label>
                <input
                  type="number"
                  name="oldPrice"
                  value={form.oldPrice}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="1299"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Category *</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={styles.select}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Badge</label>
                <select
                  name="badge"
                  value={form.badge}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="">None</option>
                  {BADGES.map(badge => (
                    <option key={badge} value={badge}>{badge}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Images</h2>
            <div className={styles.grid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Main Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="https://example.com/image.jpg"
                />
                {form.image && (
                  <img src={form.image} alt="Preview" className={styles.imagePreview} />
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Additional Images (comma separated URLs)</label>
                <textarea
                  name="images"
                  value={form.images}
                  onChange={handleChange}
                  className={styles.textarea}
                  placeholder="url1, url2, url3"
                />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Product Details</h2>
            <div className={styles.grid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Colors (comma separated)</label>
                <input
                  type="text"
                  name="colors"
                  value={form.colors}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Red, Blue, Green"
                  autoComplete="off"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Sizes (comma separated)</label>
                <input
                  type="text"
                  name="sizes"
                  value={form.sizes}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="S, M, L, XL"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Materials</label>
                <input
                  type="text"
                  name="materials"
                  value={form.materials}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="100% Cotton"
                  autoComplete="off"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Size Guide</label>
                <input
                  type="text"
                  name="sizeGuide"
                  value={form.sizeGuide}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="True to size"
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <Link href="/admin/products" className={styles.cancelBtn}>
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className={styles.saveBtn}
            >
              {loading ? 'Saving...' : (
                <>
                  <Save size={18} />
                  Save Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
