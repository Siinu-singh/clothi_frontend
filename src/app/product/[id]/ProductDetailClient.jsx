'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './ProductDetail.module.css';
import { apiFetch } from '../../../lib/api';
import { useCart } from '../../../context/CartContext';
import { useFavorites } from '../../../context/FavoritesContext';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { useLoginPrompt } from '../../../context/LoginPromptContext';
import ReviewForm from '../../../components/ReviewForm/ReviewForm';
import ReviewsList from '../../../components/ReviewsList/ReviewsList';
import ProductRating from '../../../components/ProductRating/ProductRating';

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
   const [selectedImage, setSelectedImage] = useState(null);
   const [hoverImage, setHoverImage] = useState({});
   const loadMoreRef = useRef(null);
   
   // Similar products state
   const [similarProducts, setSimilarProducts] = useState([]);
   const [similarLoading, setSimilarLoading] = useState(false);
   const [similarPage, setSimilarPage] = useState(1);
   const [hasMoreSimilar, setHasMoreSimilar] = useState(true);
   const SIMILAR_LIMIT = 5;

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
      // Set initial selected image
      setSelectedImage(initialProduct.image);
    }
  }, [params.id, initialProduct]);

  useEffect(() => {
    // Check if product is favorited when product loads
    if (product) {
      setIsFav(isFavorited(params.id));
    }
  }, [params.id, product]);

  // Fetch similar products when product loads
  useEffect(() => {
    if (params.id) {
      // Reset similar products when product changes
      setSimilarProducts([]);
      setSimilarPage(1);
      setHasMoreSimilar(true);
      fetchSimilarProducts(1, true);
    }
  }, [params.id]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasMoreSimilar) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !similarLoading) {
          fetchSimilarProducts(similarPage + 1);
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasMoreSimilar, similarLoading, similarPage]);

  const fetchSimilarProducts = async (page = 1, reset = false) => {
    if (similarLoading || (!hasMoreSimilar && !reset)) return;
    
    try {
      setSimilarLoading(true);
      // Use the dedicated related products endpoint
      const limit = SIMILAR_LIMIT * page;
      const response = await apiFetch(
        `/products/${params.id}/related?limit=${limit}`
      );
      
      const products = response.data || [];
      
      if (reset) {
        setSimilarProducts(products.slice(0, SIMILAR_LIMIT));
      } else {
        setSimilarProducts(products);
      }
      
      // Check if there are more products to load (max 10 from API)
      setHasMoreSimilar(products.length >= limit && limit < 10);
      setSimilarPage(page);
    } catch (err) {
      console.error('Failed to fetch similar products:', err);
    } finally {
      setSimilarLoading(false);
    }
  };


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
      // Set initial selected image
      setSelectedImage(productData.image);
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
        toast.success('Product has been successfully removed from your wishlist.');
      } else {
        await addToFavorites(params.id);
        setIsFav(true);
        toast.success('Product has been successfully added to your wishlist.');
      }
    } catch (err) {
      toast.error('Failed to update favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  };

   const formatPrice = (price) => {
     return `₹${price.toFixed(0)}`;
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

   // Image carousel variables
   const allImages = product ? [product.image, ...(product.images || [])] : [];
   const currentIndex = selectedImage ? allImages.indexOf(selectedImage) : 0;

   const handlePrevImage = (e) => {
     e.stopPropagation();
     if (allImages.length <= 1) return;
     const newIndex = currentIndex <= 0 ? allImages.length - 1 : currentIndex - 1;
     setSelectedImage(allImages[newIndex]);
   };

   const handleNextImage = (e) => {
     e.stopPropagation();
     if (allImages.length <= 1) return;
     const newIndex = currentIndex >= allImages.length - 1 ? 0 : currentIndex + 1;
     setSelectedImage(allImages[newIndex]);
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
              {allImages.length > 1 && (
                <button className={`${styles.imageNavBtn} ${styles.prevBtn}`} onClick={handlePrevImage} aria-label="Previous image">
                  <ChevronLeft size={24} />
                </button>
              )}
              <img 
                src={selectedImage || product.image} 
                alt={`${product.title} - ${product.category} - CLOTHI sustainable fashion`}
                width={800}
                height={1000}
              />
              {allImages.length > 1 && (
                <button className={`${styles.imageNavBtn} ${styles.nextBtn}`} onClick={handleNextImage} aria-label="Next image">
                  <ChevronRight size={24} />
                </button>
              )}
            </div>
            {/* Image Gallery Thumbnails */}
            {product.images && product.images.length > 0 && (
              <div className={styles.imageGallery}>
                {/* Main image as first thumbnail */}
                <button
                  className={`${styles.thumbnail} ${(selectedImage || product.image) === product.image ? styles.thumbnailActive : ''}`}
                  onClick={() => setSelectedImage(product.image)}
                  aria-label="View main product image"
                >
                  <img 
                    src={product.image} 
                    alt={`${product.title} - Main view`}
                  />
                </button>
                {/* Additional images */}
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    className={`${styles.thumbnail} ${selectedImage === img ? styles.thumbnailActive : ''}`}
                    onClick={() => setSelectedImage(img)}
                    aria-label={`View product image ${index + 2}`}
                  >
                    <img 
                      src={img} 
                      alt={`${product.title} - View ${index + 2}`}
                    />
                  </button>
                ))}
              </div>
            )}
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
               <p>✦ Free shipping on orders over ₹10,000</p>
               <p>✦ Free 30-day returns</p>
               <p>✦ Sustainably made</p>
             </div>
           </div>
         </div>

          {/* Reviews Section */}
          {/*
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
          */}
      </div>

         {/* You May Like Section */}
         {similarProducts.length > 0 && (
           <div className={styles.similarSection}>
             <div className={styles.similarHeader}>
               <h2 className={styles.similarTitle}>SHOP SIMILAR</h2>
             </div>
             
              <div className={styles.similarGrid}>
                {similarProducts.map((p) => (
                  <Link href={`/product/${p._id}`} key={p._id} className={styles.similarCard}>
                    <article>
                      <div 
                        className={styles.similarImage}
                        onMouseEnter={() => setHoverImage({...hoverImage, [p._id]: true})}
                        onMouseLeave={() => setHoverImage({...hoverImage, [p._id]: false})}
                      >
                        <img 
                          src={hoverImage[p._id] && p.images?.[0] ? p.images[0] : p.image} 
                          alt={`${p.title} - ${p.category}`}
                          loading="lazy"
                          width={300}
                          height={375}
                        />
                        {p.badge && <span className={styles.similarBadge}>{p.badge}</span>}
                      </div>
                      <div className={styles.similarInfo}>
                        <h3 className={styles.similarName}>{p.title}</h3>
                        <p className={styles.similarPrice}>{formatPrice(p.price)}</p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {hasMoreSimilar && <div ref={loadMoreRef} className={styles.loadMoreSentinel} />}

              {similarLoading && similarProducts.length > 0 && (
                <div className={styles.similarLoading}>
                  <div className={styles.spinner}></div>
                </div>
              )}
           </div>
         )}
     </div>
   );
}
