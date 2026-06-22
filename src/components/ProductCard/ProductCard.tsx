'use client';
import React, { useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import HeartIcon from '../HeartIcon/HeartIcon';
import styles from './ProductCard.module.css';

interface Product {
  _id: string;
  title: string;
  image: string;
  price: number;
  badge?: string;
}

interface ProductCardProps {
  product: Product;
  isFavorited: boolean;
  onAddToCart: (e: React.MouseEvent, productId: string) => void;
  onFavoriteClick: (e: React.MouseEvent, productId: string) => void;
  formatPrice: (price: number) => string;
  isAboveFold?: boolean;
}

const ProductCard = React.memo(function ProductCard({
  product,
  isFavorited,
  onAddToCart,
  onFavoriteClick,
  formatPrice,
  isAboveFold = false,
}: ProductCardProps) {
  const router = useRouter();
  const prefetchedRef = useRef(false);

  // Prefetch product page on hover — only once per card
  const handleMouseEnter = useCallback(() => {
    if (!prefetchedRef.current) {
      router.prefetch(`/product/${product._id}`);
      prefetchedRef.current = true;
    }
  }, [router, product._id]);

  return (
    <Link
      href={`/product/${product._id}`}
      className={styles.productCard}
      onMouseEnter={handleMouseEnter}
    >
      <div className={styles.productImage}>
        <Image
          src={product.image}
          alt={product.title || 'Product'}
          fill
          sizes="(max-width: 600px) 50vw, (max-width: 1024px) 33vw, 20vw"
          style={{ objectFit: 'cover' }}
          quality={80}
          priority={isAboveFold}
        />
        {product.badge && (
          <span className={styles.badge}>{product.badge}</span>
        )}
        <button
          className={`${styles.wishlistBtn} ${isFavorited ? styles.wishlistBtnActive : ''}`}
          onClick={(e) => onFavoriteClick(e, product._id)}
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          aria-pressed={isFavorited}
        >
          <HeartIcon
            size={20}
            strokeWidth={2}
            fill={isFavorited ? 'currentColor' : 'none'}
          />
        </button>
        <button
          className={styles.addToCartBtn}
          onClick={(e) => onAddToCart(e, product._id)}
          aria-label={`Add ${product.title || 'product'} to cart`}
        >
          <ShoppingCart size={16} strokeWidth={1.5} />
          <span>Add to Cart</span>
        </button>
      </div>
      <h3 className={styles.productName}>{product.title}</h3>
      <p className={styles.productPrice}>{formatPrice(product.price)}</p>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
