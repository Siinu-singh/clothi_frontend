'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Register.module.css';
import { apiFetch } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import { GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';

export default function Register() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        })
      });

      // Backend returns { success, data: { user, accessToken }, message }
      const token = response.data?.accessToken || response.accessToken || response.token;
      
      if (token) {
        localStorage.setItem('token', token);
        toast.success(`Welcome to CLOTHI, ${formData.firstName}!`);
        // Force a page reload to refresh auth context
        window.location.href = '/';
      } else {
        toast.success('Account created! Please sign in.');
        router.push('/login');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);
    try {
      const response = await apiFetch('/auth/login/google', {
        method: 'POST',
        body: JSON.stringify({
          token: credentialResponse.credential
        })
      });

      // Backend returns { success, data: { user, accessToken, isNewUser }, message }
      const token = response.data?.accessToken || response.accessToken || response.token;
      const user = response.data?.user || response.user;
      
      if (token) {
        localStorage.setItem('token', token);
        const userName = user?.firstName || user?.name || 'there';
        toast.success(`Welcome to CLOTHI, ${userName}!`);
        // Force a page reload to refresh auth context
        window.location.href = '/';
      } else {
        throw new Error('No token received from server');
      }
    } catch (err) {
      setError(err.message || 'Google registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google registration failed. Please try again.');
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerImageHalf}>
        <img src="/login_bg.png" alt="Friends running with surfboards" className={styles.registerBg} />
      </div>
      <div className={styles.registerFormHalf}>
        <div className={styles.formWrapper}>
          <h1 className={styles.title}>Create Account</h1>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.nameRow}>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className={styles.inputField}
                value={formData.firstName}
                onChange={handleChange}
                disabled={loading}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className={styles.inputField}
                value={formData.lastName}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="E-mail"
              className={styles.inputField}
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password (min 8 characters)"
              className={styles.inputField}
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className={styles.inputField}
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              required
            />

            <button type="submit" className={styles.registerBtn} disabled={loading}>
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <div className={styles.loginRow}>
            <span>Already have an account? </span>
            <Link href="/login" className={styles.loginLink}>LOGIN</Link>
          </div>

          <div className={styles.orDivider}>or</div>

          <div className={styles.socialButtons}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              width="100%"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
