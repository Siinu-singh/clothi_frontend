'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { X } from 'lucide-react';
import styles from './Toast.module.css';

interface ToastProps {
  id: number;
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onDismiss: (id: number) => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ id, type = 'info', message, onDismiss, duration = 2000 }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(id);
    }, 300); // Match CSS transition duration
  }, [id, onDismiss]);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);
      return () => clearTimeout(timer);
    }
    return;
  }, [duration, handleDismiss]);

  return (
    <div
      className={`${styles.toast} ${styles[type]} ${isExiting ? styles.exiting : ''}`}
      role="alert"
      aria-live="polite"
    >
      <div className={styles.content}>
        <p className={styles.message}>{message}</p>
      </div>
      <button
        className={styles.closeBtn}
        onClick={handleDismiss}
        aria-label="Dismiss notification"
      >
        <X size={14} strokeWidth={2} />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: {
    id: number;
    type?: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  }[];
  onDismiss: (id: number) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  // Only display the first toast in the queue
  const activeToast = toasts[0];

  return (
    <div className={styles.container} aria-live="polite" aria-atomic="false">
      <Toast key={activeToast.id} {...activeToast} onDismiss={onDismiss} />
    </div>
  );
};

export default Toast;
