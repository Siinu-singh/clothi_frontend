'use client';

import React, { useState } from 'react';
import styles from './ReviewForm.module.css';
import StarRating from './StarRating';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';

/**
 * ReviewForm Component
 * Form for submitting or editing product reviews
 */
export default function ReviewForm({ productId, onReviewSubmitted, existingReview = null }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    rating: existingReview?.rating || 0,
    title: existingReview?.title || '',
    comment: existingReview?.comment || '',
  });

  const handleStarClick = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (formData.comment.trim().length < 10) {
      toast.error('Review must be at least 10 characters long');
      return;
    }

    try {
      setLoading(true);

      const endpoint = existingReview
        ? `/reviews/${existingReview._id}`
        : `/reviews/${productId}`;

      const method = existingReview ? 'PATCH' : 'POST';

      const result = await apiFetch(endpoint, {
        method,
        body: JSON.stringify({
          rating: formData.rating,
          title: formData.title || undefined,
          comment: formData.comment,
        }),
      });

      toast.success(
        existingReview ? 'Review updated successfully' : 'Review submitted successfully'
      );

      setFormData({ rating: 0, title: '', comment: '' });
      onReviewSubmitted && onReviewSubmitted(result.data.review);
    } catch (error) {
      toast.error(error.message || 'Error submitting review');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className={styles.loginPrompt}>
        <p>Please log in to submit a review</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3>Write a Review</h3>

      <div className={styles.formGroup}>
        <label>Rating *</label>
        <StarRating
          rating={formData.rating}
          onRate={handleStarClick}
          size="large"
          interactive={true}
          showLabel={true}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="title">Title (optional)</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Summarize your experience"
          maxLength="100"
          className={styles.input}
        />
        <span className={styles.charCount}>{formData.title.length}/100</span>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="comment">Review *</label>
        <textarea
          id="comment"
          name="comment"
          value={formData.comment}
          onChange={handleInputChange}
          placeholder="Share your experience with this product..."
          minLength="10"
          maxLength="1000"
          className={styles.textarea}
          rows="6"
        />
        <span className={styles.charCount}>
          {formData.comment.length}/1000 characters
        </span>
      </div>

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={loading || formData.rating === 0}
      >
        {loading ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
      </button>
    </form>
  );
}
