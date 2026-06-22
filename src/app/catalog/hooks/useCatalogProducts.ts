'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { type Product } from '../../../lib/useProducts';
import { apiFetch } from '../../../lib/api';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const CATEGORY_TITLES: Record<string, string> = {
  OVERSIZE: 'Zen-G by Clothi',
  POLO: 'The Crown Series',
  CASUAL: 'Prime Basics',
  'DRY-FIT': 'Motion X',
  '': 'Our Collection',
};

export const CATEGORIES = ['', 'POLO', 'OVERSIZE', 'CASUAL', 'DRY-FIT'];
export const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
export const SORT_OPTIONS = [
  { label: 'Newest Arrivals', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

interface UseCatalogProductsOptions {
  categoryProp?: string;
}

interface UseCatalogProductsResult {
  filteredProducts: Product[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  retry: () => void;
  loadMore: () => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  currentTitle: string;
}

export function useCatalogProducts({ categoryProp = '' }: UseCatalogProductsOptions = {}): UseCatalogProductsResult {
  const searchParams = useSearchParams();
  const customTitle = searchParams.get('title') ?? '';

  const [selectedCategory, setSelectedCategory] = useState(
    categoryProp || searchParams.get('category') || ''
  );
  const [selectedSize, setSelectedSize] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  const abortRef = useRef<AbortController | null>(null);
  const lastFetchedKey = useRef<string>('');

  // Sync category from URL params
  useEffect(() => {
    if (categoryProp) {
      setSelectedCategory(categoryProp);
      return;
    }
    setSelectedCategory(searchParams.get('category') || '');
  }, [searchParams, categoryProp]);

  // Fetching logic
  useEffect(() => {
    let isCurrent = true;
    const currentKey = `${selectedCategory}::${sortBy}`;

    if (lastFetchedKey.current !== currentKey) {
      lastFetchedKey.current = currentKey;
      setProducts([]);
      setPage(1);
      setHasMore(true);
      if (page !== 1) {
        return;
      }
    }

    const isInitial = page === 1;

    if (isInitial) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    abortRef.current?.abort();
    const abortController = new AbortController();
    abortRef.current = abortController;

    const fetchPage = async () => {
      try {
        let url = `/products?page=${page}&limit=20&sortBy=${sortBy}`;
        if (selectedCategory) {
          url += `&category=${selectedCategory}`;
        }

        const response = await apiFetch<{
          success: boolean;
          data?: {
            products: Product[];
            pagination: {
              page: number;
              limit: number;
              total: number;
              pages: number;
            };
          };
          products?: Product[];
        }>(url, { signal: abortController.signal });

        if (!isCurrent) return;

        const fetched = response.data?.products || response.products || [];
        const pagination = response.data?.pagination;

        setProducts((prev) => {
          if (isInitial) {
            return fetched;
          }
          const existingIds = new Set(prev.map((p) => p._id));
          const newUnique = fetched.filter((p) => !existingIds.has(p._id));
          return [...prev, ...newUnique];
        });

        if (pagination) {
          setHasMore(pagination.page < pagination.pages);
        } else {
          setHasMore(fetched.length === 20);
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        if (!isCurrent) return;
        setError((err as Error).message || 'Failed to fetch products');
      } finally {
        if (isCurrent) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    };

    fetchPage();

    return () => {
      isCurrent = false;
      abortController.abort();
    };
  }, [selectedCategory, sortBy, page, retryTrigger]);

  const loadMore = useCallback(() => {
    if (loading || loadingMore || !hasMore) return;
    setPage((prev) => prev + 1);
  }, [loading, loadingMore, hasMore]);

  const retry = useCallback(() => {
    setRetryTrigger((prev) => prev + 1);
  }, []);

  // Client-side size filter
  const filteredProducts = selectedSize
    ? products.filter((p) => p.sizes?.includes(selectedSize))
    : products;

  // Dispatch product count for Navbar
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(
      new CustomEvent('clothi-collection-count', {
        detail: { count: filteredProducts.length },
      })
    );
  }, [filteredProducts.length]);

  const currentTitle = CATEGORY_TITLES[selectedCategory] || customTitle || 'Our Collection';

  return {
    filteredProducts,
    loading,
    loadingMore,
    hasMore,
    error,
    retry,
    loadMore,
    selectedCategory,
    setSelectedCategory,
    selectedSize,
    setSelectedSize,
    sortBy,
    setSortBy,
    currentTitle,
  };
}
