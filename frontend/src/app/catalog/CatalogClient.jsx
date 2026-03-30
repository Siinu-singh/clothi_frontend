'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLoginPrompt } from '../../context/LoginPromptContext';
import styles from './Catalog.module.css';

export default function CatalogClient() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  const { user } = useAuth();
  const { addToFavorites, removeFromFavorites, isFavorited } = useFavorites();
  const { toast } = useToast();
  const { showLoginPrompt } = useLoginPrompt();

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

  const formatPrice = (price) => {
    return `$${price.toFixed(0)}`;
  };

  const categories = ['', 'Men', 'Women', 'Accessories', 'Footwear'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* Header */}
        <header className={styles.header}>
          <span className={styles.kicker}>Premium Essentials</span>
          <h1 className={styles.title}>Our Collection</h1>
          <p className={styles.subtitle}>A collection inspired by coastal winds and the tactile warmth of the Mediterranean sun.</p>
        </header>

        <div className={styles.layout}>
          {/* Filter Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.filterCard}>
              <h2 className={styles.filterTitle}>Filters</h2>
              
              <div className={styles.filterGroup}>
                <h3 className={styles.filterLabel}>Category</h3>
                <div className={styles.categoryList}>
                  {categories.map(cat => (
                    <button 
                      key={cat || 'all'} 
                      className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.categoryBtnActive : ''}`}
                      onClick={() => setSelectedCategory(cat)}
                      aria-pressed={selectedCategory === cat}
                    >
                      {cat || 'All'}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.filterGroup}>
                <h3 className={styles.filterLabel}>Size</h3>
                <div className={styles.sizeGrid}>
                  {sizes.map(s => (
                    <button 
                      key={s} 
                      className={`${styles.sizeBtn} ${selectedSize === s ? styles.sizeBtnActive : ''}`}
                      onClick={() => setSelectedSize(selectedSize === s ? '' : s)}
                      aria-pressed={selectedSize === s}
                      aria-label={`Filter by size ${s}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                className={styles.clearBtn}
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedSize('');
                }}
              >
                CLEAR ALL
              </button>
            </div>
          </aside>

          {/* Product Grid */}
          <section className={styles.grid} aria-label="Product listing">
            <div className={styles.gridHeader}>
              <span className={styles.resultCount} aria-live="polite">
                {loading ? 'Loading...' : `Showing ${products.length} results`}
              </span>
              <select 
                className={styles.sort}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort products"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price">Price: Low to High</option>
                <option value="popular">Popular</option>
              </select>
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
            ) : (
              <div className={styles.productGrid}>
                {products.map(p => (
                  <Link href={`/product/${p._id}`} key={p._id} className={styles.productCard}>
                    <article>
                      <div className={styles.productImage}>
                        <img 
                          src={p.image} 
                          alt={`${p.title} - ${p.category} - $${p.price}`}
                          loading="lazy"
                          width={400}
                          height={500}
                        />
                        {p.badge && <span className={styles.badge}>{p.badge}</span>}
                        <button 
                          className={`${styles.wishlistBtn} ${isFavorited(p._id) ? styles.wishlistBtnActive : ''}`}
                          onClick={(e) => handleToggleFavorite(e, p._id)}
                          aria-label={isFavorited(p._id) ? `Remove ${p.title} from favorites` : `Add ${p.title} to favorites`}
                          aria-pressed={isFavorited(p._id)}
                        >
                          <Heart 
                            size={16} 
                            strokeWidth={1.5} 
                            fill={isFavorited(p._id) ? 'currentColor' : 'none'}
                          />
                        </button>
                      </div>
                      <div className={styles.productInfo}>
                        <div>
                          <h3 className={styles.productName}>{p.title}</h3>
                          <p className={styles.productColor}>{p.colors?.[0] || p.category}</p>
                        </div>
                        <div className={styles.priceWrap}>
                          <p className={styles.productPrice}>{formatPrice(p.price)}</p>
                          {p.oldPrice && (
                            <p className={styles.oldPrice}><del>{formatPrice(p.oldPrice)}</del></p>
                          )}
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}

            {!loading && products.length > 0 && (
              <div className={styles.loadMore}>
                <button className={styles.loadMoreBtn}>DISCOVER MORE</button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
