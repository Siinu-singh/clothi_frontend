'use client';

import React from 'react';
import styles from './ProductRating.module.css';
import StarRating from './StarRating';

/**
 * ProductRating Component
 * Displays product rating badge with average and count
 */
export default function ProductRating({ rating, reviewCount, size = 'medium' }) {
  const sizeClass = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
  }[size] || styles.medium;

  return (
    <div className={`${styles.productRating} ${sizeClass}`}>
      <StarRating
        rating={rating}
        size={size === 'small' ? 'small' : size === 'large' ? 'large' : 'medium'}
        showLabel={false}
      />
      <div className={styles.info}>
        <span className={styles.rating}>{rating.toFixed(1)}</span>
        <span className={styles.count}>
          ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
        </span>
      </div>
    </div>
  );
}
