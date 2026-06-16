'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart } from 'lucide-react';
import styles from './ProductCard.module.css';

const ProductCard = React.memo(function ProductCard({
  product,
  isFavorited,
  onAddToCart,
  onFavoriteClick,
  formatPrice,
  isAboveFold = false,
}) {
  return (
    <Link href={`/product/${product._id}`} className={styles.productCard}>
      <div className={styles.productImage}>
        <Image
          src={product.image}
          alt={product.title || 'Product'}
          fill
          sizes="(max-width: 600px) 50vw, (max-width: 1024px) 33vw, 20vw"
          style={{ objectFit: 'cover' }}
          quality={80}
          loading={isAboveFold ? 'eager' : 'lazy'}
          priority={isAboveFold}
        />
        <button
          className={styles.wishlistBtn}
          onClick={(e) => onFavoriteClick(e, product._id)}
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          aria-pressed={isFavorited}
        >
          <Heart
            size={16}
            strokeWidth={1.5}
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
