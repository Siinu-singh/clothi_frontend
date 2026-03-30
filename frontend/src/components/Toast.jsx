'use client';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import styles from './Toast.module.css';

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const Toast = ({ id, type = 'info', message, onDismiss, duration = 4000 }) => {
  const [isExiting, setIsExiting] = useState(false);
  const Icon = icons[type] || icons.info;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(id);
    }, 200); // Match animation duration
  };

  return (
    <div
      className={`${styles.toast} ${styles[type]} ${isExiting ? styles.exiting : ''}`}
      role="alert"
      aria-live="polite"
    >
      <div className={styles.iconWrap}>
        <Icon size={20} strokeWidth={2} />
      </div>
      <p className={styles.message}>{message}</p>
      <button
        className={styles.closeBtn}
        onClick={handleDismiss}
        aria-label="Dismiss notification"
      >
        <X size={16} strokeWidth={2} />
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className={styles.container} aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

export default Toast;
