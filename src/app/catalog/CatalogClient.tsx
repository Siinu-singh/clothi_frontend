'use client';
import { useState, useEffect, useRef } from 'react';
import { Filter, ArrowUpDown, X } from 'lucide-react';
import { useCatalogProducts, CATEGORIES, SIZES, SORT_OPTIONS } from './hooks/useCatalogProducts';
import CatalogGrid from './CatalogGrid';
import styles from './Catalog.module.css';

// ---------------------------------------------------------------------------
// Mobile Filter Drawer
// ---------------------------------------------------------------------------

interface FilterDrawerProps {
  categories: string[];
  sizes: string[];
  selectedCategory: string;
  selectedSize: string;
  categoryProp: string;
  onCategory: (cat: string) => void;
  onSize: (sz: string) => void;
  onClear: () => void;
  onClose: () => void;
}

function FilterDrawer({
  categories, sizes, selectedCategory, selectedSize,
  categoryProp, onCategory, onSize, onClear, onClose,
}: FilterDrawerProps) {
  return (
    <div className={styles.drawerOverlay} onClick={onClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.drawerHeader}>
          <h3>FILTERS</h3>
          <button onClick={onClose} aria-label="Close filters"><X size={20} /></button>
        </div>
        <div className={styles.drawerBody}>
          {!categoryProp && (
            <div className={styles.drawerGroup}>
              <h4>Categories</h4>
              <div className={styles.drawerCategories}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`${styles.drawerTag} ${selectedCategory === cat ? styles.activeTag : ''}`}
                    onClick={() => onCategory(cat)}
                  >
                    {cat || 'ALL'}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className={styles.drawerGroup}>
            <h4>Sizes</h4>
            <div className={styles.drawerSizes}>
              {sizes.map((sz) => (
                <button
                  key={sz}
                  className={`${styles.drawerSizeBtn} ${selectedSize === sz ? styles.activeSizeBtn : ''}`}
                  onClick={() => onSize(selectedSize === sz ? '' : sz)}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.drawerFooter}>
          <button className={styles.drawerClearBtn} onClick={onClear}>CLEAR ALL</button>
          <button className={styles.drawerApplyBtn} onClick={onClose}>APPLY</button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile Sort Drawer
// ---------------------------------------------------------------------------

interface SortDrawerProps {
  sortBy: string;
  onSort: (val: string) => void;
  onClose: () => void;
}

function SortDrawer({ sortBy, onSort, onClose }: SortDrawerProps) {
  return (
    <div className={styles.drawerOverlay} onClick={onClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.drawerHeader}>
          <h3>SORT BY</h3>
          <button onClick={onClose} aria-label="Close sort"><X size={20} /></button>
        </div>
        <div className={styles.drawerBody}>
          <div className={styles.sortOptions}>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`${styles.sortOptionRow} ${sortBy === opt.value ? styles.activeOptionRow : ''}`}
                onClick={() => { onSort(opt.value); onClose(); }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

interface CatalogClientProps {
  categoryProp?: string;
}

export default function CatalogClient({ categoryProp = '' }: CatalogClientProps) {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);

  const {
    filteredProducts, loading, loadingMore, hasMore, error, retry, loadMore,
    selectedCategory, setSelectedCategory,
    selectedSize, setSelectedSize,
    sortBy, setSortBy,
    currentTitle,
  } = useCatalogProducts({ categoryProp });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loading && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    const currentTrigger = loadMoreRef.current;
    if (currentTrigger) {
      observer.observe(currentTrigger);
    }

    return () => {
      if (currentTrigger) {
        observer.unobserve(currentTrigger);
      }
    };
  }, [loadMore, hasMore, loading, loadingMore]);

  const handleClear = () => {
    setSelectedCategory('');
    setSelectedSize('');
    setMobileFilterOpen(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        {/* Header */}
        <header className={styles.header}>
          <span className={styles.kicker}>Premium Essentials</span>
          <h1 className={styles.title}>{currentTitle}</h1>
        </header>

        {/* Mobile Filter & Sort Bar */}
        <div className={styles.mobileFilterBar}>
          <button onClick={() => setMobileFilterOpen(true)} className={styles.mobileFilterBtn}>
            <Filter size={16} strokeWidth={1.5} />
            <span>FILTER</span>
          </button>
          <div className={styles.divider} />
          <button onClick={() => setMobileSortOpen(true)} className={styles.mobileFilterBtn}>
            <ArrowUpDown size={16} strokeWidth={1.5} />
            <span>SORT BY</span>
          </button>
        </div>

        {/* Grid Area */}
        <div className={styles.layout}>
          <section className={styles.grid} aria-label="Product listing">
            <div className={styles.gridHeader}>
              <span className={styles.resultCount} aria-live="polite">
                {loading ? 'Loading...' : `Showing ${filteredProducts.length} results`}
              </span>
              <div className={styles.desktopSortWrap}>
                <select
                  className={styles.sort}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort products"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <CatalogGrid
              products={filteredProducts}
              loading={loading}
              error={error}
              onRetry={retry}
            />

            {/* Infinite Scroll Trigger */}
            <div ref={loadMoreRef} className={styles.scrollTrigger}>
              {loadingMore && (
                <div className={styles.loaderContainer}>
                  <div className={styles.spinner} />
                  <span>Loading more premium apparel...</span>
                </div>
              )}
              {!hasMore && filteredProducts.length > 0 && (
                <div className={styles.noMoreMessage}>
                  <span>You've viewed all our coastal essentials.</span>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Mobile Drawers */}
      {mobileFilterOpen && (
        <FilterDrawer
          categories={CATEGORIES}
          sizes={SIZES}
          selectedCategory={selectedCategory}
          selectedSize={selectedSize}
          categoryProp={categoryProp}
          onCategory={setSelectedCategory}
          onSize={setSelectedSize}
          onClear={handleClear}
          onClose={() => setMobileFilterOpen(false)}
        />
      )}

      {mobileSortOpen && (
        <SortDrawer
          sortBy={sortBy}
          onSort={setSortBy}
          onClose={() => setMobileSortOpen(false)}
        />
      )}
    </div>
  );
}
