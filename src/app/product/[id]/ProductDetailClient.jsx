'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ProductDetail.module.css';
import { apiFetch } from '../../../lib/api';
import { useCart } from '../../../context/CartContext';
import { useFavorites } from '../../../context/FavoritesContext';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { useLoginPrompt } from '../../../context/LoginPromptContext';
import ReviewForm from '../../../components/ReviewForm';
import ReviewsList from '../../../components/ReviewsList';
import ProductRating from '../../../components/ProductRating';

export default function ProductDetailClient({ params, initialProduct }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorited } = useFavorites();
  const { user } = useAuth();
  const { toast } = useToast();
  const { showLoginPrompt } = useLoginPrompt();
  
  const [product, setProduct] = useState(initialProduct);
  const [pageLoading, setPageLoading] = useState(!initialProduct);
  const [error, setError] = useState(null);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviewsRefresh, setReviewsRefresh] = useState(0);

  useEffect(() => {
    if (!initialProduct) {
      fetchProduct();
    } else {
      // Set default size and color from initial product data
      if (initialProduct.sizes?.length > 0) {
        setSize(initialProduct.sizes[0]);
      }
      if (initialProduct.colors?.length > 0) {
        setColor(initialProduct.colors[0]);
      }
    }
  }, [params.id, initialProduct]);

  useEffect(() => {
    // Check if product is favorited when product loads
    if (product) {
      setIsFav(isFavorited(params.id));
    }
  }, [params.id, product]);

  const fetchProduct = async () => {
    try {
      setPageLoading(true);
      setError(null);
      const response = await apiFetch(`/products/${params.id}`);
      const productData = response.data || response;
      setProduct(productData);
      
      // Set default size and color from product data
      if (productData.sizes?.length > 0) {
        setSize(productData.sizes[0]);
      }
      if (productData.colors?.length > 0) {
        setColor(productData.colors[0]);
      }
    } catch (err) {
      console.error('Failed to fetch product:', err);
      setError('Product not found');
    } finally {
      setPageLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!size) {
      toast.error('Please select a size');
      return;
    }
    if (!color) {
      toast.error('Please select a color');
      return;
    }
    
    setLoading(true);
    try {
      const success = await addToCart(params.id, quantity, size, color);
      if (success) {
        toast.success(`Added ${quantity} item${quantity > 1 ? 's' : ''} to your cart`);
        setQuantity(1);
      }
    } catch (err) {
      toast.error('Failed to add item to cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      showLoginPrompt({
        title: 'Sign in to save favorites',
        message: 'Create an account or sign in to save your favorite items and access them anytime.',
      });
      return;
    }

    setLoading(true);
    try {
      if (isFav) {
        await removeFromFavorites(params.id);
        setIsFav(false);
        toast.success('Removed from favorites');
      } else {
        await addToFavorites(params.id);
        setIsFav(true);
        toast.success('Added to favorites');
      }
    } catch (err) {
      toast.error('Failed to update favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  // Color name to hex mapping (can be expanded)
  const colorToHex = {
    'White': '#ffffff',
    'Black': '#1b1c1a',
    'Navy': '#1a2a4a',
    'Indigo': '#3f4eae',
    'Cream': '#f5f3ef',
    'Tan': '#d2b48c',
    'Brown': '#8b4513',
    'Black/Brown': '#3d2b1f',
    'Silver': '#c0c0c0',
    'Tortoise': '#8b5a2b',
    'Charcoal': '#36454f',
    'Oatmeal': '#f3e5d0',
    'Bone': '#e3dac9',
    'Natural': '#f5f5dc',
    'Cognac': '#9a3001',
    'Rust': '#b7410e',
    'Sage': '#9dc183',
    'Terracotta': '#e2725b',
    'Olive': '#556b2f',
    'Sand': '#c2b280',
    'Stone': '#918e85',
    'Dune White': '#f5f3ef',
    'Clay': '#ba5b3f',
    'Forest': '#3b4a3f',
  };

  // Loading state
  if (pageLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.errorContainer}>
            <h2>Product Not Found</h2>
            <p>Sorry, we couldn't find this product.</p>
            <button 
              className={styles.backBtn}
              onClick={() => router.push('/catalog')}
            >
              Back to Catalog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.imageCol}>
            <div className={styles.mainImage}>
              <img 
                src={product.image} 
                alt={`${product.title} - ${product.category} - CLOTHI sustainable fashion`}
                width={800}
                height={1000}
              />
            </div>
          </div>
          <div className={styles.infoCol}>
            <span className={styles.kicker}>{product.category}</span>
            <h1 className={styles.title}>{product.title}</h1>
            <p className={styles.price}>{formatPrice(product.price)}</p>
            
            {product.colors && product.colors.length > 0 && (
              <div className={styles.colorSection}>
                <span className={styles.sectionLabel}>Color: <strong>{color || 'Select a color'}</strong></span>
                <div className={styles.colorSwatches}>
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      className={styles.swatch}
                      title={c}
                      aria-label={`Select color ${c}`}
                      style={{
                        background: colorToHex[c] || '#888',
                        border: color === c ? '2px solid var(--color-primary)' : '1px solid var(--color-outline-variant)',
                        cursor: 'pointer'
                      }}
                      onClick={() => setColor(c)}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {product.sizes && product.sizes.length > 0 && (
              <div className={styles.sizeSection}>
                <span className={styles.sectionLabel}>Size</span>
                <div className={styles.sizeGrid}>
                  {product.sizes.map(s => (
                    <button
                      key={s}
                      className={`${styles.sizeBtn} ${size === s ? styles.sizeBtnActive : ''}`}
                      onClick={() => setSize(s)}
                      aria-label={`Select size ${s}`}
                      aria-pressed={size === s}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className={styles.quantitySection}>
              <span className={styles.sectionLabel}>Quantity</span>
              <div className={styles.quantityControl}>
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} 
                  min="1" 
                  aria-label="Quantity"
                />
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
            
            <p className={styles.description}>{product.description}</p>
            
            <div className={styles.actions}>
              <button
                className={styles.addToCart}
                onClick={handleAddToCart}
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? 'Adding...' : 'ADD TO CART'}
              </button>
              <button
                className={`${styles.wishlistBtn} ${isFav ? styles.wishlistBtnActive : ''}`}
                onClick={handleToggleFavorite}
                disabled={loading}
                title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                aria-pressed={isFav}
              >
                {isFav ? '❤' : '♡'}
              </button>
            </div>
            
             <div className={styles.details}>
               <p>✦ Free shipping on orders over $150</p>
               <p>✦ Free 30-day returns</p>
               <p>✦ Sustainably made</p>
             </div>
           </div>
         </div>

         {/* Reviews Section */}
         <div className={styles.reviewsSection}>
           <ReviewsList 
             productId={params.id} 
             refreshTrigger={reviewsRefresh}
           />
           <ReviewForm 
             productId={params.id}
             onReviewSubmitted={() => setReviewsRefresh(r => r + 1)}
           />
         </div>
       </div>
     </div>
   );
}
