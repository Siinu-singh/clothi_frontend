'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './ReviewForm.module.css';
import StarRating from '../StarRating/StarRating';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../lib/api';
import { sanitizeString } from '../../lib/sanitize';
import { RateLimiter } from '../../lib/utils';
import { FORM_LIMITS } from '@/config/constants';

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted?: (review: any) => void;
  existingReview?: {
    _id: string;
    rating: number;
    title?: string;
    comment: string;
  } | null;
}

export default function ReviewForm({
  productId,
  onReviewSubmitted,
  existingReview = null,
}: ReviewFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const rateLimiterRef = useRef(new RateLimiter(5, 60000)); // 5 submissions per minute
  const [formData, setFormData] = useState({
    rating: existingReview?.rating || 0,
    title: existingReview?.title || '',
    comment: existingReview?.comment || '',
  });

  // Real-time validation
  useEffect(() => {
    const newErrors: Record<string, string> = {};

    if (formData.title && formData.title.length > FORM_LIMITS.REVIEW_TITLE_MAX) {
      newErrors.title = `Title must be ${FORM_LIMITS.REVIEW_TITLE_MAX} characters or less`;
    }

    if (formData.comment.length < FORM_LIMITS.REVIEW_COMMENT_MIN && formData.comment.length > 0) {
      newErrors.comment = `Review must be at least ${FORM_LIMITS.REVIEW_COMMENT_MIN} characters`;
    }

    if (formData.comment.length > FORM_LIMITS.REVIEW_COMMENT_MAX) {
      newErrors.comment = `Review must be ${FORM_LIMITS.REVIEW_COMMENT_MAX} characters or less`;
    }

    setErrors(newErrors);
  }, [formData]);

  const handleStarClick = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Rate limiting check
    if (!rateLimiterRef.current.isAllowed()) {
      const remaining = Math.ceil(rateLimiterRef.current.getRemainingTime() / 1000);
      toast.error(`Please wait ${remaining}s before submitting another review`);
      return;
    }

    // Validation
    const validationErrors: Record<string, string> = {};

    if (formData.rating === 0) {
      validationErrors.rating = 'Please select a rating';
    }

    if (formData.comment.trim().length < FORM_LIMITS.REVIEW_COMMENT_MIN) {
      validationErrors.comment = `Review must be at least ${FORM_LIMITS.REVIEW_COMMENT_MIN} characters long`;
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const endpoint = existingReview
        ? `/reviews/${existingReview._id}`
        : `/reviews/${productId}`;

      const method = existingReview ? 'PATCH' : 'POST';

      const result = await apiFetch<any>(endpoint, {
        method,
        body: JSON.stringify({
          rating: formData.rating,
          title: sanitizeString(formData.title, FORM_LIMITS.REVIEW_TITLE_MAX) || undefined,
          comment: sanitizeString(formData.comment, FORM_LIMITS.REVIEW_COMMENT_MAX),
        }),
        maxRetries: 2,
      });

      toast.success(
        existingReview ? 'Review updated successfully' : 'Review submitted successfully'
      );

      setFormData({ rating: 0, title: '', comment: '' });
      setErrors({});
      onReviewSubmitted && onReviewSubmitted(result.data?.review || result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error submitting review';
      toast.error(message);
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
          maxLength={FORM_LIMITS.REVIEW_TITLE_MAX}
          className={styles.input}
          autoComplete="off"
          aria-describedby="title-count title-error"
        />
        <span id="title-count" className={styles.charCount}>
          {formData.title.length}/{FORM_LIMITS.REVIEW_TITLE_MAX}
        </span>
        {errors.title && (
          <span id="title-error" className={styles.error} role="alert">
            {errors.title}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="comment">Review *</label>
        <textarea
          id="comment"
          name="comment"
          value={formData.comment}
          onChange={handleInputChange}
          placeholder="Share your experience with this product..."
          minLength={FORM_LIMITS.REVIEW_COMMENT_MIN}
          maxLength={FORM_LIMITS.REVIEW_COMMENT_MAX}
          className={styles.textarea}
          rows={6}
          autoComplete="off"
          aria-describedby="comment-count comment-error"
        />
        <span id="comment-count" className={styles.charCount}>
          {formData.comment.length}/{FORM_LIMITS.REVIEW_COMMENT_MAX} characters
        </span>
        {errors.comment && (
          <span id="comment-error" className={styles.error} role="alert">
            {errors.comment}
          </span>
        )}
      </div>

      {errors.rating && (
        <p className={styles.error} role="alert">
          {errors.rating}
        </p>
      )}

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={loading || formData.rating === 0 || Object.keys(errors).length > 0}
        aria-label={existingReview ? 'Update review' : 'Submit review'}
      >
        {loading ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
      </button>
    </form>
  );
}
