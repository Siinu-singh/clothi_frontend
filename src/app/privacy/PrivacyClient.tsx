'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Privacy.module.css';

export default function PrivacyClient() {
  return (
    <div className={styles.privacyPage}>
      {/* Hero Header */}
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.heroKicker}>LEGAL ARCHIVE</span>
          <h1 className={styles.heroTitle}>Privacy Policy</h1>
          <p className={styles.heroDate}>Effective Date: June 17, 2026</p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={styles.container}>
        <article className={styles.article}>
          <section className={styles.section}>
            <h2>1. Introduction & Scope</h2>
            <p>
              Welcome to CLOTHI. We value the trust you place in us and recognize the importance of secure transactions and information privacy. This Privacy Policy describes how Clothi Clothing Private Limited and its affiliates collect, use, share, protect, or otherwise process your personal information through our website.
            </p>
            <p>
              By accessing this site, registering your account, or placing an order, you agree to the practices outlined in this policy. If you do not agree with any terms, please do not use our platform or services.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Information We Collect</h2>
            <p>
              We collect information that is necessary to fulfill your orders, provide our streetwear collections, and enhance your digital shopping experience. This includes:
            </p>
            <ul>
              <li><strong>Account Credentials:</strong> Full name, email address, password, phone number, and profile details when you register with us.</li>
              <li><strong>Transaction Records:</strong> Shipping address, billing details, purchased items, size selections, and order history. Note: Payment details are securely processed directly by our payment gateway (Stripe) and are never stored on our servers.</li>
              <li><strong>Device & Usage Data:</strong> IP address, browser type, device information, operating system, and data on how you interact with our catalog pages and sliders.</li>
              <li><strong>Communication History:</strong> Correspondence records when you contact our style advisors via the <Link href="/contact">Contact Page</Link> or email.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. How We Use Your Information</h2>
            <p>
              CLOTHI uses your personal data for clear, legitimate business operations:
            </p>
            <ul>
              <li>Processing your purchases, styling selections, shipping orders, and handling returns or exchanges.</li>
              <li>Communicating with you regarding order statuses, shipping updates, and technical announcements.</li>
              <li>Enhancing our website navigation, catalog layout, and recommended collections based on preference data.</li>
              <li>Sending customized promotional campaigns, exclusive launch newsletters, and loyalty rewards (only if you opt-in to our subscription list).</li>
              <li>Detecting, preventing, and auditing security incidents, fraudulent transactions, or policy violations.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. Data Sharing & Disclosure</h2>
            <p>
              We prioritize data privacy and do not sell, rent, or lease your personal information to third parties. We share information only in limited contexts:
            </p>
            <p>
              We may share data with trusted third-party service providers who help us run our store (e.g., delivery couriers, email dispatch systems, and hosting providers). All partners are bound by strict confidentiality clauses. Additionally, we may disclose information if required by law, court order, or to protect the safety and rights of CLOTHI, our users, or the public.
            </p>
          </section>

          <section className={styles.section}>
            <h2>5. Data Security</h2>
            <p>
              CLOTHI implements industry-standard administrative, physical, and technical security protocols to safeguard your personal data. We utilize SSL (Secure Socket Layer) encryption for data transfers, safe database storage mechanisms via Firebase and MongoDB, and restrict employee access to customer records.
            </p>
            <p>
              Please remember that no digital transmission or storage method is 100% secure, and we cannot guarantee absolute protection.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Your Rights & Choices</h2>
            <p>
              You have control over how your data is processed. Depending on your location, you may request:
            </p>
            <ul>
              <li>Access to the personal details we store about you.</li>
              <li>Correction of incorrect or outdated profile details in your Account settings.</li>
              <li>Erasure of your personal information (subject to statutory audit and transaction preservation requirements).</li>
              <li>Opting out of marketing emails by clicking the "Unsubscribe" link at the bottom of any campaign.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>7. Contact Information</h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or your data, please contact our Legal & Privacy Team:
            </p>
            <div className={styles.contactDetails}>
              <p><strong>Email:</strong> legal@clothi.com</p>
              <p><strong>Phone:</strong> +91 75037 35901</p>
              <p><strong>Address:</strong> Clothi Clothing Private Limited, Legal Department, New Delhi, India.</p>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}
