"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './WatchAndShop.module.css';
import { Play, ArrowUpRight } from 'lucide-react';

const MOCK_REELS = [
  { id: 1, views: '12.7K', image: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1776511418/Zen_G_clothi_studio_nznlvh.jpg', title: 'Zen-G by Clothi', category: 'OVERSIZE' },
  { id: 2, views: '8.4K', image: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1776511418/Polo_Clothi_Studio_j8t7me.jpg', title: 'The Crown Series', category: 'POLO' },
  { id: 3, views: '21.2K', image: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1776511417/Prime_Basics_clothi_studio_al7nwt.jpg', title: 'Prime Basics', category: 'CASUAL' },
  { id: 4, views: '5.1K', image: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1776511418/Dryfit_clothi_studio_srnrfx.jpg', title: 'Motion X', category: 'DRY-FIT' },
];

export default function WatchAndShop() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>CLOTHI STUDIO</h2>
          <p className={styles.subtitle}>Watch & Shop</p>
        </div>
      </div>

      <div className={styles.carousel}>
        {MOCK_REELS.map(reel => (
          <div key={reel.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <Image
                src={reel.image}
                alt={reel.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                style={{ objectFit: 'cover' }}
                quality={80}
              />
              <div className={styles.overlay}>
                <div className={styles.views}>
                  <Play fill="currentColor" size={12} /> {reel.views} Views
                </div>
                <Link href={`/catalog?category=${reel.category}&title=${encodeURIComponent(reel.title)}`} className={styles.shopBtn}>
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
