/**
 * useCart - Shopping Cart Hook
 * 
 * Segregated interface for cart operations.
 * Depends on CartService through DI container.
 * 
 * SOLID Principles Applied:
 * - Interface Segregation: Only exposes cart-related interface
 * - Dependency Inversion: Depends on CartService abstraction
 */

import { useContext, useCallback, useState } from 'react';
import { AppContext } from '../providers/AppProvider';

export function useCart() {
  const { appContainer } = useContext(AppContext);
  const cartService = appContainer.resolve('cartService');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await cartService.getCart();

      if (!result.success) {
        setError(result.error || 'Failed to fetch cart');
      }

      return result;
    } finally {
      setIsLoading(false);
    }
  }, [cartService]);

  const addToCart = useCallback(async (productId, quantity = 1, size = 'M', color = 'Default') => {
    setError(null);

    try {
      const result = await cartService.addToCart(productId, quantity, size, color);

      if (!result.success) {
        setError(result.error || 'Failed to add to cart');
      }

      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [cartService]);

  const removeFromCart = useCallback(async (itemId) => {
    setError(null);

    try {
      const result = await cartService.removeFromCart(itemId);

      if (!result.success) {
        setError(result.error || 'Failed to remove from cart');
      }

      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [cartService]);

  const updateQuantity = useCallback(async (itemId, quantity) => {
    setError(null);

    try {
      const result = await cartService.updateQuantity(itemId, quantity);

      if (!result.success) {
        setError(result.error || 'Failed to update quantity');
      }

      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [cartService]);

  const clearCart = useCallback(async () => {
    setError(null);

    try {
      const result = await cartService.clearCart();

      if (!result.success) {
        setError(result.error || 'Failed to clear cart');
      }

      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [cartService]);

  const applyCoupon = useCallback(async (couponCode) => {
    setError(null);

    try {
      const result = await cartService.applyCoupon(couponCode);

      if (!result.success) {
        setError(result.error || 'Failed to apply coupon');
      }

      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [cartService]);

  return {
    getCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    isLoading,
    error
  };
}
