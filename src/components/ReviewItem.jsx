'use client';

import React, { useState } from 'react';
import styles from './ReviewItem.module.css';
import StarRating from './StarRating';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiFetch } from '../lib/api';

/**
 * ReviewItem Component
 * Displays individual review with helpful/unhelpful voting
 */
export default function ReviewItem({ review, onReviewUpdated }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [helpful, setHelpful] = useState({
    helpful: review.helpful || 0,
    unhelpful: review.unhelpful || 0,
    userVote: null,
  });
  const [loading, setLoading] = useState(false);

  const handleHelpfulClick = async (isHelpful) => {
    if (!user) {
      toast.error('Please log in to vote');
      return;
    }

    if (helpful.userVote === isHelpful) {
      toast.info('You have already voted');
      return;
    }

    try {
      setLoading(true);
      const result = await apiFetch(`/reviews/${review._id}/helpful`, {
        method: 'POST',
        body: JSON.stringify({ helpful: isHelpful }),
      });

      const updatedReview = result.data.review;

      setHelpful({
        helpful: updatedReview.helpful || 0,
        unhelpful: updatedReview.unhelpful || 0,
        userVote: isHelpful,
      });

      onReviewUpdated && onReviewUpdated(updatedReview);
      toast.success('Thank you for your feedback');
    } catch (error) {
      toast.error('Error voting on review');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className={styles.reviewItem}>
      <div className={styles.header}>
        <div className={styles.authorInfo}>
          <div className={styles.avatar}>
            {review.userId?.name?.charAt(0) || 'U'}
          </div>
          <div className={styles.details}>
            <h4>{review.userId?.name || 'Anonymous'}</h4>
            <div className={styles.meta}>
              <StarRating rating={review.rating} size="small" showLabel={false} />
              <span className={styles.date}>{formatDate(review.createdAt)}</span>
              {review.verifiedPurchase && (
                <span className={styles.verified}>✓ Verified Purchase</span>
              )}
            </div>
          </div>
        </div>
        <div className={styles.status}>
          {review.status !== 'approved' && (
            <span className={styles.statusBadge}>{review.status}</span>
          )}
        </div>
      </div>

      {review.title && <h5 className={styles.title}>{review.title}</h5>}

      <p className={styles.comment}>{review.comment}</p>

      <div className={styles.footer}>
        <span className={styles.helpfulQuestion}>Was this helpful?</span>
        <div className={styles.buttons}>
          <button
            className={`${styles.helpBtn} ${helpful.userVote === true ? styles.active : ''}`}
            onClick={() => handleHelpfulClick(true)}
            disabled={loading}
            aria-label="Mark as helpful"
          >
            👍 Helpful ({helpful.helpful})
          </button>
          <button
            className={`${styles.helpBtn} ${helpful.userVote === false ? styles.active : ''}`}
            onClick={() => handleHelpfulClick(false)}
            disabled={loading}
            aria-label="Mark as unhelpful"
          >
            👎 Not Helpful ({helpful.unhelpful})
          </button>
        </div>
      </div>
    </div>
  );
}
