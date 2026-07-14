'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './ShopByOccasion.module.css';

export default function ShopByOccasion() {
  const occasions = [
    {
      id: 1,
      title: 'SUN DRIP',
      image: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1783179480/Sundrip_rwvf9z.png',
    },
    {
      id: 2,
      title: 'ROAD RUN',
      image: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1776531280/Road_Run_bdr38a.jpg',
    },
    {
      id: 3,
      title: 'AFTER DARK',
      image: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1776531279/After_Dark_tjmz2y.jpg',
    },
    {
      id: 4,
      title: 'LOW KEY',
      image: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1776531278/Low_Key_dgytji.jpg',
    },
    {
      id: 5,
      title: 'STREET EASE',
      image: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1776531281/Street_Ease_uwv8ia.jpg',
    },
    {
      id: 6,
      title: 'SHARP FORM',
      image: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1776531280/Sharp_Form_zgylvm.jpg',
    },
    {
      id: 7,
      title: 'NIGHT ESCAPE',
      image: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1776531279/Night_Escape_bqk3lk.jpg',
    }
  ];

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>SHOP BY OCCASIONS</h2>
      <div className={styles.grid}>
        {occasions.map((occasion) => (
          <Link
            key={occasion.id}
            href="/catalog"
            className={styles.card}
            title={`Shop ${occasion.title}`}
          >
            <div className={styles.imageWrapper}>
              <Image
                src={occasion.image}
                alt={occasion.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 14vw"
                style={{ objectFit: 'cover' }}
                quality={80}
              />
            </div>
            <div className={styles.gradientOverlay}></div>
            <div className={styles.cardLabel}>{occasion.title}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
