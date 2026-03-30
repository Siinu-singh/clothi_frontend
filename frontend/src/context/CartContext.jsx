'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';
import { useAuth } from './AuthContext';
import { useLoginPrompt } from './LoginPromptContext';

const CartContext = createContext({});

export function CartProvider({ children }) {
  const { user } = useAuth();
  const { showLoginPrompt } = useLoginPrompt();
  const [cart, setCart] = useState({ items: [], totalPrice: 0, totalItems: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCart({ items: [], totalPrice: 0, totalItems: 0 });
    }
  }, [user]);

  const loadCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFetch('/cart');
      setCart(response.data || { items: [], totalPrice: 0, totalItems: 0 });
    } catch (err) {
      console.error('Failed to load cart', err);
      setError(err.message);
      setCart({ items: [], totalPrice: 0, totalItems: 0 });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1, size = 'M', color = 'Default') => {
    if (!user) {
      showLoginPrompt({
        title: 'Sign in to add to cart',
        message: 'Create an account or sign in to add items to your shopping cart and save them for later.',
      });
      return false;
    }
    
    try {
      setError(null);
      const response = await apiFetch('/cart/add', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity, size, color })
      });
      setCart(response.data || { items: [], totalPrice: 0, totalItems: 0 });
      return true;
    } catch (err) {
      console.error('Add to cart failed', err);
      setError(err.message);
      return false;
    }
  };

  const removeFromCart = async (itemId) => {
    if (!user) {
      return false;
    }

    try {
      setError(null);
      const response = await apiFetch(`/cart/${itemId}`, {
        method: 'DELETE'
      });
      setCart(response.data || { items: [], totalPrice: 0, totalItems: 0 });
      return true;
    } catch (err) {
      console.error('Remove from cart failed', err);
      setError(err.message);
      return false;
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    if (!user) {
      return false;
    }

    try {
      setError(null);
      const response = await apiFetch(`/cart/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity })
      });
      setCart(response.data || { items: [], totalPrice: 0, totalItems: 0 });
      return true;
    } catch (err) {
      console.error('Update cart item failed', err);
      setError(err.message);
      return false;
    }
  };

  const clearCart = async () => {
    if (!user) {
      return false;
    }

    try {
      setError(null);
      await apiFetch('/cart', {
        method: 'DELETE'
      });
      setCart({ items: [], totalPrice: 0, totalItems: 0 });
      return true;
    } catch (err) {
      console.error('Clear cart failed', err);
      setError(err.message);
      return false;
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateCartItem,
      clearCart,
      loadCart,
      loading,
      error
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
