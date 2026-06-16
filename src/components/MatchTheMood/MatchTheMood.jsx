'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from './MatchTheMood.module.css';

export default function MatchTheMood() {
  const moods = [
    {
      id: '3d606b95-c37b-42e4-9f43-f3ace9a1b4d0',
      image: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1776526229/Oversize_Match_the_Mood_smn3lh.jpg',
      link: '/catalog',
      title: 'Off-Duty',
      // subtitle: 'PICKS',
    },
    {
      id: 'ec434243-e6ca-4ccd-85b1-e86576394896',
      image: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1776526229/Polo_Match_the_Mood_xdczc5.jpg',
      link: '/catalog',
      title: 'PRIME FORM',
      // subtitle: 'PICS',
    },
    {
      id: '0dfa8703-2d45-40c5-b846-0d296a6d165f',
      image: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1776526229/Casual_Match_the_Mood_h1birh.jpg',
      link: '/catalog',
      title: 'OPEN AIR',
      // subtitle: 'DRIP',
    },
    {
      id: '85c52675-d3ab-4a07-822e-127ab173e314',
      image: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1776526229/Dryfit_Match_the_Mood_j6g75p.jpg',
      link: '/catalog',
      title: 'ACTIVE CORE',
      // subtitle: 'REFINED',
    },
    // {
    //   id: 'a7853194-36c9-47fa-a4f2-6699f538f742',
    //   image: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1776182265/5_qexced.png',
    //   link: '/catalog',
    //   title: 'BASICS',
    //   subtitle: 'DAILY',
    // }
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Match the Mood</h2>

      <div className={styles.flexWrapper}>
        {moods.map((mood) => (
          <Link href={mood.link} key={mood.id} className={styles.cardContainer}>
            <div className={styles.cardInner}>
              <Image
                src={mood.image}
                alt={mood.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                style={{ objectFit: 'cover' }}
                quality={80}
                className={`${styles.image} ${mood.id === '85c52675-d3ab-4a07-822e-127ab173e314' ? styles.imageLuxury : ''}`}
              />
              <div className={styles.labelOverlay}>
                <span className={styles.labelTextTop}>{mood.title}</span>
                <span className={styles.labelTextBottom}>{mood.subtitle}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
