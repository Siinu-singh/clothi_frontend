'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Heart, User, ShoppingBag, LogOut, Package, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import CartDropdown from './CartDropdown';
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
          { label: 'Coastal Vibes', href: '/catalog?collection=Coastal%20Vibes' },
          { label: 'The Indigo Edit', href: '/catalog?collection=The%20Indigo%20Edit' },
          { label: 'The Resort Shop', href: '/catalog' },
          { label: 'The Stretch Terry Collection', href: '/catalog' },
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
          { label: 'Summer Collection', href: '/catalog?collection=Summer%20Collection' },
          { label: 'Transitional Knits', href: '/catalog?collection=Transitional%20Knits' },
          { label: 'Artisan Crafted', href: '/catalog?collection=Artisan%20Crafted' },
          { label: 'The Resort Shop', href: '/catalog' },
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
  const userMenuRef = useRef(null);
  const cartDropdownRef = useRef(null);
  const { user, logout, loading } = useAuth();
  const { cart } = useCart();
  const { favorites } = useFavorites();
  const router = useRouter();

  // Calculate cart item count
  const cartItemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const favoritesCount = favorites?.length || 0;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target)) {
        setCartDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    router.push('/');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return '';
    const name = user.name || user.email || '';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

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
          
          {/* Favorites Button */}
          <Link href="/favorites" className={styles.iconBtn}>
            <Heart size={20} strokeWidth={1.5} />
            {favoritesCount > 0 && (
              <span className={styles.badge}>{favoritesCount}</span>
            )}
          </Link>

          {/* User Menu */}
          {loading ? (
            <div className={styles.iconBtn}>
              <div className={styles.avatarSkeleton} />
            </div>
          ) : user ? (
            <div className={styles.userMenuWrap} ref={userMenuRef}>
              <button 
                className={styles.avatarBtn}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className={styles.avatarImg} />
                ) : (
                  <span className={styles.avatarInitials}>{getUserInitials()}</span>
                )}
              </button>
              
              {userMenuOpen && (
                <div className={styles.userDropdown}>
                  <div className={styles.userDropdownHeader}>
                    <p className={styles.userName}>{user.name || 'User'}</p>
                    <p className={styles.userEmail}>{user.email}</p>
                  </div>
                  <div className={styles.userDropdownDivider} />
                  <Link 
                    href="/orders" 
                    className={styles.userDropdownItem}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Package size={16} strokeWidth={1.5} />
                    <span>My Orders</span>
                  </Link>
                  <Link 
                    href="/account" 
                    className={styles.userDropdownItem}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Settings size={16} strokeWidth={1.5} />
                    <span>Account Settings</span>
                  </Link>
                  <div className={styles.userDropdownDivider} />
                  <button 
                    className={styles.userDropdownItem}
                    onClick={handleLogout}
                  >
                    <LogOut size={16} strokeWidth={1.5} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className={styles.iconBtn}>
              <User size={20} strokeWidth={1.5} />
            </Link>
          )}

          {/* Cart Button with Dropdown */}
          <div className={styles.cartMenuWrap} ref={cartDropdownRef}>
            <button 
              className={styles.iconBtn}
              onClick={() => setCartDropdownOpen(!cartDropdownOpen)}
              aria-expanded={cartDropdownOpen}
              aria-haspopup="true"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartItemCount > 0 && (
                <span className={styles.badge}>{cartItemCount}</span>
              )}
            </button>
            <CartDropdown 
              isOpen={cartDropdownOpen} 
              onClose={() => setCartDropdownOpen(false)} 
            />
          </div>
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
