import Link from 'next/link';
import { ChevronRight, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <>
      <div className={styles.benefitsRow}>
        <div className={styles.benefitsInner}>
          <div className={styles.benefitItem}>
            <img src="https://fahertybrand.com/cdn/shop/files/Faherty_Truck_Illustration_1A.png?v=1744913088" className={styles.benefitIcon} alt="Free Shipping" />
            <h4 className={styles.benefitTitle}>Free Shipping</h4>
            <span className={styles.benefitSub}>*US domestic orders $150+</span>
          </div>
          <div className={styles.benefitItem}>
            <img src="https://fahertybrand.com/cdn/shop/files/Faherty_Venice_Storefront_Illustration_1F.png?v=1744913166" className={styles.benefitIcon} alt="Find a Store" />
            <h4 className={styles.benefitTitle}>Find a Store</h4>
            <Link href="/" className={styles.benefitLink}>Visit Us</Link>
          </div>
          <div className={styles.benefitItem}>
            <img src="https://fahertybrand.com/cdn/shop/files/Faherty_Shipping_Box_Illustration.png?v=1744913451" className={styles.benefitIcon} alt="Returns & Exchanges" />
            <h4 className={styles.benefitTitle}>Returns &amp; Exchanges</h4>
            <Link href="/" className={styles.benefitLink}>Learn More</Link>
          </div>
          <div className={styles.benefitItem}>
            <img src="https://fahertybrand.com/cdn/shop/files/Faherty_Guarantee_Badge_1A.png?v=1744913580" className={styles.benefitIcon} alt="Guarantee of Quality" />
            <h4 className={styles.benefitTitle}>Guarantee of Quality</h4>
            <Link href="/" className={styles.benefitLink}>Learn More</Link>
          </div>
        </div>
      </div>
      
      <footer className={styles.footer}>
        <div className={styles.footerBgWrapper}>
          <img src="/footer_bg.png" className={styles.footerBg} alt="ocean waves" />
          <div className={styles.footerOverlay}></div>
        </div>

        <div className={styles.footerContent}>
          {/* Newsletter Area */}
          <div className={styles.newsletterArea}>
            <div className={styles.newsletterLeft}>
              <div className={styles.brandSun}>
                <svg viewBox="0 0 100 50" fill="none" className={styles.sunIcon}>
                  <path d="M50 40 A 20 20 0 0 0 50 10 A 20 20 0 0 0 50 40 Z" fill="white" />
                  <path d="M50 50 L50 40 M20 40 L30 40 M80 40 L70 40 M25 15 L35 25 M75 15 L65 25 M50 0 L50 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  <path d="M10 45 Q30 35 50 45 T90 45" stroke="white" strokeWidth="4" fill="none" />
                </svg>
              </div>
              <div className={styles.nlText}>
                <h3 className={styles.nlTitle}>Stay Notified</h3>
                <p className={styles.nlDesc}>Get 15% off your first online purchase when you sign up!</p>
              </div>
            </div>
            <div className={styles.newsletterRight}>
              <div className={styles.emailRow}>
                <input type="email" placeholder="Your Email Address" className={styles.emailInput} />
                <button className={styles.emailBtn}><ChevronRight size={18} /></button>
              </div>
            </div>
          </div>

          {/* Main Links Area */}
          <div className={styles.mainLinksArea}>
            <div className={styles.mainLinksLeft}>
              <div className={styles.bcorp}>
                <div className={styles.bcorpIcon}>
                  <span>B</span>
                </div>
                <span className={styles.bcorpText}>Corporation</span>
              </div>
              <div className={styles.contactInfo}>
                <div className={styles.contactRow}>
                  <span className={styles.contactLabel}>Phone</span>
                  <span className={styles.contactVal}>(877) 745-8994</span>
                </div>
                <div className={styles.contactRow}>
                  <span className={styles.contactLabel}>Hours</span>
                  <span className={styles.contactVal}>
                    Monday - Friday: 10am - 7pm EST<br/>
                    Saturday - Sunday: 11am - 8pm EST
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.mainLinksRight}>
              <ul className={styles.colList}>
                <li><Link href="/">Contact Us</Link></li>
                <li><Link href="/">Account Login</Link></li>
                <li><Link href="/">FAQs</Link></li>
                <li><Link href="/">Gift Card</Link></li>
                <li><Link href="/">Returns</Link></li>
                <li><Link href="/">Catalog Subscription</Link></li>
                <li><Link href="/">Accessibility Statement</Link></li>
                <li><Link href="/">Terms of Use</Link></li>
                <li><Link href="/">CA Notice of Financial Incentive</Link></li>
                <li><Link href="/">Clothi Perks Terms</Link></li>
              </ul>
              <ul className={styles.colList}>
                <li><Link href="/">About Us</Link></li>
                <li><Link href="/">Impact</Link></li>
                <li><Link href="/">♻ Resale</Link></li>
                <li><Link href="/">Native Initiatives</Link></li>
                <li><Link href="/">Journal</Link></li>
                <li><Link href="/">Affiliate</Link></li>
                <li><Link href="/">Stores</Link></li>
                <li><Link href="/">Careers</Link></li>
                <li><Link href="/">Wholesale &amp; Corporate Inquiries</Link></li>
              </ul>
            </div>
          </div>

          {/* Need Help Buttons */}
          <div className={styles.needHelpArea}>
            <h4 className={styles.needHelpTitle}>NEED HELP?</h4>
            <div className={styles.helpBtns}>
              <Link href="/" className={styles.helpBtn}>FIND A STORE</Link>
              <Link href="/" className={styles.helpBtn}>RETURNS &amp; EXCHANGES</Link>
              <Link href="/" className={styles.helpBtn}>CHECK ORDER STATUS</Link>
            </div>
          </div>

          {/* Big Watermark Logo & Mission */}
          <div className={styles.missionArea}>
            <h2 className={styles.watermarkLogo}>CLOTHI</h2>
            <p className={styles.missionText}>
              Clothi is committed to sustainability, ethical manufacturing and premium materials, creating comfort-first apparel designed with longevity and environmental responsibility in mind.
            </p>
          </div>
        </div>
      </footer>

      {/* Solid Black Bottom Bar */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomBarInner}>
          <div className={styles.socialIcons}>
            <Link href="/" className={styles.socialIcon}><Instagram size={28} strokeWidth={1.5} /></Link>
            <Link href="/" className={styles.socialIcon}><Facebook size={28} strokeWidth={1.5} /></Link>
            <Link href="/" className={styles.socialIcon}><Twitter size={28} strokeWidth={1.5} /></Link>
            <Link href="/" className={styles.socialIcon}><Linkedin size={28} strokeWidth={1.5} /></Link>
          </div>
          <div className={styles.legalLinks}>
            <Link href="/">Accessibility</Link>
            <Link href="/">Privacy Policy</Link>
            <Link href="/">U.S. State Privacy Notice</Link>
            <span>© {new Date().getFullYear()} Clothi Brand.</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
