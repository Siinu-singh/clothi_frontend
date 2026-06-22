'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './ImageSlider.module.css';

export default function ImageSlider({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoPlayRef = useRef(null);

  const slides = images.length > 0 ? images : [
    {
      url: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1775568636/4_koks8s.jpg',
      link: '/catalog',
    },
    {
      url: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1776182265/5_qexced.png',
      link: '/catalog?category=POLO',
    },
    {
      url: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1775568636/1_gnlpyw.jpg',
      link: '/catalog?category=DRY-FIT',
    },
    {
      url: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1776182265/5_qexced.png',
      link: '/catalog?category=OVERSIZE',
    },
  ];

  // Auto-play effect
  useEffect(() => {
    if (slides.length === 0) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slides.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(autoPlayRef.current);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index % slides.length);
  };

  return (
    <div className={styles.sliderContainer}>
      {/* Slides */}
      <div className={styles.slidesWrapper}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
          >
            <Link href={slide.link || '#'} className={styles.slideLink}>
              <Image
                src={slide.url}
                alt={`Slide ${index + 1}`}
                fill
                sizes="100vw"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                priority={index === 0}
                quality={80}
              />
              {/* Text Overlay - First slide */}
              {index === 0 && (
                <div className={styles.textOverlay}>
                  <h1 className={styles.mainText}>Prime Basics</h1>
                  <p className={styles.subtitleText}>Prime Model Minimal</p>
                  <span className={styles.shopNowBtn}>Shop Now</span>
                </div>
              )}

              {/* Text Overlay - Second slide */}
              {index === 1 && (
                <div className={styles.crownOverlay}>
                  <h2 className={styles.crownTitle}>The Crown Series</h2>
                  <p className={styles.crownSubtitle}>Clean. Refined. Timeless</p>
                  <span className={styles.shopNowBtn}>Shop Now</span>
                </div>
              )}

              {/* Text Overlay - Third slide */}
              {index === 2 && (
                <div className={styles.motionOverlay}>
                  <h2 className={styles.motionTitle}>Motion<span className={styles.motionX}> X</span></h2>
                  <p className={styles.motionSubtitle}>Swift. Strong. Agile</p>
                  <span className={styles.shopNowBtn}>Shop Now</span>
                </div>
              )}

              {/* Text Overlay - Fourth slide */}
              {index === 3 && (
                <div className={styles.zenOverlay}>
                  <h2 className={styles.zenTitle}>Zen-G by clothi</h2>
                  <p className={styles.zenSubtitle}>Relaxed. Effortless. Everyday</p>
                  <span className={styles.shopNowBtn}>Shop Now</span>
                </div>
              )}
            </Link>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className={styles.dotsContainer}>
        {slides.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
