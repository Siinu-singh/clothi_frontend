'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2, Share2 } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { useFavorites } from '../../context/FavoritesContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import WishlistShareModal from '../../components/WishlistShareModal';
import styles from './Favorites.module.css';

export default function FavoritesPage() {
  const { user } = useAuth();
  const { favorites, removeFromFavorites, loading, createShareLink } = useFavorites();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState(null);

  useEffect(() => {
    if (user && favorites.length > 0) {
      fetchFavoriteProducts();
    } else {
      setProducts([]);
      setLoadingProducts(false);
    }
  }, [user, favorites]);

  const fetchFavoriteProducts = async () => {
    try {
      setLoadingProducts(true);
      // Fetch full product details for each favorite
      const productPromises = favorites.map(async (fav) => {
        const productId = fav.productId || fav._id;
        try {
          const response = await apiFetch(`/products/${productId}`);
          return response.data || response;
        } catch (err) {
          console.error(`Failed to fetch product ${productId}`, err);
          return null;
        }
      });
      
      const fetchedProducts = await Promise.all(productPromises);
      setProducts(fetchedProducts.filter(Boolean));
    } catch (err) {
      console.error('Failed to fetch favorite products', err);
      toast.error('Failed to load some products');
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleRemoveFavorite = async (productId, productName) => {
    setActionLoading(productId);
    try {
      await removeFromFavorites(productId);
      toast.success(`${productName} removed from favorites`);
    } catch (err) {
      toast.error('Failed to remove from favorites');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddToCart = async (product) => {
    setActionLoading(product._id);
    try {
      const defaultSize = product.sizes?.[0] || 'M';
      const defaultColor = product.colors?.[0] || 'Default';
      const success = await addToCart(product._id, 1, defaultSize, defaultColor);
      if (success) {
        toast.success(`${product.title} added to cart`);
      }
    } catch (err) {
      toast.error('Failed to add to cart');
    } finally {
      setActionLoading(null);
    }
  };

  const formatPrice = (price) => {
    return `$${price.toFixed(0)}`;
  };

  const handleShareWishlist = async () => {
    try {
      setActionLoading('share');
      const result = await createShareLink();
      setShareLink(result.shareLink);
      setIsShareModalOpen(true);
      toast.success('Share link created!');
    } catch (err) {
      toast.error('Failed to create share link');
    } finally {
      setActionLoading(null);
    }
  };

  // Not logged in
  if (!user) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.emptyState}>
            <Heart size={64} strokeWidth={1} className={styles.emptyIcon} />
            <h2>Sign in to view favorites</h2>
            <p>Create an account or sign in to save your favorite items and access them anytime.</p>
            <Link href="/login" className={styles.primaryBtn}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading || loadingProducts) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading your favorites...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty favorites
  if (favorites.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.emptyState}>
            <Heart size={64} strokeWidth={1} className={styles.emptyIcon} />
            <h2>No favorites yet</h2>
            <p>Start exploring and save items you love by tapping the heart icon.</p>
            <Link href="/catalog" className={styles.primaryBtn}>
              Browse Collection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <span className={styles.kicker}>Your Collection</span>
          <h1 className={styles.title}>Saved Items</h1>
          <p className={styles.subtitle}>{products.length} items saved</p>
          <button
            className={styles.shareBtn}
            onClick={handleShareWishlist}
            disabled={actionLoading === 'share'}
            title="Share your wishlist"
          >
            <Share2 size={16} />
            {actionLoading === 'share' ? 'Creating link...' : 'Share Wishlist'}
          </button>
        </header>

        <div className={styles.productGrid}>
          {products.map((product) => (
            <div key={product._id} className={styles.productCard}>
              <Link href={`/product/${product._id}`} className={styles.productImage}>
                <img src={product.image} alt={product.title} />
              </Link>
              <div className={styles.productInfo}>
                <Link href={`/product/${product._id}`} className={styles.productName}>
                  {product.title}
                </Link>
                <p className={styles.productCategory}>{product.category}</p>
                <p className={styles.productPrice}>{formatPrice(product.price)}</p>
                
                <div className={styles.productActions}>
                  <button 
                    className={styles.addToCartBtn}
                    onClick={() => handleAddToCart(product)}
                    disabled={actionLoading === product._id}
                  >
                    <ShoppingBag size={14} />
                    {actionLoading === product._id ? 'Adding...' : 'Add to Cart'}
                  </button>
                  <button 
                    className={styles.removeBtn}
                    onClick={() => handleRemoveFavorite(product._id, product.title)}
                    disabled={actionLoading === product._id}
                    aria-label="Remove from favorites"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
         </div>
       </div>

       <WishlistShareModal
         isOpen={isShareModalOpen}
         onClose={() => setIsShareModalOpen(false)}
         shareLink={shareLink}
       />
     </div>
   );
}
