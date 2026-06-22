'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Leaf, Heart, Globe, Users, Award, Truck, Clock, Sparkles } from 'lucide-react';
import styles from './About.module.css';

const values = [
  {
    icon: Clock,
    title: 'Timeless Design',
    description: 'Every piece is created with a focus on versatility and longevity, helping you build a wardrobe that remains relevant season after season.',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'From fabric selection to final finishing, we prioritize quality and attention to detail to ensure lasting comfort and confidence.',
  },
  {
    icon: Sparkles,
    title: 'Thoughtful Style',
    description: 'We design essentials that fit seamlessly into modern lifestyles—easy to wear, effortless to style, and made for everyday life.',
  },
];

const stats = [
  { number: '50K+', label: 'Happy Customers' },
  { number: '15+', label: 'Countries Served' },
  { number: '100%', label: 'Sustainable Materials' },
  { number: '0', label: 'Waste to Landfill' },
];

const team = [
  {
    name: 'Suraj Kumar',
    role: 'Founder & CEO',
    image: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1781691704/Gemini_Generated_Image_37af2k37af2k37af_ioflx8.png',
  },
  {
    name: 'Vidhanshu Singh',
    role: 'Co-Founder',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  }
];

const features = [
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Each garment undergoes rigorous quality checks to ensure lasting comfort and durability.',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Complimentary shipping on all orders over $100, delivered in eco-friendly packaging.',
  },
  {
    icon: Users,
    title: 'Community First',
    description: '5% of every purchase goes to support local artisan communities around the world.',
  },
];

export default function AboutClient() {
  return (
    <div className={styles.aboutPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <Image
          src="https://res.cloudinary.com/dsrht8rss/image/upload/v1781678778/About_Page_Banner_2_rxdvlk.png"
          alt="CLOTHI sustainable fashion brand story - coastal lifestyle apparel"
          fill
          sizes="100vw"
          className={styles.heroBg}
          priority
        />
        {/* <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.heroKicker}>OUR STORY</span>
          <h1 className={styles.heroTitle}>
            Crafted with Purpose,<br />
            <em>Worn with Pride</em>
          </h1>
          <p className={styles.heroSubtitle}>
            Where timeless design meets sustainable fashion
          </p>
        </div> */}
      </section>

      {/* Story Section */}
      <section className={styles.storySection} aria-labelledby="story-title">
        <div className={styles.storyInner}>
          <div className={styles.storyContent}>
            <span className="section-label">THE CLOTHI STORY</span>

            <p className={styles.introText}>
              In a world where fashion moves faster than ever, many men are left with more choices but less clarity. Trends change constantly, wardrobes grow larger, yet getting dressed often feels no easier.
            </p>

            <blockquote className={styles.storyQuote}>
              &ldquo;We saw an opportunity to approach things differently.&rdquo;
            </blockquote>

            <p className={styles.storyText}>
              Rather than creating clothing that follows the moment, we set out to build a brand rooted in timeless principles—simplicity, versatility, confidence, and thoughtful design.
            </p>

            <p className={styles.storyText}>
              At Clothi, we believe great style isn&apos;t about owning more. It&apos;s about understanding what works. The right pieces, chosen with intention, can create a wardrobe that feels effortless, adaptable, and enduring.
            </p>

            <p className={styles.storyText}>
              Every decision we make is guided by this philosophy. From design and craftsmanship to the way we communicate style, our goal is to help people move beyond trends and build confidence through clarity.
            </p>

            <div className={styles.poeticSection}>
              <p className={styles.poeticIntro}>Because real style isn&apos;t loud.</p>
              <ul className={styles.poeticList}>
                <li>It&apos;s calm.</li>
                <li>It&apos;s considered.</li>
                <li>It&apos;s personal.</li>
              </ul>
              <p className={styles.poeticOutro}>And above all, it&apos;s intentional.</p>
            </div>

            <div className={styles.signatureBlock}>
              <span className={styles.sigBrand}>Clothi.</span>
              <span className={styles.sigTagline}>Style Through Intention.</span>
            </div>
          </div>
          <div className={styles.storyImage}>
            <Image
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="CLOTHI artisan workshop - sustainable clothing production"
              sizes="(max-width: 768px) 100vw, 50vw"
              width={800}
              height={1000}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection} aria-label="Company statistics">
        <div className={styles.statsInner}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <span className={styles.statNumber}>{stat.number}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className={styles.valuesSection} aria-labelledby="philosophy-title">
        <div className={styles.valuesInner}>
          <div className={styles.valuesHeader}>
            <span className="section-label">OUR PHILOSOPHY</span>
            <h2 id="philosophy-title" className={styles.valuesTitle}>
              Style, Simplified.
            </h2>
            <p className={styles.valuesSubtitle}>
              We believe great style doesn&apos;t require complexity. It requires thoughtful design, quality craftsmanship, and pieces you&apos;ll reach for every day.
            </p>
          </div>
          <div className={styles.valuesGrid}>
            {values.map((value, index) => (
              <article key={index} className={styles.valueCard}>
                <div className={styles.valueIcon} aria-hidden="true">
                  <value.icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className={styles.valueCardTitle}>{value.title}</h3>
                <p className={styles.valueCardText}>{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={styles.teamSection} aria-labelledby="team-title">
        <div className={styles.teamInner}>
          <div className={styles.teamHeader}>
            <span className="section-label">OUR TEAM</span>
            <h2 id="team-title" className={styles.teamTitle}>
              The people behind CLOTHI
            </h2>
          </div>
          <div className={styles.teamGrid}>
            {team.map((member, index) => (
              <article key={index} className={styles.teamCard}>
                <div className={styles.teamImage}>
                  <Image
                    src={member.image}
                    alt={`${member.name} - ${member.role} at CLOTHI`}
                    sizes="(max-width: 768px) 50vw, 25vw"
                    width={400}
                    height={400}
                  />
                </div>
                <h3 className={styles.teamName}>{member.name}</h3>
                <p className={styles.teamRole}>{member.role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection} aria-label="Our commitments">
        <div className={styles.featuresInner}>
          {features.map((feature, index) => (
            <article key={index} className={styles.featureCard}>
              <div className={styles.featureIcon} aria-hidden="true">
                <feature.icon size={24} strokeWidth={1.5} />
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureText}>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection} aria-labelledby="cta-title">
        <Image
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Join the sustainable fashion movement"
          fill
          sizes="100vw"
          className={styles.ctaBg}
        />
        <div className={styles.ctaOverlay} />
        <div className={styles.ctaContent}>
          <h2 id="cta-title" className={styles.ctaTitle}>Join the Movement</h2>
          <p className={styles.ctaText}>
            Discover our latest collection and become part of the sustainable fashion revolution.
          </p>
          <div className={styles.ctaActions}>
            <Link href="/catalog">
              <button className={styles.ctaBtn}>SHOP NOW</button>
            </Link>
            <Link href="/catalog">
              <button className={styles.ctaBtnOutline}>NEW ARRIVALS</button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
