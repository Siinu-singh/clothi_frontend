'use client';
import { useState, useEffect } from 'react';
import styles from './NetworkStatus.module.css';

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      // Show "back online" briefly then hide
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showBanner) return null;

  return (
    <div
      className={`${styles.banner} ${isOnline ? styles.online : styles.offline}`}
      role="status"
      aria-live="polite"
    >
      {isOnline ? '✓ Back online' : '⚠ No internet connection — some features may be unavailable'}
    </div>
  );
}
