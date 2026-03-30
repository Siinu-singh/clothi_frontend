'use client';

import React, { useState, useEffect } from 'react';
import styles from './SharedWishlistPage.module.css';
import ProductRating from './ProductRating';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

/**
 * SharedWishlistPage Component
 * Display a publicly shared wishlist
 */
export default function SharedWishlistPage({ shareToken }) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [addingToCart, setAddingToCart] = useState({});

  useEffect(() => {
    fetchSharedWishlist();
  }, [shareToken]);

  const fetchSharedWishlist = async (p = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/wishlist-share/public/${shareToken}?page=${p}&limit=12`
      );

      if (!response.ok) {
        throw new Error('Failed to load wishlist');
      }

      const result = await response.json();
      setWishlist(result.data);

      if (p === 1) {
        setProducts(result.data.products);
      } else {
        setProducts((prev) => [...prev, ...result.data.products]);
      }

      setPage(p);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      setAddingToCart((prev) => ({ ...prev, [productId]: true }));
      const success = await addToCart(productId, 1);
      if (success) {
        toast.success('Added to cart');
      }
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleLoadMore = () => {
    fetchSharedWishlist(page + 1);
  };

  if (loading && products.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.error}>
            <h2>Wishlist Not Found</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!wishlist || products.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.empty}>
            <h2>Empty Wishlist</h2>
            <p>This wishlist hasn't been shared yet or is empty.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1>{wishlist.owner.name}'s Wishlist</h1>
          <p className={styles.subheading}>
            {wishlist.pagination.total} {wishlist.pagination.total === 1 ? 'item' : 'items'}
          </p>
          <p className={styles.viewCount}>
            👁 {wishlist.viewCount} {wishlist.viewCount === 1 ? 'view' : 'views'}
          </p>
          {wishlist.expiresAt && (
            <p className={styles.expiration}>
              Expires: {new Date(wishlist.expiresAt).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className={styles.grid}>
          {products.map((product) => (
            <div key={product._id} className={styles.productCard}>
              <div className={styles.imageContainer}>
                <img
                  src={product.image}
                  alt={product.title}
                  className={styles.image}
                />
                {product.badge && (
                  <span className={styles.badge}>{product.badge}</span>
                )}
              </div>

              <div className={styles.info}>
                <span className={styles.category}>{product.category}</span>
                <h3 className={styles.title}>{product.title}</h3>

                {product.rating && (
                  <div className={styles.rating}>
                    <ProductRating
                      rating={product.rating}
                      reviewCount={product.reviewCount || 0}
                      size="small"
                    />
                  </div>
                )}

                <div className={styles.priceContainer}>
                  <span className={styles.price}>
                    ${product.price.toFixed(2)}
                  </span>
                  {product.oldPrice && (
                    <span className={styles.oldPrice}>
                      ${product.oldPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <button
                  className={styles.addBtn}
                  onClick={() => handleAddToCart(product._id)}
                  disabled={addingToCart[product._id]}
                >
                  {addingToCart[product._id] ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {wishlist.pagination.pages > page && (
          <button className={styles.loadMoreBtn} onClick={handleLoadMore}>
            Load More
          </button>
        )}
      </div>
    </div>
  );
}
