'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  User, 
  Search, 
  Menu, 
  X,
  ChevronRight,
  ChevronDown,
  Heart,
  Package,
  Settings,
  LogOut,
  Home,
  Instagram,
  Facebook,
  Youtube
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import CartDropdown from '../CartDropdown/CartDropdown';
import SearchDropdown from '../SearchDropdown/SearchDropdown';
import { getCollections } from '../../lib/api-collections';
import styles from './Navbar.module.css';

const searchHints = ['POLO', 'OVERSIZE', 'CASUAL', 'DRY-FIT'];



const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchHintIndex, setSearchHintIndex] = useState(0);
  const [searchHintText, setSearchHintText] = useState('');
  const [isHintDeleting, setIsHintDeleting] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategories, setMobileCategories] = useState([]);
  const userMenuRef = useRef(null);
  const cartDropdownRef = useRef(null);
  const searchContainerRef = useRef(null);
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

  // Fetch collections
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await getCollections(1, 10);
        if (res.success && res.data && res.data.length > 0) {
          // Use all available collections from the DB
          const mapped = res.data.map(c => ({
            name: c.name,
            href: `/collections/${c.slug}`,
            image: c.images?.[0]?.url || '/collection_duo.png'
          }));
          setMobileCategories(mapped);
        } else {
          // Fallback if DB is empty
          setMobileCategories([
            { name: 'POLO', href: '/collections/polo', image: '/collection_duo.png' },
            { name: 'OVERSIZE', href: '/collections/oversize', image: '/collection_duo.png' },
            { name: 'CASUAL', href: '/collections/casual', image: '/collection_duo.png' },
            { name: 'DRY-FIT', href: '/collections/dry-fit', image: '/collection_duo.png' },
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch mobile categories:', err);
      }
    };
    fetchCollections();
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.documentElement.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Handle scroll for navbar transparency effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchValue.trim().length > 0) {
      setIsHintDeleting(false);
    }
  }, [searchValue]);

  useEffect(() => {
    if (searchValue.trim().length > 0) {
      return;
    }

    const currentHint = searchHints[searchHintIndex % searchHints.length];

    if (!isHintDeleting && searchHintText.length < currentHint.length) {
      const timer = setTimeout(() => {
        setSearchHintText(currentHint.slice(0, searchHintText.length + 1));
      }, 110);
      return () => clearTimeout(timer);
    }

    if (!isHintDeleting && searchHintText.length === currentHint.length) {
      const timer = setTimeout(() => {
        setIsHintDeleting(true);
      }, 900);
      return () => clearTimeout(timer);
    }

    if (isHintDeleting && searchHintText.length > 0) {
      const timer = setTimeout(() => {
        setSearchHintText(currentHint.slice(0, searchHintText.length - 1));
      }, 60);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setIsHintDeleting(false);
      setSearchHintIndex((prev) => (prev + 1) % searchHints.length);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchHintIndex, searchHintText, isHintDeleting, searchValue]);

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
    <>
      <nav
        className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}
        onMouseLeave={() => setActiveMenu(null)}
      >
         <div className={styles.inner}>
            <div className={styles.left}>
              <button 
                className={styles.mobileMenuBtn}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
              </button>
              <Link href="/" className={styles.brand}>
                <img src="/Logo.png" alt="Clothi Logo" className={styles.logo} />
                <span className={styles.brandText}>CLOTHI</span>
              </Link>
            </div>
            
            <div className={styles.center}>
              <ul className={styles.navLinks}>
                <li><Link href="/catalog" className={`${styles.navLink} ${isScrolled ? styles.navLinkScrolled : ''}`}>SHOP ALL</Link></li>
                <li><Link href="/catalog?category=POLO" className={`${styles.navLink} ${isScrolled ? styles.navLinkScrolled : ''}`}>POLO</Link></li>
                <li><Link href="/catalog?category=OVERSIZE" className={`${styles.navLink} ${isScrolled ? styles.navLinkScrolled : ''}`}>OVERSIZE</Link></li>
                <li><Link href="/catalog?category=CASUAL" className={`${styles.navLink} ${isScrolled ? styles.navLinkScrolled : ''}`}>CASUAL</Link></li>
                <li><Link href="/catalog?category=DRY-FIT" className={`${styles.navLink} ${isScrolled ? styles.navLinkScrolled : ''}`}>DRY-FIT</Link></li>
              </ul>
            </div>

            <div className={styles.right}>
              <div className={styles.searchContainer} ref={searchContainerRef}>
                <div 
                  className={styles.searchBox}
                  onClick={() => setSearchOpen(true)}
                >
                  <Search size={16} strokeWidth={1.5} color="var(--color-outline)" />
                  <input 
                    type="text"
                    className={styles.searchInput}
                    placeholder={searchHintText || 'Search...'}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onFocus={() => setSearchOpen(true)}
                  />
                </div>
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
{user.role === 'admin' && (
                      <>
                        <Link 
                          href="/admin/products" 
                          className={styles.userDropdownItem}
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Package size={16} strokeWidth={1.5} />
                          <span>Manage Products</span>
                        </Link>
                        <Link 
                          href="/admin/collections" 
                          className={styles.userDropdownItem}
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Package size={16} strokeWidth={1.5} />
                          <span>Manage Collections</span>
                        </Link>
                      </>
                    )}
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
    </nav>
    
    <div 
      className={`${styles.mobileMenuOverlay} ${mobileMenuOpen ? styles.open : ''}`}
      onClick={() => setMobileMenuOpen(false)}
    />
    <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.open : ''}`}>
      <div className={styles.mobileImageGrid}>
        {mobileCategories.map((cat, index) => (
          <Link 
            key={index} 
            href={cat.href} 
            className={styles.mobileImageCard}
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className={styles.mobileImageWrap}>
              <img src={cat.image} alt={cat.name} className={styles.mobileImage} />
            </div>
            <span className={styles.mobileImageText}>{cat.name}</span>
          </Link>
        ))}
      </div>

      <ul className={styles.mobileMenuLinks}>
        {mobileCategories.map((cat, index) => (
          <li key={index}><Link href={cat.href} onClick={() => setMobileMenuOpen(false)}>{cat.name}</Link></li>
        ))}
      </ul>
      
      {/* MOBILE FOOTER */}
      <div className={styles.mobileDrawerFooter}>
        <div className={styles.mobileSocials}>
          <a href="#" target="_blank" rel="noreferrer" aria-label="Instagram">
            <Instagram size={20} strokeWidth={1.5} />
          </a>
          <a href="#" target="_blank" rel="noreferrer" aria-label="Facebook">
            <Facebook size={20} strokeWidth={1.5} />
          </a>
          <a href="#" target="_blank" rel="noreferrer" aria-label="YouTube">
            <Youtube size={20} strokeWidth={1.5} />
          </a>
        </div>
        
        <Link 
          href={user ? "/account" : "/login"} 
          className={styles.mobileLoginLink}
          onClick={() => setMobileMenuOpen(false)}
        >
          <User size={18} strokeWidth={1.5} />
          <span>{user ? "My Account" : "Log in"}</span>
        </Link>
      </div>
    </div>
    <SearchDropdown 
      isOpen={searchOpen} 
      onClose={() => setSearchOpen(false)}
      externalSearchQuery={searchValue}
      setExternalSearchQuery={setSearchValue}
    />

    {/* Mobile Bottom Bar — Snitch style */}
    <div className={styles.mobileBottomBar}>
      <Link href="/" className={styles.bottomBarItem}>
        <Home size={22} strokeWidth={1.5} />
        <span>Home</span>
      </Link>
      <button 
        className={styles.bottomBarItem}
        onClick={() => setSearchOpen(true)}
      >
        <Search size={22} strokeWidth={1.5} />
        <span>Search</span>
      </button>
      <Link href="/favorites" className={styles.bottomBarItem}>
        <div className={styles.bottomBarIconWrap}>
          <Heart size={22} strokeWidth={1.5} />
          {favoritesCount > 0 && (
            <span className={styles.bottomBarBadge}>{favoritesCount}</span>
          )}
        </div>
        <span>Wishlist</span>
      </Link>
      <Link href={user ? "/account" : "/login"} className={styles.bottomBarItem}>
        <User size={22} strokeWidth={1.5} />
        <span>{user ? "Account" : "Log in"}</span>
      </Link>
      <button 
        className={styles.bottomBarItem}
        onClick={() => setCartDropdownOpen(!cartDropdownOpen)}
      >
        <div className={styles.bottomBarIconWrap}>
          <ShoppingBag size={22} strokeWidth={1.5} />
          {cartItemCount > 0 && (
            <span className={styles.bottomBarBadge}>{cartItemCount}</span>
          )}
        </div>
        <span>Bag</span>
      </button>
    </div>
    </>
  );
};

export default Navbar;
