'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from './LifeBeforeSoldOut.module.css';

export default function LifeBeforeSoldOut() {
  const banners = [
    {
      id: 'gen-z-drop',
      title: 'GEN Z DROP',
      subtitle: 'Oversized fits, bold vibes',
      image: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1783252192/ChatGPT_Image_Jul_5_2026_12_07_33_AM_oolkvr.png',
      link: '/catalog?category=OVERSIZE',
    },
    {
      id: 'millennial-edit',
      title: 'Millennial Edit',
      subtitle: 'Nostalgic influences',
      image: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1783252192/ChatGPT_Image_Jul_5_2026_12_15_05_AM_zbccyq.png',
      link: '/catalog?category=CASUAL',
    },
    {
      id: 'linen-shirts',
      title: 'Linen Shirts',
      subtitle: 'Lightweight fabrics, breezy fits',
      image: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1783252193/ChatGPT_Image_Jul_5_2026_12_25_56_AM_mbwo1i.png',
      link: '/catalog?category=POLO',
    },
  ];

  return (
    <section className={styles.section} aria-label="Life Before Sold Out">
      <div className={styles.container}>
        <h2 className={styles.title}>LIFE BEFORE SOLD OUT!</h2>
        <div className={styles.grid}>
          {banners.map((banner) => (
            <Link href={banner.link} key={banner.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image
                  src={banner.image}
                  alt={`${banner.title} - ${banner.subtitle}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                  priority
                  className={styles.image}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
