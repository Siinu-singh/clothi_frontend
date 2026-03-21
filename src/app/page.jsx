'use client';
import Link from 'next/link';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import SocialFeed from '../components/SocialFeed';
import styles from './Home.module.css';

const newArrivals = [
  { id: 1, name: 'Coastal Slub Tee', color: 'Washed Sand', price: '$68', badge: 'NEW', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  { id: 2, name: 'Sienna Basin Tee', color: 'Terracotta', price: '$72', badge: 'NEW', img: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  { id: 3, name: 'Cove Pocket Tee', color: 'Forest Floor', price: '$65', badge: 'NEW', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  { id: 4, name: 'Tidal Wash Tee', color: 'Pacific Mist', price: '$88', badge: 'NEW', img: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  { id: 5, name: 'Ocean Breeze Shirt', color: 'Seafoam', price: '$95', badge: 'NEW', img: 'https://images.unsplash.com/photo-1609902726285-b751441d6e4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  { id: 6, name: 'Summer Linen Blend', color: 'White', price: '$78', badge: 'NEW', img: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3db8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  { id: 7, name: 'Desert Rose Dress', color: 'Blush', price: '$125', badge: 'NEW', img: 'https://images.unsplash.com/photo-1551488831-00cafb341e90?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  { id: 8, name: 'Island Vibes Shirt', color: 'Tropical', price: '$82', badge: 'NEW', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  { id: 9, name: 'Sunset Joggers', color: 'Charcoal', price: '$89', img: 'https://images.unsplash.com/photo-1552062407-291826ab7b34?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  { id: 10, name: 'Mountain Peak Hoodie', color: 'Navy', price: '$110', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  { id: 11, name: 'Urban Cargo Pants', color: 'Olive', price: '$105', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  { id: 12, name: 'Classic Denim Jacket', color: 'Indigo', price: '$145', img: 'https://images.unsplash.com/photo-1550614000-4b95dcb56041?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
];

export default function Home() {
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

      {/* ========== NEW ARRIVALS ========== */}
      <section className={styles.arrivalsSection}>
        <div className={styles.arrivalsInner}>
          <div className="section-label" style={{ marginBottom: '2.5rem' }}>NEW ARRIVALS</div>
          <div className={styles.tabRow}>
            <div className={styles.tabs}>
              <button className={styles.tabActive}>Men&apos;s</button>
              <button className={styles.tab}>Women&apos;s</button>
            </div>
            <div className={styles.carouselNav}>
              <button className={styles.carouselBtn}><ChevronLeft size={18} /></button>
              <button className={styles.carouselBtn}><ChevronRight size={18} /></button>
            </div>
          </div>
          <div className={styles.productGrid}>
            {newArrivals.map(p => (
              <Link href={`/product/${p.id}`} key={p.id} className={styles.productCard}>
                <div className={styles.productImage}>
                  <img src={p.img} alt={p.name} />
                  <button className={styles.wishlistBtn} onClick={e => e.preventDefault()}>
                    <Heart size={16} strokeWidth={1.5} />
                  </button>
                </div>
                <div className={styles.colorDots}>
                  <span className={styles.dot} style={{ background: '#e0d5c8' }} />
                  <span className={styles.dot} style={{ background: '#5a6a5c' }} />
                  <span className={styles.dot} style={{ background: '#ba5b3f' }} />
                </div>
                {p.badge && <span className={styles.badge}>{p.badge}</span>}
                <h3 className={styles.productName}>{p.name}</h3>
                <p className={styles.productPrice}>{p.price}</p>
              </Link>
            ))}
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

      <SocialFeed />
    </>
  );
}
