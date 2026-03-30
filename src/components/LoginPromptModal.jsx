'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, LogIn, UserPlus } from 'lucide-react';
import styles from './LoginPromptModal.module.css';

const LoginPromptModal = ({ isOpen, onClose, title, message }) => {
  const modalRef = useRef(null);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={styles.backdrop} 
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <div className={styles.modal} ref={modalRef}>
        <button 
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} strokeWidth={1.5} />
        </button>

        <div className={styles.content}>
          <div className={styles.iconWrap}>
            <LogIn size={32} strokeWidth={1.5} />
          </div>
          
          <h2 id="login-modal-title" className={styles.title}>
            {title || 'Sign in to continue'}
          </h2>
          
          <p className={styles.message}>
            {message || 'Please sign in to your account to access this feature.'}
          </p>

          <div className={styles.actions}>
            <Link href="/login" className={styles.primaryBtn} onClick={onClose}>
              <LogIn size={18} strokeWidth={1.5} />
              <span>Sign In</span>
            </Link>
            
            <Link href="/register" className={styles.secondaryBtn} onClick={onClose}>
              <UserPlus size={18} strokeWidth={1.5} />
              <span>Create Account</span>
            </Link>
          </div>

          <p className={styles.footer}>
            Creating an account is free and takes less than a minute.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptModal;
