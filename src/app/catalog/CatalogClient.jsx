'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, ArrowUpDown, X } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLoginPrompt } from '../../context/LoginPromptContext';
import { useCart } from '../../context/CartContext';
import ProductCard from '../../components/ProductCard/ProductCard';

import styles from './Catalog.module.css';

export default function CatalogClient({ categoryProp = '' }) {
  const searchParams = useSearchParams();
  const initialCategory = categoryProp || searchParams.get('category') || '';
  const customTitle = searchParams.get('title');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSize, setSelectedSize] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  // Mobile filters and sort states
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);

  const { user } = useAuth();
  const { addToFavorites, removeFromFavorites, isFavorited } = useFavorites();
  const { toast } = useToast();
  const { showLoginPrompt } = useLoginPrompt();
  const { addToCart } = useCart();

  useEffect(() => {
    if (categoryProp) {
      setSelectedCategory(categoryProp);
      return;
    }
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('');
    }
  }, [searchParams, categoryProp]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = '/products?limit=20';
      if (selectedCategory) {
        url += `&category=${selectedCategory}`;
      }
      if (sortBy) {
        url += `&sortBy=${sortBy}`;
      }
      const response = await apiFetch(url);
      setProducts(response.data?.products || response.products || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      showLoginPrompt({
        title: 'Sign in to save favorites',
        message: 'Create an account or sign in to save your favorite items.',
      });
      return;
    }

    try {
      if (isFavorited(productId)) {
        await removeFromFavorites(productId);
        toast.success('Removed from favorites');
      } else {
        await addToFavorites(productId);
        toast.success('Added to favorites');
      }
    } catch (err) {
      toast.error('Failed to update favorites');
    }
  };

  const handleAddToCart = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    const success = await addToCart(productId, 1);
    if (success) toast.success('Added to cart');
  };

  const formatPrice = (price) => {
    return `₹${price.toFixed(0)}`;
  };

  const categories = ['', 'POLO', 'OVERSIZE', 'CASUAL', 'DRY-FIT'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  const categoryTitles = {
    'OVERSIZE': 'Zen-G by Clothi',
    'POLO': 'The Crown Series',
    'CASUAL': 'Prime Basics',
    'DRY-FIT': 'Motion X',
    '': 'Our Collection'
  };

  const currentTitle = categoryTitles[selectedCategory] || customTitle || 'Our Collection';

  // Client-side filtering by selected size to ensure it operates correctly
  const filteredProducts = products.filter(p => {
    if (selectedSize) {
      return p.sizes && p.sizes.includes(selectedSize);
    }
    return true;
  });

  // Dispatch custom event to notify Navbar of product count for collections
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('clothi-collection-count', {
        detail: { count: filteredProducts.length }
      });
      window.dispatchEvent(event);
    }
  }, [filteredProducts.length]);

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* Header */}
        <header className={styles.header}>
          <span className={styles.kicker}>Premium Essentials</span>
          <h1 className={styles.title}>{currentTitle}</h1>
        </header>

        {/* Mobile Filter & Sort Bar */}
        <div className={styles.mobileFilterBar}>
          <button onClick={() => setMobileFilterOpen(true)} className={styles.mobileFilterBtn}>
            <Filter size={16} strokeWidth={1.5} />
            <span>FILTER</span>
          </button>
          <div className={styles.divider} />
          <button onClick={() => setMobileSortOpen(true)} className={styles.mobileFilterBtn}>
            <ArrowUpDown size={16} strokeWidth={1.5} />
            <span>SORT BY</span>
          </button>
        </div>

        {/* Layout containing Sidebar & Product Grid */}
        <div className={styles.layout}>

          {/* Product Grid Area */}
          <section className={styles.grid} aria-label="Product listing">
            <div className={styles.gridHeader}>
              <span className={styles.resultCount} aria-live="polite">
                {loading ? 'Loading...' : `Showing ${filteredProducts.length} results`}
              </span>

              {/* Desktop Sort Dropdown */}
              <div className={styles.desktopSortWrap}>
                <select
                  className={styles.sort}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort products"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {error ? (
              <div className={styles.errorMessage} role="alert">{error}</div>
            ) : loading ? (
              <div className={styles.loadingGrid} aria-busy="true" aria-label="Loading products">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={styles.productCardSkeleton}>
                    <div className={styles.skeletonImage}></div>
                    <div className={styles.skeletonText}></div>
                    <div className={styles.skeletonTextSmall}></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className={styles.noProducts} role="status">No products found matching the criteria.</div>
            ) : (
              <div className={styles.productGrid}>
                {filteredProducts.map((p, index) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    isFavorited={isFavorited(p._id)}
                    onAddToCart={(e) => handleAddToCart(e, p._id)}
                    onFavoriteClick={(e) => handleToggleFavorite(e, p._id)}
                    formatPrice={formatPrice}
                    isAboveFold={index < 4}
                  />
                ))}
              </div>
            )}

            {!loading && filteredProducts.length > 0 && (
              <div className={styles.loadMore}>
                <button className={styles.loadMoreBtn}>DISCOVER MORE</button>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* ========== MOBILE FILTER DRAWER ========== */}
      {mobileFilterOpen && (
        <div className={styles.drawerOverlay} onClick={() => setMobileFilterOpen(false)}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <h3>FILTERS</h3>
              <button onClick={() => setMobileFilterOpen(false)} aria-label="Close filters">
                <X size={20} />
              </button>
            </div>
            <div className={styles.drawerBody}>
              {!categoryProp && (
                <div className={styles.drawerGroup}>
                  <h4>Categories</h4>
                  <div className={styles.drawerCategories}>
                    {categories.map(cat => (
                      <button
                        key={cat}
                        className={`${styles.drawerTag} ${selectedCategory === cat ? styles.activeTag : ''}`}
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat || 'ALL'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* Size Filter */}
              <div className={styles.drawerGroup}>
                <h4>Sizes</h4>
                <div className={styles.drawerSizes}>
                  {sizes.map(sz => (
                    <button
                      key={sz}
                      className={`${styles.drawerSizeBtn} ${selectedSize === sz ? styles.activeSizeBtn : ''}`}
                      onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.drawerFooter}>
              <button
                className={styles.drawerClearBtn}
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedSize('');
                  setMobileFilterOpen(false);
                }}
              >
                CLEAR ALL
              </button>
              <button className={styles.drawerApplyBtn} onClick={() => setMobileFilterOpen(false)}>
                APPLY
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== MOBILE SORT DRAWER ========== */}
      {mobileSortOpen && (
        <div className={styles.drawerOverlay} onClick={() => setMobileSortOpen(false)}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <h3>SORT BY</h3>
              <button onClick={() => setMobileSortOpen(false)} aria-label="Close sort select">
                <X size={20} />
              </button>
            </div>
            <div className={styles.drawerBody}>
              <div className={styles.sortOptions}>
                {[
                  { label: 'Newest Arrivals', value: 'newest' },
                  { label: 'Price: Low to High', value: 'price_asc' },
                  { label: 'Price: High to Low', value: 'price_desc' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    className={`${styles.sortOptionRow} ${sortBy === opt.value ? styles.activeOptionRow : ''}`}
                    onClick={() => {
                      setSortBy(opt.value);
                      setMobileSortOpen(false);
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
