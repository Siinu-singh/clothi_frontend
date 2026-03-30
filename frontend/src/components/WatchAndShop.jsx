"use client";
import React, { useRef } from 'react';
import Link from 'next/link';
import styles from './WatchAndShop.module.css';
import { Play, ArrowUpRight } from 'lucide-react';

const MOCK_REELS = [
  { id: 1, views: '12.7K', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=900&fit=crop', title: 'Summer Collection' },
  { id: 2, views: '8.4K', image: 'https://images.unsplash.com/photo-1550614000-4b95d4eddf81?w=600&h=900&fit=crop', title: 'The Indigo Edit' },
  { id: 3, views: '21.2K', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=900&fit=crop', title: 'Transitional Knits' },
  { id: 4, views: '5.1K', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&h=900&fit=crop', title: 'Artisan Crafted' },
  { id: 5, views: '15.9K', image: 'https://images.unsplash.com/photo-1509631179647-0c37cb1100f7?w=600&h=900&fit=crop', title: 'Coastal Vibes' },
];

export default function WatchAndShop() {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>CLOTHI STUDIO</h2>
          <p className={styles.subtitle}>Watch & Shop</p>
        </div>
        <div className={styles.navButtons}>
          <button className={styles.navBtn} onClick={scrollLeft}>&larr;</button>
          <button className={styles.navBtn} onClick={scrollRight}>&rarr;</button>
        </div>
      </div>
      
      <div className={styles.carousel} ref={scrollRef}>
        {MOCK_REELS.map(reel => (
          <div key={reel.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img src={reel.image} alt={reel.title} className={styles.image} />
              <div className={styles.overlay}>
                <div className={styles.views}>
                  <Play fill="currentColor" size={12} /> {reel.views} Views
                </div>
                <Link href={`/catalog?collection=${encodeURIComponent(reel.title)}`} className={styles.shopBtn}>
                  <span>VISIT {reel.title.toUpperCase()}</span>
                  <ArrowUpRight strokeWidth={2.5} size={15} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
