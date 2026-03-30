import React from 'react';
import styles from './SoulOfClothi.module.css';
import Link from 'next/link';

export default function SoulOfClothi() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.imageWrapper}>
             <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&fit=crop" alt="Artisan Tailoring" className={styles.image} />
          </div>
        </div>
        <div className={styles.right}>
          <p className={styles.kicker}>OUR PHILOSOPHY</p>
          <h2 className={styles.title}>The Soul of Clothi</h2>
          <p className={styles.tagline}>MADE WITH LOVE &amp; CARE</p>
          <p className={styles.description}>
            Every piece we create is a celebration of timeless craftsmanship. From the initial 
            sketch to the final stitch, our artisans pour their heart into ensuring impeccable 
            quality. We blend modern silhouettes with traditional techniques to bring you 
            clothing that feels as good as it looks. Experience the elegance of mindful fashion.
          </p>
          <Link href="/about" className={styles.button}>
            READ THE STORY
          </Link>
          
          <div className={styles.watermark}>EST. 2024</div>
        </div>
      </div>
    </section>
  );
}
