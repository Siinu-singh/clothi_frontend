'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ArrowLeft, Search as SearchIcon, X } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { useFavorites } from '../../context/FavoritesContext';
import styles from './SearchDropdown.module.css';

export default function SearchDropdown({ isOpen, onClose, externalSearchQuery, setExternalSearchQuery }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('');
  
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = setExternalSearchQuery || setInternalSearchQuery;
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const router = useRouter();
  const { addToFavorites, removeFromFavorites, isFavorited } = useFavorites();
  const dropdownRef = useRef(null);
  const gridWrapperRef = useRef(null);
  const inputRef = useRef(null);
  const isFetchingRef = useRef(false);

  const categories = ['', 'The Crown Series', 'Zen-G by Clothi', 'Motion X', 'Prime Basics'];
  const ITEMS_PER_PAGE = 8;
  
  const categoryToBackendMap = {
    'The Crown Series': 'POLO',
    'Zen-G by Clothi': 'OVERSIZE',
    'Motion X': 'DRY-FIT',
    'Prime Basics': 'CASUAL'
  };
  
  const topSearches = [
    'POLO', 'LINEN SHIRTS', 'WHITE SHIRT', 
    'BLACK SHIRT', 'FORMAL WEAR', 'BOOTCUT JEANS', 
    'BROWN SHIRT', 'PINK SHIRT', 'BAGGY JEANS', 'BLACK JEANS'
  ];

  useEffect(() => {
    if (isOpen) {
      setPage(1);
      setProducts([]);
      setHasMore(true);
      fetchProducts(activeCategory, 1, searchQuery);
      
      // Focus input when opened
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
      
      // Prevent body scroll — lock both html and body to keep sticky navbar in place
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
    
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isOpen, activeCategory]);

  // Debounced search
  useEffect(() => {
    if (!isOpen) return;
    
    const timeoutId = setTimeout(() => {
      setPage(1);
      setProducts([]);
      setHasMore(true);
      fetchProducts(activeCategory, 1, searchQuery);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingRef.current && !loading) {
          fetchMoreProducts(activeCategory, page + 1, searchQuery);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isLoadingMore, loading, activeCategory, searchQuery, page]);

  const fetchProducts = async (category, pageNum, search) => {
    if (isFetchingRef.current) return;
    try {
      isFetchingRef.current = true;
      setLoading(true);
      let url = `/products?limit=${ITEMS_PER_PAGE}&page=${pageNum}&sortBy=popular`;
      if (category && categoryToBackendMap[category]) {
        url += `&category=${encodeURIComponent(categoryToBackendMap[category])}`;
      }
      if (search) url += `&search=${encodeURIComponent(search)}`;
      
      const response = await apiFetch(url);
      const newProducts = response.data?.products || response.products || [];
      setProducts(newProducts);
      setPage(pageNum);
      setHasMore(newProducts.length === ITEMS_PER_PAGE);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  const fetchMoreProducts = async (category, pageNum, search) => {
    if (isFetchingRef.current) return;
    try {
      isFetchingRef.current = true;
      setIsLoadingMore(true);
      let url = `/products?limit=${ITEMS_PER_PAGE}&page=${pageNum}&sortBy=popular`;
      if (category && categoryToBackendMap[category]) {
        url += `&category=${encodeURIComponent(categoryToBackendMap[category])}`;
      }
      if (search) url += `&search=${encodeURIComponent(search)}`;
      
      const response = await apiFetch(url);
      const newProducts = response.data?.products || response.products || [];
      
      const existingIds = new Set(products.map(p => p._id));
      const uniqueNew = newProducts.filter(p => !existingIds.has(p._id));
      
      setProducts(prev => [...prev, ...uniqueNew]);
      setPage(pageNum);
      
      // Stop fetching if the API returns no new unique products to prevent infinite loops
      setHasMore(newProducts.length === ITEMS_PER_PAGE && uniqueNew.length > 0);
    } catch (err) {
      console.error('Failed to fetch more products:', err);
      // Disable further fetching if we hit an error (like 429) to prevent infinite error loops
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
      isFetchingRef.current = false;
    }
  };

  const handleToggleFavorite = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (isFavorited(productId)) {
        await removeFromFavorites(productId);
      } else {
        await addToFavorites(productId);
      }
    } catch (err) {
      console.error('Failed to update favorites:', err);
    }
  };

  const handleTagClick = (tag) => {
     setSearchQuery(tag);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (inputRef.current) inputRef.current.focus();
  };

  if (!isOpen) return null;

  const getColorsCount = (product) => {
      return product.colors?.length || Math.floor(Math.random() * 3) + 1;
  };

  return (
    <div className={styles.overlay} onClick={onClose} ref={dropdownRef}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Mobile Search Header (hidden on desktop via CSS) */}
        <div className={styles.header}>
          <button className={styles.backButton} onClick={onClose}>
            <ArrowLeft size={22} strokeWidth={2} />
          </button>
          <div className={styles.searchInputWrapper}>
            <SearchIcon size={18} strokeWidth={1.5} className={styles.searchIcon} />
            <input 
              ref={inputRef}
              type="text" 
              className={styles.searchInput} 
              placeholder="Search" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button className={styles.clearButton} onClick={handleClearSearch}>
                <X size={18} strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>

        <div className={styles.inner}>
          {/* Left Column — Desktop only (hidden on mobile via CSS) */}
          <div className={styles.leftColumn}>
            <h3 className={styles.sectionTitle}>TOP SEARCHES</h3>
            <div className={styles.tagsGrid}>
              {topSearches.map(tag => (
                <button 
                  key={tag} 
                  className={styles.tagButton}
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column — Products + Categories */}
          <div className={styles.rightColumn}>
            <h3 className={styles.sectionTitle}>TRENDING</h3>
            <div className={styles.categoriesRow}>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`${styles.categoryPill} ${activeCategory === cat ? styles.categoryPillActive : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat || 'All'}
                </button>
              ))}
            </div>

            <div className={styles.productGridWrapper}>
              {products.length === 0 && !loading && (
                <div className={styles.noResults}>
                  No products found for &ldquo;{searchQuery || activeCategory || 'All'}&rdquo;
                </div>
              )}
              
              <div className={styles.productGrid}>
                {loading && products.length === 0 ? (
                  [...Array(4)].map((_, i) => (
                    <div key={i} className={styles.skeletonCard}>
                      <div className={styles.skeletonImage}></div>
                      <div className={styles.skeletonText}></div>
                      <div className={`${styles.skeletonText} ${styles.skeletonTextShort}`}></div>
                    </div>
                  ))
                ) : (
                  <>
                    {products.map(p => (
                      <Link href={`/product/${p._id}`} key={p._id} className={styles.productCard} onClick={onClose}>
                        <div className={styles.imageWrapper}>
                          <img 
                            src={p.images?.[0] || p.image} 
                            alt={p.title} 
                            className={styles.productImage} 
                          />
                          <button 
                            className={`${styles.wishlistBtn} ${isFavorited(p._id) ? styles.wishlistBtnActive : ''}`}
                            onClick={(e) => handleToggleFavorite(e, p._id)}
                          >
                            <Heart 
                              size={18} 
                              strokeWidth={1.5} 
                              fill={isFavorited(p._id) ? 'currentColor' : 'none'}
                            />
                          </button>
                        </div>
                        <div className={styles.productInfo}>
                          <h4 className={styles.productTitle}>{p.title}</h4>
                          <p className={styles.productPrice}>₹{p.price?.toFixed(0) || '0'}</p>
                          <div className={styles.colorSwatches}>
                            <div className={styles.swatch} style={{backgroundColor: '#e5e5e5'}}></div>
                            <div className={styles.swatch} style={{backgroundColor: '#303030'}}></div>
                            {getColorsCount(p) > 2 && (
                              <span className={styles.swatchCount}>+{getColorsCount(p) - 2}</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                    {isLoadingMore && (
                      <>
                        {[...Array(2)].map((_, i) => (
                          <div key={`skeleton-${i}`} className={styles.skeletonCard}>
                            <div className={styles.skeletonImage}></div>
                            <div className={styles.skeletonText}></div>
                            <div className={`${styles.skeletonText} ${styles.skeletonTextShort}`}></div>
                          </div>
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>
              
              {/* Infinite scroll trigger */}
              {hasMore && !loading && (
                <div ref={observerTarget} style={{ height: '20px', width: '100%', marginTop: '10px' }} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
