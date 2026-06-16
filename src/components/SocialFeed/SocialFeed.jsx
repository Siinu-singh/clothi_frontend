'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, Instagram, Twitter, Youtube, Facebook } from 'lucide-react';
import styles from './SocialFeed.module.css';

const socialPosts = [
  {
    id: 1,
    videoSrc: 'https://res.cloudinary.com/dsrht8rss/video/upload/v1778267604/Dryfit_video_zypckt.mp4',
    thumb: 'https://res.cloudinary.com/dsrht8rss/video/upload/v1778267604/Dryfit_video_zypckt.jpg',
    title: 'Dryfit Activewear',
    subtitle: 'Stay active and stylish'
  },
  {
    id: 2,
    videoSrc: 'https://res.cloudinary.com/dsrht8rss/video/upload/v1778267603/Polo_Video_uygjfx.mp4',
    thumb: 'https://res.cloudinary.com/dsrht8rss/video/upload/v1778267603/Polo_Video_uygjfx.jpg',
    title: 'Classic Polo Shirt',
    subtitle: 'Elevate your everyday look'
  },
  {
    id: 3,
    videoSrc: 'https://res.cloudinary.com/dsrht8rss/video/upload/v1778267603/Oversize_video_vksaeb.mp4',
    thumb: 'https://res.cloudinary.com/dsrht8rss/video/upload/v1778267603/Oversize_video_vksaeb.jpg',
    title: 'Oversize Comfort Tee',
    subtitle: 'Relaxed fit for modern style'
  },
  {
    id: 4,
    videoSrc: 'https://res.cloudinary.com/dsrht8rss/video/upload/v1778267602/Casual_Video_gwzird.mp4',
    thumb: 'https://res.cloudinary.com/dsrht8rss/video/upload/v1778267602/Casual_Video_gwzird.jpg',
    title: 'Casual Everyday Looks',
    subtitle: 'Effortless coastal vibes'
  }
];

const handles = [
  { text: 'clothi.co.in', icon: Instagram, color: '#E1306C' },
  { text: 'clothi_tweets', icon: Twitter, color: '#1DA1F2' },
  { text: 'clothi_studio', icon: Youtube, color: '#FF0000' },
  { text: 'clothi_style', icon: Facebook, color: '#1877F2' }
];

const SocialFeed = () => {
  const videoRefs = useRef({});
  const [mutedById, setMutedById] = useState({});
  const [typedText, setTypedText] = useState("");
  const [handleIndex, setHandleIndex] = useState(0);

  useEffect(() => {
    let i = 0;
    let index = 0;
    let isDeleting = false;
    let timeoutId;

    const type = () => {
      const currentHandle = handles[index];

      if (isDeleting) {
        setTypedText(currentHandle.text.slice(0, i - 1));
        i--;
      } else {
        setTypedText(currentHandle.text.slice(0, i + 1));
        i++;
      }

      let speed = isDeleting ? 40 : 120;

      if (!isDeleting && i === currentHandle.text.length) {
        speed = 2500; // Pause at end
        isDeleting = true;
      } else if (isDeleting && i === 0) {
        isDeleting = false;
        index = (index + 1) % handles.length;
        setHandleIndex(index);
        speed = 500; // Pause before typing next handle
      }

      timeoutId = setTimeout(type, speed);
    };

    timeoutId = setTimeout(type, 120);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleVideoMouseEnter = event => {
    const video = event.currentTarget;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => { });
    }
  };

  const handleVideoMouseLeave = event => {
    const video = event.currentTarget;
    video.pause();
    video.currentTime = 0;
  };

  const handleToggleMute = postId => {
    const currentMuted = mutedById[postId] ?? true;
    const nextMuted = !currentMuted;
    const video = videoRefs.current[postId];

    setMutedById(prev => ({
      ...prev,
      [postId]: nextMuted
    }));

    if (video) {
      video.muted = nextMuted;
      if (!nextMuted) {
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => { });
        }
      }
    }
  };

  return (
    <section className={styles.socialSection}>
      <div className={styles.socialHeader}>
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <linearGradient id="insta-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f09433" />
            <stop offset="25%" stopColor="#e6683c" />
            <stop offset="50%" stopColor="#dc2743" />
            <stop offset="75%" stopColor="#cc2366" />
            <stop offset="100%" stopColor="#bc1888" />
          </linearGradient>
        </svg>
        <div className={styles.pulseBadgeWrapper}>
          <div className={styles.pulseBadge}>
            {(() => {
              const CurrentIcon = handles[handleIndex].icon;
              return <CurrentIcon size={24} color={handles[handleIndex].color} />;
            })()}
            <span className={styles.typingContainer}>
              @{typedText}<span className={styles.cursor}>|</span>
            </span>
          </div>
        </div>
        <div className={styles.socialTitleWrapper}>
          <span className={styles.line} />
          <h2 className={styles.socialTitle}>CATCH US ON SOCIAL</h2>
          <span className={styles.line} />
        </div>
      </div>

      <div className={styles.socialGrid}>
        {socialPosts.map(post => {
          const isMuted = mutedById[post.id] ?? true;

          return (
            <div key={post.id} className={styles.socialCard}>
              <div className={styles.videoWrapper}>
                <div className={styles.instaOverlay}>
                  <Instagram className={styles.instaIcon} />
                </div>
                {post.videoSrc ? (
                  <video
                    className={styles.videoImg}
                    src={post.videoSrc}
                    loop
                    playsInline
                    preload="metadata"
                    onMouseEnter={handleVideoMouseEnter}
                    onMouseLeave={handleVideoMouseLeave}
                    muted={isMuted}
                    ref={node => {
                      if (node) {
                        videoRefs.current[post.id] = node;
                      } else {
                        delete videoRefs.current[post.id];
                      }
                    }}
                  />
                ) : (
                  <img src={post.videoImg} alt="social post" className={styles.videoImg} />
                )}
                {post.videoSrc && (
                  <button
                    type="button"
                    className={styles.muteBtn}
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                    onClick={() => handleToggleMute(post.id)}
                  >
                    {isMuted ? (
                      <VolumeX size={16} color="white" strokeWidth={2.5} />
                    ) : (
                      <Volume2 size={16} color="white" strokeWidth={2.5} />
                    )}
                  </button>
                )}
              </div>
              <Link href="/" className={styles.productLink}>
                <div className={styles.productCard}>
                  <div className={styles.thumbWrapper}>
                    <img src={post.thumb} alt={post.title} className={styles.thumbImg} />
                  </div>
                  <div className={styles.productInfo}>
                    <p className={styles.productTitle}>{post.title}</p>
                    {post.subtitle && <p className={styles.productSub}>{post.subtitle}</p>}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SocialFeed;
