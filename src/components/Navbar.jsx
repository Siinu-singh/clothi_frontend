'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, Heart, User, ShoppingBag } from 'lucide-react';
import styles from './Navbar.module.css';

const megaMenuData = {
  Men: {
    columns: [
      {
        title: "MEN'S CLOTHES",
        links: [
          { label: "All Men's", href: '/catalog' },
          { label: 'Shirts', href: '/catalog' },
          { label: 'Pants', href: '/catalog' },
          { label: 'Sweaters', href: '/catalog' },
          { label: 'Outerwear', href: '/catalog' },
          { label: 'T-Shirts & Polos', href: '/catalog' },
          { label: 'Swim', href: '/catalog' },
          { label: 'Lounge', href: '/catalog' },
          { label: 'Shorts', href: '/catalog' },
          { label: 'Accessories', href: '/catalog' },
        ],
      },
      {
        title: 'FEATURED',
        links: [
          { label: 'New Arrivals', href: '/catalog' },
          { label: 'Best Sellers', href: '/catalog' },
          { label: 'The Resort Shop', href: '/catalog' },
          { label: 'Coastal Collection', href: '/catalog' },
          { label: 'The Stretch Terry Collection', href: '/catalog' },
          { label: 'The Reserve Collection', href: '/catalog' },
        ],
      },
      {
        title: "MEN'S ACCESSORIES",
        links: [
          { label: "All Men's Accessories", href: '/catalog' },
          { label: 'Hats', href: '/catalog' },
          { label: 'Belts', href: '/catalog' },
          { label: 'Shoes', href: '/catalog' },
          { label: 'Socks & Underwear', href: '/catalog' },
          { label: 'Sunglasses', href: '/catalog' },
          { label: 'Bags', href: '/catalog' },
        ],
      },
    ],
    promos: [
      { img: '/nav_promo_arrivals.png', label: 'NEW ARRIVALS' },
      { img: '/nav_promo_pants.png', label: "MEN'S PANT GUIDE" },
    ],
  },
  Women: {
    columns: [
      {
        title: "WOMEN'S CLOTHES",
        links: [
          { label: "All Women's", href: '/catalog' },
          { label: 'Dresses', href: '/catalog' },
          { label: 'Tops', href: '/catalog' },
          { label: 'Sweaters', href: '/catalog' },
          { label: 'Pants', href: '/catalog' },
          { label: 'Outerwear', href: '/catalog' },
          { label: 'Swim', href: '/catalog' },
          { label: 'Skirts', href: '/catalog' },
          { label: 'Accessories', href: '/catalog' },
        ],
      },
      {
        title: 'FEATURED',
        links: [
          { label: 'New Arrivals', href: '/catalog' },
          { label: 'Best Sellers', href: '/catalog' },
          { label: 'The Resort Shop', href: '/catalog' },
          { label: 'Coastal Collection', href: '/catalog' },
          { label: 'The Linen Edit', href: '/catalog' },
        ],
      },
      {
        title: "WOMEN'S ACCESSORIES",
        links: [
          { label: "All Women's Accessories", href: '/catalog' },
          { label: 'Jewelry', href: '/catalog' },
          { label: 'Hats', href: '/catalog' },
          { label: 'Shoes', href: '/catalog' },
          { label: 'Bags', href: '/catalog' },
        ],
      },
    ],
    promos: [
      { img: '/nav_promo_arrivals.png', label: 'NEW ARRIVALS' },
      { img: '/nav_promo_pants.png', label: "WOMEN'S LOOKBOOK" },
    ],
  },
};

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <nav
      className={styles.navbar}
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div className={styles.inner}>
        <div className={styles.left}>
          <Link href="/" className={styles.brand}>CLOTHI</Link>
          <div className={styles.navLinks}>
            {['Men', 'Women'].map(item => (
              <div
                key={item}
                className={styles.navItemWrap}
                onMouseEnter={() => setActiveMenu(item)}
              >
                <Link href="/catalog" className={`${styles.navLink} ${activeMenu === item ? styles.navLinkActive : ''}`}>
                  {item.toUpperCase()}
                </Link>
              </div>
            ))}
            <Link href="/catalog" className={styles.navLink}
              onMouseEnter={() => setActiveMenu(null)}>ACCESSORIES</Link>
            <Link href="/catalog" className={styles.navLink}
              onMouseEnter={() => setActiveMenu(null)}>SALE</Link>
            <Link href="/" className={styles.navLink}
              onMouseEnter={() => setActiveMenu(null)}>ABOUT</Link>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.searchBox}>
            <Search size={16} strokeWidth={1.5} color="var(--color-outline)" />
            <input className={styles.searchInput} type="text" placeholder="Search the store" />
          </div>
          <button className={styles.iconBtn}><Heart size={20} strokeWidth={1.5} /></button>
          <Link href="/login" className={styles.iconBtn}><User size={20} strokeWidth={1.5} /></Link>
          <button className={styles.iconBtn}><ShoppingBag size={20} strokeWidth={1.5} /></button>
        </div>
      </div>

      {/* Mega Dropdown */}
      {activeMenu && megaMenuData[activeMenu] && (
        <div
          className={styles.megaMenu}
          onMouseEnter={() => setActiveMenu(activeMenu)}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <div className={styles.megaInner}>
            <div className={styles.megaColumns}>
              {megaMenuData[activeMenu].columns.map((col, i) => (
                <div key={i} className={styles.megaCol}>
                  <h4 className={styles.megaColTitle}>{col.title}</h4>
                  <ul className={styles.megaList}>
                    {col.links.map((link, j) => (
                      <li key={j}>
                        <Link href={link.href} className={styles.megaLink}
                          onClick={() => setActiveMenu(null)}>{link.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className={styles.megaPromos}>
              {megaMenuData[activeMenu].promos.map((promo, i) => (
                <Link href="/catalog" key={i} className={styles.megaPromo}
                  onClick={() => setActiveMenu(null)}>
                  <img src={promo.img} alt={promo.label} />
                  <span className={styles.megaPromoLabel}>{promo.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
