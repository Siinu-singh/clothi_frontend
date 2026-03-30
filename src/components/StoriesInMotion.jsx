"use client";
import React, { useRef } from 'react';
import styles from './StoriesInMotion.module.css';

const MOCK_STORIES = [
  { id: 1, title: 'The Making of Indigo', video: 'https://videos.pexels.com/video-files/4204505/4204505-sd_360_640_24fps.mp4' },
  { id: 2, title: 'Spring AI Fashion', video: 'https://videos.pexels.com/video-files/5267154/5267154-sd_360_640_25fps.mp4' },
  { id: 3, title: 'Behind The Scenes', video: 'https://videos.pexels.com/video-files/6406981/6406981-sd_360_640_25fps.mp4' },
  { id: 4, title: 'Artisan Workshop', video: 'https://videos.pexels.com/video-files/4836648/4836648-sd_360_640_24fps.mp4' },
];

export default function StoriesInMotion() {
  const scrollRef = useRef(null);

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' });

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>CLOTHI STORIES</h2>
          <p className={styles.subtitle}>Stories in Motion</p>
          <p className={styles.desc}>Experience our artisanal journey in motion.</p>
        </div>
        <div className={styles.navButtons}>
          <button className={styles.navBtn} onClick={scrollLeft}>&larr;</button>
          <button className={styles.navBtn} onClick={scrollRight}>&rarr;</button>
        </div>
      </div>

      <div className={styles.carousel} ref={scrollRef}>
        {MOCK_STORIES.map(story => (
          <div key={story.id} className={styles.card}>
             <video 
               src={story.video} 
               className={styles.video} 
               autoPlay 
               loop 
               muted 
               playsInline 
             />
             <div className={styles.overlay}>
                <h3 className={styles.storyTitle}>{story.title}</h3>
             </div>
          </div>
        ))}
      </div>
    </section>
  );
}
