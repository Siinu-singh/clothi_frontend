'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './ImageSlider.module.css';

export default function ImageSlider({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoPlayRef = useRef(null);

  const slides = images.length > 0 ? images : [
    'https://res.cloudinary.com/dsrht8rss/image/upload/v1775568636/4_koks8s.jpg',
    'https://res.cloudinary.com/dsrht8rss/image/upload/v1776182265/5_qexced.png',
    'https://res.cloudinary.com/dsrht8rss/image/upload/v1775568636/1_gnlpyw.jpg',
    'https://res.cloudinary.com/dsrht8rss/image/upload/v1776182265/5_qexced.png',
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
        {slides.map((image, index) => (
          <div
            key={index}
            className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
          >
            <Image
              src={image}
              alt={`Slide ${index + 1}`}
              fill
              sizes="100vw"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              priority={index === 0}
            />
            {/* Text Overlay - First slide */}
            {index === 0 && (
              <div className={styles.textOverlay}>
                <h1 className={styles.mainText}>Prime Basics</h1>
                <p className={styles.subtitleText}>Prime Model Minimal</p>
              </div>
            )}

            {/* Text Overlay - Second slide */}
            {index === 1 && (
              <div className={styles.crownOverlay}>
                <h2 className={styles.crownTitle}>The Crown Series</h2>
                <p className={styles.crownSubtitle}>Clean. Refined. Timeless</p>
              </div>
            )}

            {/* Text Overlay - Third slide */}
            {index === 2 && (
              <div className={styles.motionOverlay}>
                <h2 className={styles.motionTitle}>Motion<span className={styles.motionX}> X</span></h2>
                <p className={styles.motionSubtitle}>Swift. Strong. Agile</p>
              </div>
            )}

            {/* Text Overlay - Fourth slide */}
            {index === 3 && (
              <div className={styles.zenOverlay}>
                <h2 className={styles.zenTitle}>Zen-G by clothi</h2>
                <p className={styles.zenSubtitle}>Relaxed. Effortless. Everyday</p>
              </div>
            )}
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
