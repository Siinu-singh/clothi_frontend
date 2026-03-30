'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import styles from './CartDropdown.module.css';

export default function CartDropdown({ isOpen, onClose }) {
  const { cart, removeFromCart, loading } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [removing, setRemoving] = useState(null);

  const handleRemoveItem = async (e, itemId, productName) => {
    e.preventDefault();
    e.stopPropagation();
    setRemoving(itemId);
    try {
      await removeFromCart(itemId);
      toast.success(`${productName} removed`);
    } catch (err) {
      toast.error('Failed to remove item');
    } finally {
      setRemoving(null);
    }
  };

  const formatPrice = (price) => {
    return `$${(price || 0).toFixed(2)}`;
  };

  if (!isOpen) return null;

  // Not logged in
  if (!user) {
    return (
      <div className={styles.dropdown}>
        <div className={styles.emptyState}>
          <ShoppingBag size={32} strokeWidth={1} className={styles.emptyIcon} />
          <p>Sign in to view your cart</p>
          <Link href="/login" className={styles.signInBtn} onClick={onClose}>
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className={styles.dropdown}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  // Empty cart
  if (!cart.items || cart.items.length === 0) {
    return (
      <div className={styles.dropdown}>
        <div className={styles.emptyState}>
          <ShoppingBag size={32} strokeWidth={1} className={styles.emptyIcon} />
          <p>Your cart is empty</p>
          <Link href="/catalog" className={styles.shopBtn} onClick={onClose}>
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Show max 3 items in dropdown
  const displayItems = cart.items.slice(0, 3);
  const remainingCount = cart.items.length - 3;

  return (
    <div className={styles.dropdown}>
      <div className={styles.header}>
        <h4>Shopping Cart</h4>
        <span className={styles.itemCount}>{cart.totalItems || cart.items.length} items</span>
      </div>

      <div className={styles.items}>
        {displayItems.map((item) => (
          <div key={item._id} className={styles.item}>
            <Link 
              href={`/product/${item.productId}`} 
              className={styles.itemImage}
              onClick={onClose}
            >
              <img 
                src={item.product?.image || '/placeholder.png'} 
                alt={item.product?.title || 'Product'} 
              />
            </Link>
            <div className={styles.itemInfo}>
              <Link 
                href={`/product/${item.productId}`}
                className={styles.itemName}
                onClick={onClose}
              >
                {item.product?.title || 'Product'}
              </Link>
              <div className={styles.itemMeta}>
                <span>{item.size}</span>
                {item.color && <span> / {item.color}</span>}
              </div>
              <div className={styles.itemPriceRow}>
                <span className={styles.itemPrice}>
                  {formatPrice(item.product?.price)} × {item.quantity}
                </span>
                <button
                  className={styles.removeBtn}
                  onClick={(e) => handleRemoveItem(e, item._id, item.product?.title)}
                  disabled={removing === item._id}
                  aria-label="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {remainingCount > 0 && (
        <p className={styles.moreItems}>+ {remainingCount} more item{remainingCount > 1 ? 's' : ''}</p>
      )}

      <div className={styles.footer}>
        <div className={styles.subtotal}>
          <span>Subtotal</span>
          <span className={styles.subtotalPrice}>{formatPrice(cart.totalPrice)}</span>
        </div>
        <Link href="/cart" className={styles.viewCartBtn} onClick={onClose}>
          View Cart
        </Link>
        <Link href="/checkout" className={styles.checkoutBtn} onClick={onClose}>
          Checkout
        </Link>
      </div>
    </div>
  );
}
