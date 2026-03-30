import Link from 'next/link';
import { Volume2, ChevronUp } from 'lucide-react';
import styles from './SocialFeed.module.css';

const socialPosts = [
  {
    id: 1,
    videoImg: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80',
    title: 'Reversible Quilted Jacket - Jewel Tone',
    subtitle: 'Multi Print',
    oldPrice: '$398',
    price: '$319'
  },
  {
    id: 2,
    videoImg: 'https://images.unsplash.com/photo-1550614000-4b95dcb56041?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1550614000-4b95dcb56041?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80',
    title: 'Stretch Terry Indigo 5-Pocket Pant',
    subtitle: 'Belmar Coast Wash',
    price: '$198'
  },
  {
    id: 3,
    videoImg: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80',
    title: 'Sunwashed Crewneck Sweater - Faded',
    subtitle: 'Black',
    oldPrice: '$198',
    price: '$99'
  },
  {
    id: 4,
    videoImg: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3db8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3db8?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80',
    title: 'Coastline Stretch Chino - Stone',
    subtitle: '',
    price: '$178'
  },
  {
    id: 5,
    videoImg: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80',
    title: 'Premium Denim Jacket - Classic',
    subtitle: 'Indigo Wash',
    oldPrice: '$350',
    price: '$249'
  },
  {
    id: 6,
    videoImg: 'https://images.unsplash.com/photo-1609902726285-b751441d6e4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1609902726285-b751441d6e4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80',
    title: 'Casual Cotton Hoodie',
    subtitle: 'Charcoal Grey',
    price: '$129'
  },
  {
    id: 7,
    videoImg: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80',
    title: 'Linen Blend Shirt - Summer',
    subtitle: 'White',
    oldPrice: '$179',
    price: '$129'
  },
  {
    id: 8,
    videoImg: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80',
    title: 'Vintage T-Shirt Collection',
    subtitle: 'Cream Color',
    price: '$89'
  },
  {
    id: 9,
    videoImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80',
    title: 'Organic Linen Pants',
    subtitle: 'Natural Beige',
    oldPrice: '$219',
    price: '$159'
  },
  {
    id: 10,
    videoImg: 'https://images.unsplash.com/photo-1551488831-00cafb341e90?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1551488831-00cafb341e90?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80',
    title: 'Wool Sweater Cardigan',
    subtitle: 'Navy Blue',
    price: '$189'
  },
  {
    id: 11,
    videoImg: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80',
    title: 'Silk Blend Blouse',
    subtitle: 'Emerald Green',
    oldPrice: '$299',
    price: '$199'
  },
  {
    id: 12,
    videoImg: 'https://images.unsplash.com/photo-1552062407-291826ab7b34?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1552062407-291826ab7b34?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80',
    title: 'Premium Joggers',
    subtitle: 'Graphite',
    price: '$149'
  }
];

const SocialFeed = () => {
  return (
    <section className={styles.socialSection}>
      <div className={styles.socialHeader}>
        <div className={styles.waveIconWrapper}>
          <img src="https://fahertybrand.com/cdn/shop/files/Wave.svg?v=1742585774" alt="wave icon" className={styles.waveIcon} />
        </div>
        <div className={styles.socialTitleWrapper}>
          <span className={styles.line} />
          <h2 className={styles.socialTitle}>CATCH US ON SOCIAL</h2>
          <span className={styles.line} />
        </div>
      </div>

      <div className={styles.socialGrid}>
        {socialPosts.map(post => (
          <div key={post.id} className={styles.socialCard}>
            <div className={styles.videoWrapper}>
              <img src={post.videoImg} alt="social post" className={styles.videoImg} />
              <button className={styles.muteBtn} aria-label="Mute">
                <Volume2 size={16} color="white" strokeWidth={2.5} />
              </button>
            </div>
            <Link href="/" className={styles.productLink}>
              <div className={styles.productCard}>
                <div className={styles.thumbWrapper}>
                  <img src={post.thumb} alt={post.title} className={styles.thumbImg} />
                </div>
                <div className={styles.productInfo}>
                  <p className={styles.productTitle}>{post.title}</p>
                  {post.subtitle && <p className={styles.productSub}>{post.subtitle}</p>}
                  <p className={styles.productPrice}>
                    {post.oldPrice && <span className={styles.oldPrice}>{post.oldPrice}</span>}
                    <span className={styles.currentPrice}>{post.price}</span>
                  </p>
                </div>
                <div className={styles.caretWrapper}>
                  <ChevronUp size={20} color="#333" strokeWidth={2.5} />
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SocialFeed;
