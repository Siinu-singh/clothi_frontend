'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Phone, ArrowRight, Loader2, ChevronLeft } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { getFirebaseAuth, RecaptchaVerifier, signInWithPhoneNumber } from '../../lib/firebase';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { sanitizeString, sanitizeEmail } from '../../lib/sanitize';
import styles from './LoginModal.module.css';

// ─── Country codes ────────────────────────────────────────────────
const COUNTRIES = [
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+1',  flag: '🇺🇸', name: 'USA' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+65', flag: '🇸🇬', name: 'Singapore' },
  { code: '+86', flag: '🇨🇳', name: 'China' },
];

// ─── Step enum ────────────────────────────────────────────────────
const STEP = {
  MAIN:     'main',
  OTP:      'otp',
  PROFILE:  'profile',
};

export default function LoginModal({ isOpen, onClose }) {
  const [step, setStep] = useState(STEP.MAIN);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [firebaseIdToken, setFirebaseIdToken] = useState('');
  const [verifiedPhone, setVerifiedPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdownTimer, setCountdownTimer] = useState(0);
  const [overlay, setOverlay] = useState(null);
  const [activeOverlayType, setActiveOverlayType] = useState('terms');

  const modalRef = useRef(null);
  const otpRefs = useRef([]);
  const recaptchaContainerRef = useRef(null);
  const recaptchaVerifierRef = useRef(null);

  const { login } = useAuth();

  // ─── Reset state when modal closes ─────────────────────────────
  useEffect(() => {
    if (!isOpen) {
      setStep(STEP.MAIN);
      setPhoneNumber('');
      setOtp(['', '', '', '', '', '']);
      setConfirmationResult(null);
      setFirebaseIdToken('');
      setVerifiedPhone('');
      setFirstName('');
      setLastName('');
      setEmail('');
      setLoading(false);
      setError('');
      setCountdownTimer(0);
      setOverlay(null);
      // Clean up recaptcha
      if (recaptchaVerifierRef.current) {
        try { recaptchaVerifierRef.current.clear(); } catch {}
        recaptchaVerifierRef.current = null;
      }
      const container = document.getElementById('recaptcha-container');
      if (container) {
        container.innerHTML = '';
      }
    }
  }, [isOpen]);

  // ─── Body scroll lock ──────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  // Sync active overlay type to preserve text during exit transitions
  useEffect(() => {
    if (overlay) {
      setActiveOverlayType(overlay);
    }
  }, [overlay]);

  // ─── Escape key handler ────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // ─── Countdown timer for OTP resend ────────────────────────────
  useEffect(() => {
    if (countdownTimer <= 0) return;
    const t = setTimeout(() => setCountdownTimer(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdownTimer]);

  // ─── Setup reCAPTCHA ───────────────────────────────────────────
  const setupRecaptcha = useCallback(() => {
    if (recaptchaVerifierRef.current) {
      return;
    }
    recaptchaVerifierRef.current = new RecaptchaVerifier(getFirebaseAuth(), 'recaptcha-container', {
      size: 'invisible',
      callback: () => {},
      'expired-callback': () => {
        setError('reCAPTCHA expired. Please try again.');
      },
    });
  }, []);

  // ─── SEND OTP ──────────────────────────────────────────────────
  const handleSendOtp = async () => {
    setError('');
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid mobile number');
      return;
    }

    setLoading(true);
    try {
      setupRecaptcha();
      const fullPhone = `${countryCode}${cleanPhone}`;
      const result = await signInWithPhoneNumber(getFirebaseAuth(), fullPhone, recaptchaVerifierRef.current);
      setConfirmationResult(result);
      setStep(STEP.OTP);
      setCountdownTimer(30);
    } catch (err) {
      console.error('OTP send error:', err);
      // Clean up recaptcha on error so the next attempt can re-render it clean
      if (recaptchaVerifierRef.current) {
        try { recaptchaVerifierRef.current.clear(); } catch {}
        recaptchaVerifierRef.current = null;
      }
      const container = document.getElementById('recaptcha-container');
      if (container) {
        container.innerHTML = '';
      }

      if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else if (err.code === 'auth/invalid-phone-number') {
        setError('Invalid phone number format.');
      } else if (err.code === 'auth/billing-not-enabled') {
        setError('SMS sending requires a paid Firebase plan. To test for free, add your phone number as a "Phone number for testing" in the Firebase Console under Authentication > Sign-in method.');
      } else {
        setError(err.message || 'Failed to send OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── VERIFY OTP ────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    setError('');
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await confirmationResult.confirm(code);
      const idToken = await userCredential.user.getIdToken();
      setFirebaseIdToken(idToken);

      // Try login with the backend
      const response = await apiFetch('/auth/login/phone', {
        method: 'POST',
        body: JSON.stringify({ idToken }),
      });

      if (response.data?.profileRequired) {
        setVerifiedPhone(response.data.phone);
        setStep(STEP.PROFILE);
      } else if (response.data?.accessToken) {
        // Existing user — logged in
        localStorage.setItem('token', response.data.accessToken);
        window.location.href = '/';
      }
    } catch (err) {
      console.error('OTP verify error:', err);
      if (err.code === 'auth/invalid-verification-code') {
        setError('Invalid OTP. Please try again.');
      } else {
        setError(err.message || 'Verification failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── COMPLETE PROFILE (new phone user) ─────────────────────────
  const handleCompleteProfile = async (e) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    try {
      const response = await apiFetch('/auth/login/phone', {
        method: 'POST',
        body: JSON.stringify({
          idToken: firebaseIdToken,
          email: sanitizeEmail(email.trim()),
          firstName: sanitizeString(firstName.trim()),
          lastName: sanitizeString(lastName.trim()),
        }),
      });

      if (response.data?.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        window.location.href = '/';
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── OTP input handler ─────────────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasteData.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < pasteData.length; i++) {
        newOtp[i] = pasteData[i];
      }
      setOtp(newOtp);
      const focusIdx = Math.min(pasteData.length, 5);
      otpRefs.current[focusIdx]?.focus();
    }
  };

  // ─── GOOGLE LOGIN handler ──────────────────────────────────────
  const handleGoogleLoginSuccess = async (token) => {
    setError('');
    setLoading(true);
    try {
      const response = await apiFetch('/auth/login/google', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });

      const tokenVal = response.data?.accessToken || response.accessToken || response.token;
      if (tokenVal) {
        localStorage.setItem('token', tokenVal);
        window.location.href = '/';
      } else {
        throw new Error('No token received');
      }
    } catch (err) {
      setError(err.message || 'Google login failed.');
    } finally {
      setLoading(false);
    }
  };

  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => handleGoogleLoginSuccess(tokenResponse.access_token),
    onError: () => setError('Google login failed.'),
  });

  // ─── APPLE LOGIN handler (placeholder) ─────────────────────────
  const handleAppleLogin = async () => {
    setError('Apple Sign-In coming soon!');
  };

  // ─── Backdrop click ────────────────────────────────────────────
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
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
        {/* ── Close Button ──────────────────────────────── */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <X size={20} strokeWidth={1.5} />
        </button>

        {/* ── Left Pane: Branding ────────────────────────── */}
        <div className={styles.leftPane}>
          <div className={styles.brandContent}>
            <img src="/Logo.png" alt="Clothi" className={styles.brandLogo} />
            <h2 className={styles.brandName}>CLOTHI</h2>
            <p className={styles.brandTagline}>
              Welcome!<br />
              Register to avail the best deals!
            </p>
          </div>
          <div className={styles.brandFooter}>
            <span className={styles.brandFooterText}>Premium Streetwear</span>
          </div>
        </div>

        {/* ── Right Pane: Auth Forms ─────────────────────── */}
        <div className={styles.rightPane}>

          {/* ─── STEP: MAIN (Phone + Social) ─────────────── */}
          {step === STEP.MAIN && (
            <div className={`${styles.formContent} ${overlay ? styles.formScaleDown : ''}`}>
              <h2 id="login-modal-title" className={styles.formTitle}>Login / Signup</h2>
              <p className={styles.formSubtitle}>Enter Mobile Number</p>

              <div className={styles.phoneInputGroup}>
                <div className={styles.countrySelect}>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className={styles.countryDropdown}
                    disabled={loading}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  type="tel"
                  className={styles.phoneInput}
                  placeholder="Enter Mobile Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  maxLength={10}
                  disabled={loading}
                  autoFocus
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button
                className={styles.primaryBtn}
                onClick={handleSendOtp}
                disabled={loading || phoneNumber.length < 10}
              >
                {loading ? (
                  <Loader2 size={18} className={styles.spinner} />
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              {/* ─── Divider ─────────────────────────────────── */}
              <div className={styles.divider}>
                <span>or continue with</span>
              </div>

              {/* ─── Social Login Buttons ─────────────────────── */}
              <div className={styles.socialButtons}>
                <button
                  className={styles.googleBtn}
                  onClick={() => triggerGoogleLogin()}
                  disabled={loading}
                  aria-label="Continue with Google"
                >
                  <svg className={styles.googleLogo} viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </button>

                <button
                  className={styles.appleBtn}
                  onClick={handleAppleLogin}
                  disabled={loading}
                  aria-label="Continue with Apple"
                >
                  <svg className={styles.appleLogo} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                </button>
              </div>

              <p className={styles.terms}>
                By continuing, you agree to our{' '}
                <button
                  type="button"
                  className={styles.inlineLink}
                  onClick={() => setOverlay('terms')}
                >
                  Terms of Service
                </button>{' '}
                &{' '}
                <button
                  type="button"
                  className={styles.inlineLink}
                  onClick={() => setOverlay('privacy')}
                >
                  Privacy Policy
                </button>
              </p>
            </div>
          )}

          {/* ─── STEP: OTP ───────────────────────────────── */}
          {step === STEP.OTP && (
            <div className={`${styles.formContent} ${overlay ? styles.formScaleDown : ''}`}>
              <button
                className={styles.backBtn}
                onClick={() => { setStep(STEP.MAIN); setOtp(['','','','','','']); setError(''); }}
              >
                <ChevronLeft size={18} /> Back
              </button>

              <h2 className={styles.formTitle}>Verify OTP</h2>
              <p className={styles.formSubtitle}>
                We sent a 6-digit code to <strong>{countryCode}{phoneNumber}</strong>
              </p>

              <div className={styles.otpGroup} onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => otpRefs.current[i] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className={styles.otpInput}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    disabled={loading}
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button
                className={styles.primaryBtn}
                onClick={handleVerifyOtp}
                disabled={loading || otp.join('').length !== 6}
              >
                {loading ? (
                  <Loader2 size={18} className={styles.spinner} />
                ) : (
                  <span>Verify & Login</span>
                )}
              </button>

              <p className={styles.resendText}>
                {countdownTimer > 0 ? (
                  <>Resend code in <strong>{countdownTimer}s</strong></>
                ) : (
                  <button className={styles.resendBtn} onClick={handleSendOtp} disabled={loading}>
                    Resend OTP
                  </button>
                )}
              </p>
            </div>
          )}

          {/* ─── STEP: PROFILE COMPLETION ────────────────── */}
          {step === STEP.PROFILE && (
            <div className={`${styles.formContent} ${overlay ? styles.formScaleDown : ''}`}>
              <h2 className={styles.formTitle}>Complete Profile</h2>
              <p className={styles.formSubtitle}>
                Just a few details to set up your account
              </p>

              <form onSubmit={handleCompleteProfile} className={styles.profileForm}>
                <input
                  type="text"
                  className={styles.textInput}
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={loading}
                  required
                  autoFocus
                  autoComplete="given-name"
                />
                <input
                  type="text"
                  className={styles.textInput}
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={loading}
                  required
                  autoComplete="family-name"
                />
                <input
                  type="email"
                  className={styles.textInput}
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  autoComplete="email"
                />

                {error && <p className={styles.error}>{error}</p>}

                <button
                  type="submit"
                  className={styles.primaryBtn}
                  disabled={loading || !firstName.trim() || !lastName.trim() || !email.trim()}
                >
                  {loading ? (
                    <Loader2 size={18} className={styles.spinner} />
                  ) : (
                    <span>Create Account</span>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Inline Legal Overlay Pop-up */}
          <div className={`${styles.overlayContainer} ${overlay ? styles.open : ''}`}>
            <div className={styles.overlayHeader}>
              <h3 className={styles.overlayTitle}>
                {activeOverlayType === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
              </h3>
              <button
                className={styles.overlayClose}
                onClick={() => setOverlay(null)}
                aria-label="Close legal text"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>
            <div className={styles.overlayBody}>
              {activeOverlayType === 'terms' ? (
                <>
                  <p>Welcome to CLOTHI. These Terms of Service govern your use of our website and services.</p>
                  <h4>1. Account Registration</h4>
                  <p>When you register an account, you agree to provide accurate, current, and complete mobile number and profile details. You are responsible for keeping your login credentials confidential.</p>
                  <h4>2. Purchases & Payments</h4>
                  <p>All transactions are securely handled via Stripe. You agree to pay the fees and applicable taxes for any collections you purchase from us.</p>
                  <h4>3. Return & Refund Policy</h4>
                  <p>We accept returns of unworn and unwashed streetwear garments within 30 days of delivery. Returns are free for all domestic orders.</p>
                  <h4>4. Intellectual Property</h4>
                  <p>All content, including logos, designs, product images, website code, and catalog configurations are properties of CLOTHI and may not be copied or reproduced without prior written permission.</p>
                  <h4>5. Limitation of Liability</h4>
                  <p>CLOTHI is not liable for indirect, incidental, or consequential damages resulting from your use or inability to use our apparel platforms.</p>
                </>
              ) : (
                <>
                  <p>CLOTHI values your information privacy. This policy describes how we collect and process data.</p>
                  <h4>1. Collection of Data</h4>
                  <p>We collect your phone number, email address, profile details, and shipping address when you create an account or complete purchases.</p>
                  <h4>2. Security Practices</h4>
                  <p>We use SSL encryption and secure databases (via Firebase and MongoDB) to protect personal data from unauthorized access or breaches.</p>
                  <h4>3. Data Sharing</h4>
                  <p>We never sell your personal customer details. Data is only shared with trusted courier and database providers to fulfill shipping and transaction services.</p>
                  <h4>4. Third-Party Services</h4>
                  <p>Payment operations are safely handled by Stripe. Analytics and identity authentications are facilitated by Google and Firebase Services.</p>
                  <h4>5. Your Rights</h4>
                  <p>You can request to update, view, or completely delete your personal details from our customer systems by contacting us at support@clothi.com.</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Invisible reCAPTCHA container */}
      <div id="recaptcha-container" ref={recaptchaContainerRef} />
    </div>
  );
}
