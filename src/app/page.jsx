'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import styles from './Home.module.css';
import ImageSlider from '../components/ImageSlider/ImageSlider';
import ProductCard from '../components/ProductCard/ProductCard';
import { apiFetch } from '../lib/api';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useToast } from '../context/ToastContext';

// ── Lazy-loaded below-the-fold sections ─────────────────────────
const WatchAndShop = dynamic(
  () => import('../components/WatchAndShop/WatchAndShop'),
  { loading: () => <div className={styles.sectionSkeleton} aria-hidden="true" /> }
);

const MatchTheMood = dynamic(
  () => import('../components/MatchTheMood/MatchTheMood'),
  { loading: () => <div className={styles.sectionSkeleton} aria-hidden="true" /> }
);

const ShopByOccasion = dynamic(
  () => import('../components/ShopByOccasion/ShopByOccasion'),
  { loading: () => <div className={styles.sectionSkeleton} aria-hidden="true" /> }
);

const SoulOfClothi = dynamic(
  () => import('../components/SoulOfClothi/SoulOfClothi'),
  { loading: () => <div className={styles.sectionSkeleton} aria-hidden="true" /> }
);

const SocialFeed = dynamic(
  () => import('../components/SocialFeed/SocialFeed'),
  { loading: () => <div className={styles.sectionSkeleton} aria-hidden="true" /> }
);

// ── Categories ──────────────────────────────────────────────────
const categories = [
  { label: 'ALL', value: 'all', backendValue: '' },
  { label: 'POLO', value: 'polo', backendValue: 'POLO' },
  { label: 'OVERSIZE', value: 'oversize', backendValue: 'OVERSIZE' },
  { label: 'DRY-FIT', value: 'dry-fit', backendValue: 'DRY-FIT' },
  { label: 'CASUAL', value: 'casual', backendValue: 'CASUAL' },
];

// ── Slider images ───────────────────────────────────────────────
const sliderImages = [
  'https://res.cloudinary.com/dsrht8rss/image/upload/v1776509044/WEBSITE_BANNERS_gvcuq6.png',
  'https://res.cloudinary.com/dsrht8rss/image/upload/v1776182265/5_qexced.png',
  'https://res.cloudinary.com/dsrht8rss/image/upload/v1776508755/DRYFIT_image_iy9bke.png',
  'https://res.cloudinary.com/dsrht8rss/image/upload/v1776508907/Zen-G_by_clothi_1_tkltka.png',
];

export default function Home() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState(10);
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorited } = useFavorites();
  const { toast } = useToast();

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        if (visibleCount === 10) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        const categoryObj = categories.find(c => c.value === activeCategory);
        const categoryParam = categoryObj && categoryObj.backendValue ? `&category=${categoryObj.backendValue}` : '';
        const fetchLimit = visibleCount + 10;
        const response = await apiFetch(`/products?limit=${fetchLimit}&sortBy=newest${categoryParam}`);
        setNewArrivals(response.data?.products || response.products || []);
      } catch (error) {
        console.error('Failed to fetch new arrivals:', error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchNewArrivals();
  }, [activeCategory, visibleCount]);

  // Memoized visible products slice
  const visibleProducts = useMemo(
    () => newArrivals.slice(0, visibleCount),
    [newArrivals, visibleCount]
  );

  // Stable callback refs to prevent ProductCard re-renders
  const handleCategoryClick = useCallback((categoryVal) => {
    setActiveCategory(categoryVal);
    setVisibleCount(10);
  }, []);

  const formatPrice = useCallback((price) => {
    if (typeof price === 'number') {
      return `₹${price.toFixed(0)}`;
    }
    return price;
  }, []);

  const handleAddToCart = useCallback(async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(productId, 1);
  }, [addToCart]);

  const handleFavoriteClick = useCallback(async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (isFavorited(productId)) {
        const removed = await removeFromFavorites(productId);
        if (removed !== false) {
          toast.success('Removed from favorites');
        }
      } else {
        const added = await addToFavorites(productId);
        if (added !== false) {
          toast.success('Added to favorites');
        }
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  }, [isFavorited, removeFromFavorites, addToFavorites, toast]);

  return (
    <>
      {/* ========== HERO ========== */}
      <ImageSlider images={sliderImages} />

      <WatchAndShop />

      {/* ========== SHOP BY ========== */}
      <section className={styles.arrivalsSection} aria-label="Shop by category">
        <div className={styles.arrivalsInner}>
          <h2 className={styles.sectionLabel}>SHOP BY</h2>
          <div className={styles.tabRow} role="tablist" aria-label="Product categories">
            <div className={styles.tabs}>
              {categories.map(cat => (
                <button
                  key={cat.value}
                  role="tab"
                  aria-selected={activeCategory === cat.value}
                  className={activeCategory === cat.value ? styles.tabActive : styles.tab}
                  onClick={() => handleCategoryClick(cat.value)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.productGrid} role="tabpanel" aria-label="Products">
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className={styles.productCardSkeleton} aria-hidden="true">
                  <div className={styles.skeletonImage} />
                  <div className={styles.skeletonText} />
                  <div className={styles.skeletonTextSmall} />
                </div>
              ))
            ) : visibleProducts.length === 0 ? (
              <p className={styles.noProducts} role="status">No products found</p>
            ) : (
              visibleProducts.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isFavorited={isFavorited(product._id)}
                  onAddToCart={handleAddToCart}
                  onFavoriteClick={handleFavoriteClick}
                  formatPrice={formatPrice}
                  isAboveFold={index < 5}
                />
              ))
            )}
          </div>
          {!loading && newArrivals.length > visibleCount && (
            <div className={styles.loadMoreContainer}>
              <button
                onClick={() => setVisibleCount(prev => prev + 10)}
                className={styles.loadMoreBtn}
                disabled={loadingMore}
                aria-label="Load more products"
              >
                {loadingMore ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      </section>

      <MatchTheMood />
      <ShopByOccasion />
      <SoulOfClothi />
      <SocialFeed />
    </>
  );
}
