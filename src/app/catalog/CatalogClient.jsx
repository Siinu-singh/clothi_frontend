'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Heart } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLoginPrompt } from '../../context/LoginPromptContext';
import { useCart } from '../../context/CartContext';

import styles from './Catalog.module.css';

export default function CatalogClient() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const customTitle = searchParams.get('title');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSize, setSelectedSize] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [hoverImage, setHoverImage] = useState({});

  const { user } = useAuth();
  const { addToFavorites, removeFromFavorites, isFavorited } = useFavorites();
  const { toast } = useToast();
  const { showLoginPrompt } = useLoginPrompt();
  const { addToCart } = useCart();

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('');
    }
  }, [searchParams]);

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

  const handleAddToCart = async (e, p) => {
    e.preventDefault();
    e.stopPropagation();

    const success = await addToCart(p._id, 1, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default');
    if (success) {
      toast.success('Added to cart');
    }
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

  return (
    <div className={styles.page}>


      <div className={styles.inner}>
        {/* Header */}
        <header className={styles.header}>
          <span className={styles.kicker}>Premium Essentials</span>
          <h1 className={styles.title}>{currentTitle}</h1>

          {/* Collection Categories */}
          {/* <div className={styles.collectionCategories}>
            {categories.map((category) => (
              <button
                key={category}
                className={`${styles.collectionCard} ${selectedCategory === category ? styles.active : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category || 'All'}
              </button>
            ))}
          </div> */}
        </header>

        {/* Product Grid - Full Width (no sidebar) */}
        <section className={styles.gridFullWidth} aria-label="Product listing">
          <div className={styles.gridHeader}>
            <span className={styles.resultCount} aria-live="polite">
              {loading ? 'Loading...' : `Showing ${products.length} results`}
            </span>
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
                    <div
                      className={styles.productImage}
                      onMouseEnter={() => setHoverImage({ ...hoverImage, [p._id]: true })}
                      onMouseLeave={() => setHoverImage({ ...hoverImage, [p._id]: false })}
                    >
                      <img
                        src={hoverImage[p._id] && p.images?.[0] ? p.images[0] : p.image}
                        alt={`${p.title} - ${p.category} - ₹${p.price}`}
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

                      <button
                        className={styles.addToCartHoverBtn}
                        onClick={(e) => handleAddToCart(e, p)}
                      >
                        ADD TO CART
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
  );
}
