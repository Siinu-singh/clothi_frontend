/**
 * useProducts — lightweight in-memory cache for product fetches.
 *
 * Prevents re-fetching the same query on every page visit.
 * Cache TTL: 5 minutes per unique query key.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiFetch } from './api';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Product {
  _id: string;
  title: string;
  image: string;
  images?: string[];
  price: number;
  oldPrice?: number;
  category: string;
  badge?: string;
  sizes?: string[];
  colors?: string[];
}

interface CacheEntry {
  data: Product[];
  timestamp: number;
}

interface UseProductsOptions {
  category?: string;
  sortBy?: string;
  limit?: number;
  size?: string;
}

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  retry: () => void;
}

// ---------------------------------------------------------------------------
// In-memory cache (module-level — persists across component mounts)
// ---------------------------------------------------------------------------

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, CacheEntry>();

function buildCacheKey(opts: UseProductsOptions): string {
  return JSON.stringify(opts);
}

function isCacheValid(entry: CacheEntry): boolean {
  return Date.now() - entry.timestamp < CACHE_TTL;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useProducts({
  category = '',
  sortBy = 'newest',
  limit = 20,
  size = '',
}: UseProductsOptions = {}): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchProducts = useCallback(async () => {
    const cacheKey = buildCacheKey({ category, sortBy, limit, size });

    // Serve from cache if still valid
    const cached = cache.get(cacheKey);
    if (cached && isCacheValid(cached)) {
      setProducts(cached.data);
      setLoading(false);
      setError(null);
      return;
    }

    // Cancel any in-flight request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      let url = `/products?limit=${limit}&sortBy=${sortBy}`;
      if (category) url += `&category=${category}`;

      const response = await apiFetch<{ data?: { products: Product[] }; products?: Product[] }>(url);
      const data = response.data?.products || response.products || [];

      cache.set(cacheKey, { data, timestamp: Date.now() });
      setProducts(data);
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      const message = (err as Error).message || 'Failed to load products';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [category, sortBy, limit, size]);

  useEffect(() => {
    fetchProducts();
    return () => abortRef.current?.abort();
  }, [fetchProducts]);

  return { products, loading, error, retry: fetchProducts };
}

/** Manually invalidate a cached entry (e.g. after admin update) */
export function invalidateProductCache(opts?: UseProductsOptions): void {
  if (opts) {
    cache.delete(buildCacheKey(opts));
  } else {
    cache.clear();
  }
}
