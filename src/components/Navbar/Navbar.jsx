'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  User, 
  Search, 
  Menu, 
  X,
  ChevronRight,
  ChevronDown,
  Package,
  Settings,
  LogOut,
  Home,
  Instagram,
  Facebook,
  Youtube,
  Megaphone,
  ArrowLeft
} from 'lucide-react';
import HeartIcon from '../HeartIcon/HeartIcon';
import ShoppingBagIcon from '../ShoppingBagIcon/ShoppingBagIcon';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import CartDropdown from '../CartDropdown/CartDropdown';
import SearchDropdown from '../SearchDropdown/SearchDropdown';
import LoginModal from '../LoginModal/LoginModal';
import { getCollections } from '../../lib/api-collections';
import AnnouncementBar from '../AnnouncementBar/AnnouncementBar';
import styles from './Navbar.module.css';

const searchHints = ['POLO', 'OVERSIZE', 'CASUAL', 'DRY-FIT'];



const Navbar = ({ initialAnnouncements }) => {
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
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [mobileCategories, setMobileCategories] = useState([]);
  const [avatarError, setAvatarError] = useState(false);
  const userMenuRef = useRef(null);
  const cartDropdownRef = useRef(null);
  const searchContainerRef = useRef(null);
  const { user, logout, loading } = useAuth();
  const { cart } = useCart();
  const { favorites } = useFavorites();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setAvatarError(false);
  }, [user]);

  const [isMobile, setIsMobile] = useState(false);
  const [collectionProductCount, setCollectionProductCount] = useState(0);

  const isCollectionPage = pathname?.startsWith('/collections/');
  const parts = pathname ? pathname.split('/') : [];
  const slug = parts.length > 0 ? parts[parts.length - 1] || parts[parts.length - 2] : '';

  const getCollectionTitle = (slugStr) => {
    if (!slugStr) return '';
    const mapping = {
      'polo': 'POLO',
      'oversize': 'OVERSIZE',
      'casual': 'CASUAL',
      'dry-fit': 'DRY-FIT',
      'dryfit': 'DRY-FIT',
    };
    if (mapping[slugStr.toLowerCase()]) {
      return mapping[slugStr.toLowerCase()];
    }
    return slugStr
      .replace(/-/g, ' ')
      .toUpperCase();
  };
  const collectionTitle = getCollectionTitle(slug);

  // Resize listener for mobile viewport
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Event listener for product count from CatalogClient
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleCountUpdate = (e) => {
      if (e.detail && typeof e.detail.count === 'number') {
        setCollectionProductCount(e.detail.count);
      }
    };
    window.addEventListener('clothi-collection-count', handleCountUpdate);
    return () => window.removeEventListener('clothi-collection-count', handleCountUpdate);
  }, []);

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
          // Use all available collections from the DB, mapped to Clothi Studio images where applicable
          const mapped = res.data.map(c => {
            let imgUrl = c.images?.[0]?.url || '/collection_duo.png';
            const slug = (c.slug || '').toLowerCase();
            const name = (c.name || '').toLowerCase();
            
            if (slug.includes('polo') || name.includes('polo')) {
              imgUrl = 'https://res.cloudinary.com/dsrht8rss/image/upload/v1776511418/Polo_Clothi_Studio_j8t7me.jpg';
            } else if (slug.includes('oversize') || name.includes('oversize') || name.includes('zen-g')) {
              imgUrl = 'https://res.cloudinary.com/dsrht8rss/image/upload/v1776511418/Zen_G_clothi_studio_nznlvh.jpg';
            } else if (slug.includes('casual') || name.includes('casual') || slug.includes('basics') || name.includes('basics') || name.includes('prime')) {
              imgUrl = 'https://res.cloudinary.com/dsrht8rss/image/upload/v1776511417/Prime_Basics_clothi_studio_al7nwt.jpg';
            } else if (slug.includes('dry-fit') || slug.includes('dryfit') || name.includes('dry-fit') || name.includes('dryfit') || name.includes('motion')) {
              imgUrl = 'https://res.cloudinary.com/dsrht8rss/image/upload/v1776511418/Dryfit_clothi_studio_srnrfx.jpg';
            }
            
            return {
              name: c.name,
              href: `/collections/${c.slug}`,
              image: imgUrl
            };
          });
          setMobileCategories(mapped);
        } else {
          // Fallback with Clothi Studio images if DB is empty
          setMobileCategories([
            { name: 'POLO', href: '/collections/polo', image: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1776511418/Polo_Clothi_Studio_j8t7me.jpg' },
            { name: 'OVERSIZE', href: '/collections/oversize', image: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1776511418/Zen_G_clothi_studio_nznlvh.jpg' },
            { name: 'CASUAL', href: '/collections/casual', image: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1776511417/Prime_Basics_clothi_studio_al7nwt.jpg' },
            { name: 'DRY-FIT', href: '/collections/dry-fit', image: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1776511418/Dryfit_clothi_studio_srnrfx.jpg' },
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

  const hasAnnouncements = initialAnnouncements && initialAnnouncements.length > 0;

  return (
    <>
      <nav
        className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''} ${!hasAnnouncements ? styles.noAnnouncements : ''}`}
        onMouseLeave={() => setActiveMenu(null)}
        aria-label="Main navigation"
      >
         <AnnouncementBar initialAnnouncements={initialAnnouncements} isScrolled={isScrolled} />
         {isMobile && isCollectionPage ? (
            <div className={styles.innerCollection}>
               {/* Left: Back button */}
               <button onClick={() => router.back()} className={styles.backBtn} aria-label="Go back">
                 <ArrowLeft size={22} strokeWidth={1.5} />
               </button>
               {/* Center: Collection Name */}
               <div className={styles.collectionTitleWrap}>
                 <h1 className={styles.collectionTitle}>
                   {collectionTitle}
                   {collectionProductCount > 0 && (
                     <span className={styles.collectionCount}> ({collectionProductCount})</span>
                   )}
                 </h1>
               </div>
               {/* Right: Wishlist & Bag */}
               <div className={styles.rightActions}>
                 {/* Favorites Button */}
                 <Link href="/favorites" className={styles.iconBtn}>
                   <span className={styles.iconWrap}>
                     <HeartIcon size={20} strokeWidth={1.5} />
                     {favoritesCount > 0 && (
                       <span className={styles.badge}>{favoritesCount}</span>
                     )}
                   </span>
                 </Link>
                 
                 {/* Cart Button */}
                 <div className={styles.cartMenuWrap} ref={cartDropdownRef}>
                   <button 
                     className={styles.iconBtn}
                     onClick={() => setCartDropdownOpen(!cartDropdownOpen)}
                     aria-expanded={cartDropdownOpen}
                     aria-haspopup="true"
                   >
                     <span className={styles.iconWrap}>
                       <ShoppingBagIcon size={24} strokeWidth={1.5} />
                       <span className={styles.badge}>{cartItemCount || 0}</span>
                     </span>
                   </button>
                   {!isMobile && (
                     <CartDropdown 
                       isOpen={cartDropdownOpen} 
                       onClose={() => setCartDropdownOpen(false)} 
                     />
                   )}
                 </div>
               </div>
            </div>
         ) : (
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
               <span className={styles.iconWrap}>
                 <HeartIcon size={20} strokeWidth={1.5} />
                 {favoritesCount > 0 && (
                   <span className={styles.badge}>{favoritesCount}</span>
                 )}
               </span>
             </Link>

             {/* Cart Button with Dropdown */}
             <div className={styles.cartMenuWrap} ref={cartDropdownRef}>
               <button 
                 className={styles.iconBtn}
                 onClick={() => setCartDropdownOpen(!cartDropdownOpen)}
                 aria-expanded={cartDropdownOpen}
                 aria-haspopup="true"
               >
                 <span className={styles.iconWrap}>
                   <ShoppingBagIcon size={24} strokeWidth={1.5} />
                   <span className={styles.badge}>{cartItemCount || 0}</span>
                 </span>
               </button>
               <CartDropdown 
                 isOpen={cartDropdownOpen} 
                 onClose={() => setCartDropdownOpen(false)} 
               />
             </div>

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
                    {user.avatar && !avatarError ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className={styles.avatarImg} 
                        onError={() => setAvatarError(true)}
                      />
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
                           <Link 
                             href="/admin/announcements" 
                             className={styles.userDropdownItem}
                             onClick={() => setUserMenuOpen(false)}
                           >
                             <Megaphone size={16} strokeWidth={1.5} />
                             <span>Manage Announcements</span>
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
               <button onClick={() => setLoginModalOpen(true)} className={styles.iconBtn}>
                 <User size={20} strokeWidth={1.5} />
               </button>
             )}
           </div>
         </div>
         )}
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
        
        {user ? (
          <Link 
            href="/account" 
            className={styles.mobileLoginLink}
            onClick={() => setMobileMenuOpen(false)}
          >
            <User size={18} strokeWidth={1.5} />
            <span>My Account</span>
          </Link>
        ) : (
          <button 
            className={styles.mobileLoginLink}
            onClick={() => { setMobileMenuOpen(false); setLoginModalOpen(true); }}
          >
            <User size={18} strokeWidth={1.5} />
            <span>Log in</span>
          </button>
        )}
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
          <HeartIcon size={22} strokeWidth={1.5} />
          {favoritesCount > 0 && (
            <span className={styles.bottomBarBadge}>{favoritesCount}</span>
          )}
        </div>
        <span>Wishlist</span>
      </Link>
      <button 
        className={styles.bottomBarItem}
        onClick={() => setCartDropdownOpen(!cartDropdownOpen)}
      >
        <div className={styles.bottomBarIconWrap}>
          <ShoppingBagIcon size={26} strokeWidth={1.5} />
          <span className={styles.bottomBarBadge}>{cartItemCount || 0}</span>
        </div>
        <span>Bag</span>
      </button>
      {user ? (
        <Link href="/account" className={styles.bottomBarItem}>
          <User size={22} strokeWidth={1.5} />
          <span>Account</span>
        </Link>
      ) : (
        <button className={styles.bottomBarItem} onClick={() => setLoginModalOpen(true)}>
          <User size={22} strokeWidth={1.5} />
          <span>Log in</span>
        </button>
      )}
    </div>
    {isMobile && (
      <CartDropdown 
        isOpen={cartDropdownOpen} 
        onClose={() => setCartDropdownOpen(false)} 
      />
    )}
    <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  );
};

export default Navbar;
