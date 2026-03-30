'use client';

import React from 'react';
import styles from './StarRating.module.css';

/**
 * StarRating Component
 * Displays or allows selection of star ratings
 */
export default function StarRating({
  rating = 0,
  onRate = null,
  size = 'medium',
  interactive = false,
  showLabel = true,
}) {
  const [hoverRating, setHoverRating] = React.useState(0);
  const displayRating = hoverRating || rating;

  const sizeClass = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
  }[size] || styles.medium;

  return (
    <div className={`${styles.starRating} ${sizeClass}`}>
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`${styles.star} ${
              displayRating >= star ? styles.filled : styles.empty
            }`}
            onClick={() => interactive && onRate && onRate(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            disabled={!interactive}
            aria-label={`Rate ${star} out of 5 stars`}
          >
            ★
          </button>
        ))}
      </div>
      {showLabel && (
        <span className={styles.label}>
          {rating > 0 ? `${rating.toFixed(1)} out of 5` : 'No rating'}
        </span>
      )}
    </div>
  );
}
