'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import styles from './Cart.module.css';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateCartItem, clearCart, loading } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [updating, setUpdating] = useState(null);

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdating(itemId);
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (err) {
      toast.error('Failed to update quantity');
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId, productName) => {
    setUpdating(itemId);
    try {
      await removeFromCart(itemId);
      toast.success(`${productName} removed from cart`);
    } catch (err) {
      toast.error('Failed to remove item');
    } finally {
      setUpdating(null);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart();
        toast.success('Cart cleared');
      } catch (err) {
        toast.error('Failed to clear cart');
      }
    }
  };

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  // Not logged in
  if (!user) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.emptyState}>
            <ShoppingBag size={64} strokeWidth={1} className={styles.emptyIcon} />
            <h2>Sign in to view your cart</h2>
            <p>Create an account or sign in to add items to your cart and check out.</p>
            <Link href="/login" className={styles.primaryBtn}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart
  if (!cart.items || cart.items.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.emptyState}>
            <ShoppingBag size={64} strokeWidth={1} className={styles.emptyIcon} />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link href="/catalog" className={styles.primaryBtn}>
              Continue Shopping
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
          <button 
            className={styles.backLink}
            onClick={() => router.back()}
          >
            <ArrowLeft size={16} strokeWidth={1.5} />
            Back
          </button>
          <h1 className={styles.title}>Shopping Cart</h1>
          <span className={styles.itemCount}>{cart.totalItems || cart.items.length} items</span>
        </header>

        <div className={styles.layout}>
          <div className={styles.cartItems}>
            {cart.items.map((item) => (
              <div key={item._id || `${item.productId}-${item.size}-${item.color}`} className={styles.cartItem}>
                <div className={styles.itemImage}>
                  <img 
                    src={item.product?.image || '/placeholder.png'} 
                    alt={item.product?.title || 'Product'} 
                  />
                </div>
                <div className={styles.itemDetails}>
                  <div className={styles.itemInfo}>
                    <Link 
                      href={`/product/${item.productId}`}
                      className={styles.itemName}
                    >
                      {item.product?.title || 'Product'}
                    </Link>
                    <div className={styles.itemMeta}>
                      {item.color && <span>Color: {item.color}</span>}
                      {item.size && <span>Size: {item.size}</span>}
                    </div>
                    <p className={styles.itemPrice}>
                      {formatPrice(item.product?.price || item.price || 0)}
                    </p>
                  </div>
                  <div className={styles.itemActions}>
                    <div className={styles.quantityControl}>
                      <button 
                        onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                        disabled={updating === item._id || item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className={styles.quantity}>{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                        disabled={updating === item._id}
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button 
                      className={styles.removeBtn}
                      onClick={() => handleRemoveItem(item._id, item.product?.title)}
                      disabled={updating === item._id}
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className={styles.itemTotal}>
                  {formatPrice((item.product?.price || item.price || 0) * item.quantity)}
                </div>
              </div>
            ))}
            
            <button 
              className={styles.clearCartBtn}
              onClick={handleClearCart}
            >
              Clear Cart
            </button>
          </div>

          <div className={styles.orderSummary}>
            <h3 className={styles.summaryTitle}>Order Summary</h3>
            
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{formatPrice(cart.totalPrice || 0)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>{cart.totalPrice >= 150 ? 'FREE' : formatPrice(15)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Tax</span>
              <span>Calculated at checkout</span>
            </div>
            
            <div className={styles.summaryDivider}></div>
            
            <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
              <span>Estimated Total</span>
              <span>{formatPrice(cart.totalPrice + (cart.totalPrice >= 150 ? 0 : 15))}</span>
            </div>

            <button className={styles.checkoutBtn}>
              Proceed to Checkout
            </button>

            <div className={styles.trustBadges}>
              <p>Free shipping on orders over $150</p>
              <p>Free 30-day returns</p>
              <p>Secure checkout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
