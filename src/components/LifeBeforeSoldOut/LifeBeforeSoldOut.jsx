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
      image: 'https://powerlook.in/cdn/shop/files/900x379--1.jpg?v=1780999408&width=1200',
      link: '/catalog?category=OVERSIZE',
    },
    {
      id: 'millennial-edit',
      title: 'Millennial Edit',
      subtitle: 'Nostalgic influences',
      image: 'https://powerlook.in/cdn/shop/files/900x379--2_1.jpg?v=1781073715&width=1200',
      link: '/catalog?category=CASUAL',
    },
    {
      id: 'linen-shirts',
      title: 'Linen Shirts',
      subtitle: 'Lightweight fabrics, breezy fits',
      image: 'https://powerlook.in/cdn/shop/files/900x379-_2.jpg?v=1780999407&width=1200',
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
