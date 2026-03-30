'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Login.module.css';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { apiFetch } from '../../lib/api';

export default function Login() {
  const { login } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const data = await login(email, password);
      const userName = data?.user?.name || data?.user?.firstName || 'there';
      toast.success(`Welcome back, ${userName}!`);
      router.push('/');
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
      setPassword('');
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
        toast.success(`Welcome back, ${userName}!`);
        // Force a page reload to refresh auth context
        window.location.href = '/';
      } else {
        throw new Error('No token received from server');
      }
    } catch (err) {
      setError(err.message || 'Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginImageHalf}>
        <img src="/login_bg.png" alt="Friends running with surfboards" className={styles.loginBg} />
      </div>
      <div className={styles.loginFormHalf}>
        <div className={styles.formWrapper}>
          <h1 className={styles.title}>Login</h1>
          
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <input 
              type="email" 
              placeholder="E-mail" 
              className={styles.inputField} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
            <input 
              type="password" 
              placeholder="Password" 
              className={styles.inputField} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
            <button type="submit" className={styles.loginBtn} disabled={loading}>
              {loading ? 'LOGGING IN...' : 'LOGIN'}
            </button>
          </form>
          <div className={styles.forgotRow}>
            <Link href="/" className={styles.forgotLink}>Forgot your password?</Link>
          </div>
          <Link href="/register" className={styles.signUpBtn}>SIGN UP</Link>
          
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
