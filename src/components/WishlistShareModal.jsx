'use client';

import React, { useState } from 'react';
import styles from './WishlistShareModal.module.css';
import { useToast } from '../context/ToastContext';

/**
 * WishlistShareModal Component
 * Modal for sharing wishlist with a generated link
 */
export default function WishlistShareModal({ isOpen, onClose, shareLink }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleShareToSocial = (platform) => {
    const message = "Check out my favorite items on CLOTHI!";
    const encodedUrl = encodeURIComponent(shareLink);
    const encodedMessage = encodeURIComponent(message);

    let url;
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent('Check out my favorites')}&body=${encodedMessage}%0A${encodedUrl}`;
        break;
      default:
        return;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Share Your Wishlist</h3>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <p className={styles.description}>
            Share your wishlist with friends and family
          </p>

          <div className={styles.linkSection}>
            <label>Shareable Link:</label>
            <div className={styles.linkContainer}>
              <input
                type="text"
                value={shareLink}
                readOnly
                className={styles.linkInput}
              />
              <button className={styles.copyBtn} onClick={handleCopyLink}>
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className={styles.socialSection}>
            <p className={styles.socialLabel}>Share on social media:</p>
            <div className={styles.socialButtons}>
              <button
                className={`${styles.socialBtn} ${styles.twitter}`}
                onClick={() => handleShareToSocial('twitter')}
                title="Share on Twitter"
                aria-label="Share on Twitter"
              >
                𝕏
              </button>
              <button
                className={`${styles.socialBtn} ${styles.facebook}`}
                onClick={() => handleShareToSocial('facebook')}
                title="Share on Facebook"
                aria-label="Share on Facebook"
              >
                f
              </button>
              <button
                className={`${styles.socialBtn} ${styles.linkedin}`}
                onClick={() => handleShareToSocial('linkedin')}
                title="Share on LinkedIn"
                aria-label="Share on LinkedIn"
              >
                in
              </button>
              <button
                className={`${styles.socialBtn} ${styles.email}`}
                onClick={() => handleShareToSocial('email')}
                title="Share via Email"
                aria-label="Share via Email"
              >
                ✉
              </button>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.closeActionBtn} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
