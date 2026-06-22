import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import styles from './Newsletter.module.css';
import { sanitizeEmail } from '../../lib/sanitize';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const sanitized = sanitizeEmail(email);
    // Submit sanitized email
    setEmail('');
  };
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.newsletterContent}>
          <div className={styles.newsletterLeft}>
            <div className={styles.brandSun}>
              <img src="/clothi.png" alt="Clothi Logo" className={styles.clothiLogo} />
            </div>
            <div className={styles.nlText}>
              <h3 className={styles.nlTitle}>Stay Notified</h3>
              <p className={styles.nlDesc}>Subscribe to get exclusive updates, new collections, and special offers delivered to your inbox.</p>
            </div>
          </div>
          <div className={styles.newsletterRight}>
            <form className={styles.emailRow} onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="your@email.com"
                className={styles.emailInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <button type="submit" className={styles.emailBtn}><ChevronRight size={20} /></button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
