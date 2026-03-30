'use client';

import React, { useState, useEffect } from 'react';
import styles from './ReviewsList.module.css';
import ReviewItem from './ReviewItem';
import { useToast } from '../context/ToastContext';
import { apiFetch } from '../lib/api';

/**
 * ReviewsList Component
 * Displays list of reviews with filtering and sorting
 */
export default function ReviewsList({ productId, refreshTrigger }) {
  const { toast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [stats, setStats] = useState({
    average: 0,
    count: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });

  const fetchReviews = async (p = 1, sort = sortBy) => {
    try {
      setLoading(true);
      const result = await apiFetch(
        `/reviews/${productId}?sortBy=${sort}&limit=10&page=${p}`
      );

      if (p === 1) {
        setReviews(result.data.reviews);
      } else {
        setReviews((prev) => [...prev, ...result.data.reviews]);
      }

      setStats({
        average: result.data.stats.averageRating,
        count: result.data.stats.totalReviews,
        distribution: result.data.stats.ratingDistribution,
      });
      setHasMore(result.data.reviews.length === 10);
    } catch (error) {
      toast.error('Error loading reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(1, sortBy);
  }, [productId, sortBy, refreshTrigger]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchReviews(nextPage, sortBy);
  };

  const handleReviewUpdated = (updatedReview) => {
    setReviews((prev) =>
      prev.map((r) => (r._id === updatedReview._id ? updatedReview : r))
    );
    // Stats will be automatically updated from the initial fetch
    // No need to refetch all reviews
  };

  const RatingBar = ({ rating, count, total }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <div className={styles.ratingBar}>
        <span className={styles.ratingLabel}>{rating}★</span>
        <div className={styles.barContainer}>
          <div className={styles.bar} style={{ width: `${percentage}%` }} />
        </div>
        <span className={styles.count}>{count}</span>
      </div>
    );
  };

  return (
    <div className={styles.reviewsContainer}>
      <h3 className={styles.title}>Customer Reviews</h3>

      {/* Rating Summary */}
      <div className={styles.summary}>
        <div className={styles.averageRating}>
          <div className={styles.rating}>{stats.average.toFixed(1)}</div>
          <div className={styles.ratingDetails}>
            <div className={styles.stars}>
              {'★★★★★'
                .split('')
                .slice(0, Math.round(stats.average))
                .join('')}
              {'☆☆☆☆☆'
                .split('')
                .slice(0, 5 - Math.round(stats.average))
                .join('')}
            </div>
            <p className={styles.reviewCount}>
              Based on {stats.count} {stats.count === 1 ? 'review' : 'reviews'}
            </p>
          </div>
        </div>

        <div className={styles.ratingDistribution}>
          {[5, 4, 3, 2, 1].map((rating) => (
            <RatingBar
              key={rating}
              rating={rating}
              count={stats.distribution[rating] || 0}
              total={stats.count}
            />
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className={styles.controls}>
        <label htmlFor="sort">Sort by:</label>
        <select
          id="sort"
          value={sortBy}
          onChange={handleSortChange}
          className={styles.select}
        >
          <option value="recent">Most Recent</option>
          <option value="helpful">Most Helpful</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>
      </div>

      {/* Reviews List */}
      {loading && reviews.length === 0 ? (
        <div className={styles.loading}>Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className={styles.noReviews}>
          <p>No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <>
          <div className={styles.reviewsList}>
            {reviews.map((review) => (
              <ReviewItem
                key={review._id}
                review={review}
                onReviewUpdated={handleReviewUpdated}
              />
            ))}
          </div>

          {hasMore && (
            <button className={styles.loadMoreBtn} onClick={handleLoadMore}>
              Load More Reviews
            </button>
          )}
        </>
      )}
    </div>
  );
}
