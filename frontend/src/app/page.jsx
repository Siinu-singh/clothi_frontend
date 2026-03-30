'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import SocialFeed from '../components/SocialFeed';
import { apiFetch } from '../lib/api';
import styles from './Home.module.css';

import WatchAndShop from '../components/WatchAndShop';
import SoulOfClothi from '../components/SoulOfClothi';
import StoriesInMotion from '../components/StoriesInMotion';

export default function Home() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        const response = await apiFetch('/products?limit=14&sortBy=newest');
        setNewArrivals(response.data?.products || response.products || []);
      } catch (error) {
        console.error('Failed to fetch new arrivals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  // Format price for display
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `$${price.toFixed(0)}`;
    }
    return price;
  };

  return (
    <>
      {/* ========== HERO ========== */}
      <section className={styles.hero}>
        <img src="/hero_coastal.png" alt="Coastal lifestyle" className={styles.heroBg} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Spring <em>in</em> the Coast
          </h1>
          <div className={styles.heroActions}>
            <Link href="/catalog"><button className={styles.heroBtn}>MEN&apos;S NEW ARRIVALS</button></Link>
            <Link href="/catalog"><button className={styles.heroBtn}>WOMEN&apos;S NEW ARRIVALS</button></Link>
          </div>
        </div>
      </section>

      <WatchAndShop />

      {/* ========== NEW ARRIVALS ========== */}
      <section className={styles.arrivalsSection}>
        <div className={styles.arrivalsInner}>
          <div className="section-label" style={{ marginBottom: '2.5rem' }}>NEW ARRIVALS</div>
          <div className={styles.tabRow}>
            <div className={styles.tabs}>
              <button className={styles.tabActive}>All</button>
              <button className={styles.tab}>Men&apos;s</button>
              <button className={styles.tab}>Women&apos;s</button>
            </div>
            <div className={styles.carouselNav}>
              <button className={styles.carouselBtn}><ChevronLeft size={18} /></button>
              <button className={styles.carouselBtn}><ChevronRight size={18} /></button>
            </div>
          </div>
          <div className={styles.productGrid}>
            {loading ? (
              // Loading skeleton
              Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className={styles.productCardSkeleton}>
                  <div className={styles.skeletonImage} />
                  <div className={styles.skeletonText} />
                  <div className={styles.skeletonTextSmall} />
                </div>
              ))
            ) : newArrivals.length === 0 ? (
              <p className={styles.noProducts}>No products found</p>
            ) : (
              newArrivals.map(product => (
                <Link href={`/product/${product._id}`} key={product._id} className={styles.productCard}>
                  <div className={styles.productImage}>
                    <img src={product.image} alt={product.title} />
                    <button className={styles.wishlistBtn} onClick={e => e.preventDefault()}>
                      <Heart size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                  <div className={styles.colorDots}>
                    {product.colors?.slice(0, 3).map((color, idx) => (
                      <span key={idx} className={styles.dot} style={{ background: color.hex || color }} />
                    ))}
                  </div>
                  {product.badge && <span className={styles.badge}>{product.badge}</span>}
                  <h3 className={styles.productName}>{product.title}</h3>
                  <p className={styles.productPrice}>{formatPrice(product.price)}</p>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ========== SPLIT COLLECTION BANNER ========== */}
      <section className={styles.splitSection}>
        <Link href="/catalog" className={styles.splitHalf}>
          <img src="/split_lifestyle.png" alt="Men's Collection" style={{ objectPosition: 'left center' }} />
          <div className={styles.splitOverlay} />
          <div className={styles.splitContent}>
            <button className={styles.heroBtn}>MEN&apos;S COLLECTION</button>
          </div>
        </Link>
        <Link href="/catalog" className={styles.splitHalf}>
          <img src="/split_lifestyle.png" alt="Women's Collection" style={{ objectPosition: 'right center' }} />
          <div className={styles.splitOverlay} />
          <div className={styles.splitContent}>
            <button className={styles.heroBtn}>WOMEN&apos;S COLLECTION</button>
          </div>
        </Link>
      </section>

      {/* ========== LIFESTYLE DUO ========== */}
      <section className={styles.lifestyleDuo}>
        <div className={styles.lifestyleDuoInner}>
          <Link href="/catalog" className={styles.lifestyleDuoCard}>
            <img src="/collection_duo.png" alt="Men's Indigo" style={{ objectPosition: 'left center' }} />
            <div className={styles.splitOverlay} />
            <div className={styles.lifestyleDuoLabel}>
              <span className={styles.lifestyleDuoKicker}>MEN&apos;S EDIT</span>
              <h3 className={styles.lifestyleDuoTitle}>The Indigo Collection</h3>
            </div>
          </Link>
          <Link href="/catalog" className={styles.lifestyleDuoCard}>
            <img src="/collection_duo.png" alt="Women's Transitional" style={{ objectPosition: 'right center' }} />
            <div className={styles.splitOverlay} />
            <div className={styles.lifestyleDuoLabel}>
              <span className={styles.lifestyleDuoKicker}>WOMEN&apos;S EDIT</span>
              <h3 className={styles.lifestyleDuoTitle}>Transitional Knits</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* ========== DESIGN STUDIO BANNER ========== */}
      <section className={styles.studioBanner}>
        <img src="/hero_coastal.png" alt="The Design Studio" className={styles.studioBg} />
        <div className={styles.studioOverlay} />
        <div className={styles.studioContent}>
          <h2 className={styles.studioTitle}>THE DESIGN STUDIO</h2>
          <Link href="/catalog" className={styles.studioLink}>LEARN MORE</Link>
        </div>
      </section>

      {/* ========== BRAND VALUES ========== */}
      <section className={styles.valuesSection}>
        <div className={styles.valuesInner}>
          <div className={styles.valueCard}>
            <div className={styles.valueImg}>
              <img src="/brand_values.png" alt="Find a Store" style={{ objectPosition: 'left top' }} />
            </div>
            <h4 className={styles.valueTitle}>Come see us</h4>
            <Link href="/catalog" className={styles.valueLink}>FIND A STORE</Link>
          </div>
          <div className={styles.valueCard}>
            <div className={styles.valueImg}>
              <img src="/brand_values.png" alt="Sustainability" style={{ objectPosition: 'right top' }} />
            </div>
            <h4 className={styles.valueTitle}>Our Commitment</h4>
            <Link href="/" className={styles.valueLink}>SUSTAINABILITY</Link>
          </div>
          <div className={styles.valueCard}>
            <div className={styles.valueImg}>
              <img src="/brand_values.png" alt="Artisan Design" style={{ objectPosition: 'right bottom' }} />
            </div>
            <h4 className={styles.valueTitle}>Artisan Partners</h4>
            <Link href="/" className={styles.valueLink}>LEARN MORE</Link>
          </div>
        </div>
      </section>

      <SoulOfClothi />
      <StoriesInMotion />

      <SocialFeed />
    </>
  );
}
