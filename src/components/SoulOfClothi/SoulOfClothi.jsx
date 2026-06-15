import React from 'react';
import styles from './SoulOfClothi.module.css';
import Link from 'next/link';

export default function SoulOfClothi() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.imageWrapper}>
            <img src="https://res.cloudinary.com/dsrht8rss/image/upload/v1781448258/pomelli_photoshoot_image_4_5_0614_3_fmabsj.png" alt="Sour Of Clothi" className={styles.image} />
          </div>
        </div>
        <div className={styles.right}>
          <p className={styles.kicker}>OUR PHILOSOPHY</p>
          <h2 className={styles.title}>The Soul of Clothi</h2>
          <p className={styles.tagline}>MADE WITH LOVE &amp; CARE</p>
          <p className={styles.description}>
            Every piece at Clothi is designed with intention.<br />
            Not just to be worn, but to be understood.<br /><br />

            We believe style is not about following trends,<br />
            but about knowing what works — for you, for your moment, for your identity.<br /><br />

            That’s why we focus on clean silhouettes, intelligent design, and effortless versatility.<br />
            Clothing that moves with you — from work to weekends, from quiet moments to bold ones.<br /><br />

            Clothi is where simplicity meets awareness.<br />
            Because real style isn’t loud — it’s confident, calm, and considered.
          </p>
          <Link href="/about" className={styles.button}>
            READ THE STORY
          </Link>
        </div>
      </div>
    </section>
  );
}
