'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '../../lib/api';
import styles from './VerifyEmail.module.css';

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await apiFetch('/auth/verify-email', {
          method: 'POST',
          body: JSON.stringify({ token }),
        });

        setStatus('success');
        setMessage(response.message || 'Your email has been verified successfully!');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } catch (error) {
        setStatus('error');
        setMessage(error.message || 'Failed to verify email. The link may have expired.');
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {status === 'verifying' && (
          <>
            <div className={styles.spinner}></div>
            <h1 className={styles.title}>Verifying your email...</h1>
            <p className={styles.message}>Please wait while we verify your email address.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className={styles.iconSuccess}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className={styles.title}>Email Verified!</h1>
            <p className={styles.message}>{message}</p>
            <p className={styles.redirect}>Redirecting to login...</p>
            <Link href="/login" className={styles.button}>
              Go to Login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className={styles.iconError}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="15" y1="9" x2="9" y2="15" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="9" y1="9" x2="15" y2="15" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className={styles.title}>Verification Failed</h1>
            <p className={styles.message}>{message}</p>
            <Link href="/login" className={styles.button}>
              Go to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
