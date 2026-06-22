'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getActiveAnnouncements } from '../../lib/api-announcements';
import styles from './AnnouncementBar.module.css';

const AnnouncementBar = ({ initialAnnouncements, isScrolled }) => {
  const [announcements, setAnnouncements] = useState(initialAnnouncements || []);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await getActiveAnnouncements();
        if (res.success && res.data && res.data.length > 0) {
          setAnnouncements(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch announcements:', err);
      }
    };
    fetchAnnouncements();
  }, []);

  if (announcements.length === 0) return null;

  // Repeat announcements to make sure the marquee is filled and loops seamlessly
  const repeatCount = Math.max(4, Math.ceil(8 / announcements.length));
  const repeated = [];
  for (let i = 0; i < repeatCount; i++) {
    repeated.push(...announcements);
  }

  return (
    <div className={`${styles.bar} ${isScrolled ? styles.hidden : ''}`} role="region" aria-label="Promotional announcements">
      <div className={styles.track}>
        <div className={styles.group}>
          {repeated.map((ann, idx) => (
            <span key={`g1-${ann._id}-${idx}`} className={styles.text}>
              {ann.link ? (
                <Link href={ann.link} className={styles.textLink}>
                  {ann.text}
                </Link>
              ) : (
                ann.text
              )}
            </span>
          ))}
        </div>
        <div className={styles.group} aria-hidden="true">
          {repeated.map((ann, idx) => (
            <span key={`g2-${ann._id}-${idx}`} className={styles.text}>
              {ann.link ? (
                <Link href={ann.link} className={styles.textLink}>
                  {ann.text}
                </Link>
              ) : (
                ann.text
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
