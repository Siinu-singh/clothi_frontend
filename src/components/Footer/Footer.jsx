'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Linkedin, Mail, Phone } from 'lucide-react';
import styles from './Footer.module.css';
import { apiFetch } from '../../lib/api';
import { useToast } from '../../context/ToastContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await apiFetch('/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      setSubscribed(true);
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    } catch (err) {
      toast.error(err.message || 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Column 1: Brand + Newsletter */}
          <div className={styles.col}>
            <Link href="/" className={styles.brand}>
              <img src="/Logo.png" alt="Clothi Logo" className={styles.brandLogo} />
              <span className={styles.brandText}>CLOTHI</span>
            </Link>
            <p className={styles.introText}>
              Get exclusive updates on the collection launch, personalized communications, and the latest news from Clothi.
            </p>
            <form className={styles.newsletterForm} onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email"
                className={styles.newsletterInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              <button type="submit" className={styles.newsletterBtn} disabled={loading || subscribed}>
                {loading ? 'SIGNING UP...' : subscribed ? 'SUBSCRIBED ✓' : 'SIGN UP NOW'}
              </button>
            </form>
          </div>

          {/* Column 2: QUICK SHOP */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>QUICK SHOP</h4>
            <ul className={styles.linkList}>
              <li><Link href="/catalog">Bestsellers</Link></li>
              <li><Link href="/catalog">New Arrivals</Link></li>
              <li><Link href="/catalog">Trending Now</Link></li>
            </ul>
          </div>

          {/* Column 3: HELPFUL LINKS */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>HELPFUL LINKS</h4>
            <ul className={styles.linkList}>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/">Blogs</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 4: MORE */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>MORE</h4>
            <ul className={styles.linkList}>
              <li><Link href="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column 5: GET IN TOUCH */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>GET IN TOUCH</h4>
            <div className={styles.contactItem}>
              <Mail size={16} strokeWidth={1.5} />
              <a href="mailto:support@clothi.com">support@clothi.com</a>
            </div>
            <div className={styles.contactItem}>
              <Phone size={16} strokeWidth={1.5} />
              <a href="tel:+917503735901">+91 75037 35901</a>
            </div>
            <div className={styles.socialRow}>
              <a href="https://www.instagram.com/clothi.co.in/" className={styles.socialLink} aria-label="Instagram"><Instagram size={28} strokeWidth={1.5} /></a>
              <a href="https://www.linkedin.com/company/clothi-official/" className={styles.socialLink} aria-label="LinkedIn"><Linkedin size={28} strokeWidth={1.5} /></a>
              <a href="#" className={styles.socialLink} aria-label="X"><svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg></a>
              <a href="#" className={styles.socialLink} aria-label="Facebook"><Facebook size={28} strokeWidth={1.5} /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Brand Bottom */}
      <div className={styles.mobileBrandBottom}>
        <Link href="/" className={styles.mobileBrandLink}>
          <img src="/Logo.png" alt="Clothi Logo" className={styles.mobileBrandLogo} />
          <span className={styles.mobileBrandName}>CLOTHI</span>
        </Link>
      </div>

      <div className={styles.bottomBar}>
        <p>© {new Date().getFullYear()} Clothi Clothing Private Limited. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
