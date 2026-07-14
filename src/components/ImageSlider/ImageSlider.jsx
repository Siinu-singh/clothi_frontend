'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './ImageSlider.module.css';

export default function ImageSlider({ images = [] }) {
  const autoPlayRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const slides = images.length > 0 ? images : [
    {
      url: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1784018453/e5rlqmitkmj2usentgk2_zswbq2.avif',
      link: '/catalog',
    },
    {
      url: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1784018455/vtaoia8aox2todcupl8l_ke9vqq.avif',
      link: '/catalog?category=POLO',
      objectPosition: 'top',
    },
    {
      url: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1784018455/wu70emgcrwec3obqxdla_dgwbdm.avif',
      link: '/catalog?category=DRY-FIT',
    },
    {
      url: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1784018454/rbhqowen9wwmhsede09s_rvd0y1.avif',
      link: '/catalog?category=OVERSIZE',
    },

  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [direction, setDirection] = useState('next'); // 'next' or 'prev'

  // Transition to a new slide
  const goTo = useCallback((newIndex, dir = 'next') => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(dir);
    setPrevIndex(currentIndex);
    setCurrentIndex(newIndex);
  }, [isAnimating, currentIndex]);

  const handleNext = useCallback(() => {
    const next = (currentIndex + 1) % slides.length;
    goTo(next, 'next');
  }, [currentIndex, slides.length, goTo]);

  const handlePrev = useCallback(() => {
    const prev = (currentIndex - 1 + slides.length) % slides.length;
    goTo(prev, 'prev');
  }, [currentIndex, slides.length, goTo]);

  const goToSlide = useCallback((index) => {
    if (index === currentIndex) return;
    goTo(index, index > currentIndex ? 'next' : 'prev');
  }, [currentIndex, goTo]);

  // Autoplay
  useEffect(() => {
    if (slides.length <= 1) return;
    autoPlayRef.current = setTimeout(() => {
      handleNext();
    }, 2500);
    return () => clearTimeout(autoPlayRef.current);
  }, [currentIndex, isAnimating, slides.length, handleNext]);

  // Animation end handler
  const handleAnimationEnd = useCallback(() => {
    setIsAnimating(false);
    setPrevIndex(null);
  }, []);

  return (
    <div className={styles.sliderContainer}>
      {/* All slides stacked */}
      {slides.map((slide, index) => {
        // Determine the role of this slide
        const isCurrent = index === currentIndex;
        const isLeaving = index === prevIndex && isAnimating;

        // The current (incoming) slide sits at z-index 1 (behind)
        // The leaving (outgoing) slide sits at z-index 2 (on top, sliding away)
        let slideClass = styles.slide;
        if (isCurrent) slideClass += ` ${styles.current}`;
        if (isLeaving && direction === 'next') slideClass += ` ${styles.leavingNext}`;
        if (isLeaving && direction === 'prev') slideClass += ` ${styles.leavingPrev}`;

        // Only render current, leaving, or the one right before animation clears
        const isVisible = isCurrent || isLeaving;
        if (!isVisible) return null;

        return (
          <div
            key={index}
            className={slideClass}
            onAnimationEnd={isLeaving ? handleAnimationEnd : undefined}
          >
            <Link href={slide.link || '#'} className={styles.slideLink}>
              <Image
                src={slide.url}
                alt="Store Banner Slide"
                fill
                sizes="100vw"
                style={{
                  objectFit: 'cover',
                  objectPosition: slide.objectPosition || 'center',
                }}
                priority={index <= 1}
                quality={85}
              />

              {/* Text overlays — only on the current (incoming) slide */}
              {isCurrent && (
                <>
                  {index === 0 && (
                    <div className={styles.textOverlay}>
                      {/* <h1 className={styles.mainText}>Prime Basics</h1>
                      <p className={styles.subtitleText}>Prime Model Minimal</p> */}
                      <span className={styles.shopNowBtn}>Shop Now</span>
                    </div>
                  )}
                  {index === 1 && (
                    <div className={styles.crownOverlay}>
                      <span className={styles.shopNowBtn}>Shop Now</span>
                    </div>
                  )}
                  {index === 2 && (
                    <div className={styles.motionOverlay}>
                      {/* <h2 className={styles.motionTitle}>Motion<span className={styles.motionX}> X</span></h2>
                      <p className={styles.motionSubtitle}>Swift. Strong. Agile</p> */}
                      <span className={styles.shopNowBtn}>Shop Now</span>
                    </div>
                  )}
                  {index === 3 && (
                    <div className={styles.zenOverlay}>
                      {/* <h2 className={styles.zenTitle}>Zen-G by clothi</h2>
                      <p className={styles.zenSubtitle}>Relaxed. Effortless. Everyday</p> */}
                      <span className={styles.shopNowBtn}>Shop Now</span>
                    </div>
                  )}
                </>
              )}
            </Link>
          </div>
        );
      })}

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
