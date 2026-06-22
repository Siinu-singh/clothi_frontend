'use client';
import React, { useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useToast } from '../../context/ToastContext';
import { useLoginPrompt } from '../../context/LoginPromptContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import type { Product } from '../../lib/useProducts';
import styles from './Catalog.module.css';

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function CatalogSkeleton() {
  return (
    <div className={styles.loadingGrid} aria-busy="true" aria-label="Loading products">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className={styles.productCardSkeleton}>
          <div className={styles.skeletonImage} />
          <div className={styles.skeletonText} />
          <div className={styles.skeletonTextSmall} />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Error / empty states
// ---------------------------------------------------------------------------

function CatalogError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className={styles.errorState} role="alert">
      <p>{message}</p>
      <button className={styles.retryBtn} onClick={onRetry}>
        Try Again
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main grid
// ---------------------------------------------------------------------------

interface CatalogGridProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function CatalogGrid({ products, loading, error, onRetry }: CatalogGridProps) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorited } = useFavorites();
  const { toast } = useToast();
  const { showLoginPrompt } = useLoginPrompt();

  const formatPrice = useCallback((price: number) => `₹${price.toFixed(0)}`, []);

  const handleAddToCart = useCallback(
    async (e: React.MouseEvent, productId: string) => {
      e.preventDefault();
      e.stopPropagation();
      const success = await addToCart(productId, 1);
      if (success) toast.success('Added to cart');
    },
    [addToCart, toast]
  );

  const handleToggleFavorite = useCallback(
    async (e: React.MouseEvent, productId: string) => {
      e.preventDefault();
      e.stopPropagation();

      if (!user) {
        showLoginPrompt({
          title: 'Sign in to save favorites',
          message: 'Create an account or sign in to save your favorite items.',
        });
        return;
      }

      try {
        if (isFavorited(productId)) {
          await removeFromFavorites(productId);
          toast.success('Product has been successfully removed from your wishlist.');
        } else {
          await addToFavorites(productId);
          toast.success('Product has been successfully added to your wishlist.');
        }
      } catch {
        toast.error('Failed to update favorites');
      }
    },
    [user, isFavorited, addToFavorites, removeFromFavorites, showLoginPrompt, toast]
  );

  if (loading) return <CatalogSkeleton />;
  if (error) return <CatalogError message={error} onRetry={onRetry} />;
  if (products.length === 0) {
    return (
      <div className={styles.noProducts} role="status">
        No products found matching the criteria.
      </div>
    );
  }

  return (
    <div className={styles.productGrid}>
      {products.map((p, index) => (
        <ProductCard
          key={p._id}
          product={p}
          isFavorited={isFavorited(p._id)}
          onAddToCart={(e) => handleAddToCart(e, p._id)}
          onFavoriteClick={(e) => handleToggleFavorite(e, p._id)}
          formatPrice={formatPrice}
          isAboveFold={index < 4}
        />
      ))}
    </div>
  );
}
