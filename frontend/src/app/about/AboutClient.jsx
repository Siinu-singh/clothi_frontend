'use client';
import Link from 'next/link';
import { Leaf, Heart, Globe, Users, Award, Truck } from 'lucide-react';
import styles from './About.module.css';

const values = [
  {
    icon: Leaf,
    title: 'Sustainable Materials',
    description: 'We source organic cotton, recycled fibers, and eco-friendly fabrics to minimize our environmental footprint.',
  },
  {
    icon: Heart,
    title: 'Ethical Production',
    description: 'Every piece is crafted in fair-trade certified facilities where workers are treated with dignity and respect.',
  },
  {
    icon: Globe,
    title: 'Carbon Neutral',
    description: 'We offset 100% of our carbon emissions through verified environmental projects worldwide.',
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
    name: 'Sarah Chen',
    role: 'Founder & Creative Director',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Marcus Rivera',
    role: 'Head of Sustainability',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Emma Thompson',
    role: 'Lead Designer',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'David Park',
    role: 'Operations Director',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
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
        <img
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="CLOTHI sustainable fashion brand story - coastal lifestyle apparel"
          className={styles.heroBg}
          loading="eager"
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.heroKicker}>OUR STORY</span>
          <h1 className={styles.heroTitle}>
            Crafted with Purpose,<br />
            <em>Worn with Pride</em>
          </h1>
          <p className={styles.heroSubtitle}>
            Where timeless design meets sustainable fashion
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className={styles.storySection} aria-labelledby="story-title">
        <div className={styles.storyInner}>
          <div className={styles.storyContent}>
            <span className="section-label">THE CLOTHI STORY</span>
            <h2 id="story-title" className={styles.storyTitle}>
              Born from a simple belief: fashion should feel good in every way.
            </h2>
            <p className={styles.storyText}>
              CLOTHI was founded in 2019 with a mission to prove that style and sustainability 
              can coexist beautifully. What started as a small collection of thoughtfully designed 
              essentials has grown into a movement that celebrates conscious consumption.
            </p>
            <p className={styles.storyText}>
              We partner with artisan communities across the globe, honoring traditional 
              craftsmanship while embracing modern innovation. Every thread tells a story of 
              dedication, every stitch represents our commitment to a better future.
            </p>
            <p className={styles.storyText}>
              Today, CLOTHI stands at the intersection of timeless design and environmental 
              responsibility. We&apos;re not just making clothes—we&apos;re crafting a legacy of 
              mindful fashion that respects both people and planet.
            </p>
          </div>
          <div className={styles.storyImage}>
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="CLOTHI artisan workshop - sustainable clothing production"
              loading="lazy"
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
      <section className={styles.valuesSection} aria-labelledby="values-title">
        <div className={styles.valuesInner}>
          <div className={styles.valuesHeader}>
            <span className="section-label">OUR VALUES</span>
            <h2 id="values-title" className={styles.valuesTitle}>
              Fashion that cares
            </h2>
            <p className={styles.valuesSubtitle}>
              Sustainability isn&apos;t just a buzzword for us—it&apos;s woven into everything we do.
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
                  <img 
                    src={member.image} 
                    alt={`${member.name} - ${member.role} at CLOTHI`}
                    loading="lazy"
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
        <img
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Join the sustainable fashion movement"
          className={styles.ctaBg}
          loading="lazy"
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
