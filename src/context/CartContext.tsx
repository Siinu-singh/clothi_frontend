'use client';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { apiFetch } from '../lib/api';
import { useAuth } from './AuthContext';
import { useLoginPrompt } from './LoginPromptContext';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CartItem {
  _id: string;
  productId: string;
  quantity: number;
  size: string;
  color: string;
  price?: number;
  product?: {
    _id: string;
    title: string;
    image: string;
    price: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}

interface CartState {
  cart: Cart;
  loading: boolean;
  error: string | null;
}

interface CartActions {
  addToCart: (productId: string, quantity?: number, size?: string, color?: string) => Promise<boolean>;
  removeFromCart: (itemId: string) => Promise<boolean>;
  updateCartItem: (itemId: string, quantity: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  loadCart: () => Promise<void>;
}

type CartContextValue = CartState & CartActions;

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const EMPTY_CART: Cart = { items: [], totalPrice: 0, totalItems: 0 };
const CartContext = createContext<CartContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { showLoginPrompt } = useLoginPrompt();

  const [cart, setCart] = useState<Cart>(EMPTY_CART);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load cart when user logs in
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCart(EMPTY_CART);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFetch<{ data: Cart }>('/cart');
      setCart(response.data || EMPTY_CART);
    } catch (err) {
      console.error('Failed to load cart', err);
      setError((err as Error).message);
      setCart(EMPTY_CART);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(
    async (productId: string, quantity = 1, size = 'M', color = 'Default'): Promise<boolean> => {
      if (!user) {
        showLoginPrompt({
          title: 'Sign in to add to cart',
          message: 'Create an account or sign in to add items to your shopping cart and save them for later.',
        });
        return false;
      }

      try {
        setError(null);
        const response = await apiFetch<{ data: Cart }>('/cart/add', {
          method: 'POST',
          body: JSON.stringify({ productId, quantity, size, color }),
        });
        setCart(response.data || EMPTY_CART);
        return true;
      } catch (err) {
        console.error('Add to cart failed', err);
        setError((err as Error).message);
        return false;
      }
    },
    [user, showLoginPrompt],
  );

  const removeFromCart = useCallback(
    async (itemId: string): Promise<boolean> => {
      if (!user) return false;

      try {
        setError(null);
        const response = await apiFetch<{ data: Cart }>(`/cart/${itemId}`, {
          method: 'DELETE',
        });
        setCart(response.data || EMPTY_CART);
        return true;
      } catch (err) {
        console.error('Remove from cart failed', err);
        setError((err as Error).message);
        return false;
      }
    },
    [user],
  );

  const updateCartItem = useCallback(
    async (itemId: string, quantity: number): Promise<boolean> => {
      if (!user) return false;

      try {
        setError(null);
        const response = await apiFetch<{ data: Cart }>(`/cart/${itemId}`, {
          method: 'PUT',
          body: JSON.stringify({ quantity }),
        });
        setCart(response.data || EMPTY_CART);
        return true;
      } catch (err) {
        console.error('Update cart item failed', err);
        setError((err as Error).message);
        return false;
      }
    },
    [user],
  );

  const clearCart = useCallback(async (): Promise<boolean> => {
    if (!user) return false;

    try {
      setError(null);
      await apiFetch('/cart', { method: 'DELETE' });
      setCart(EMPTY_CART);
      return true;
    } catch (err) {
      console.error('Clear cart failed', err);
      setError((err as Error).message);
      return false;
    }
  }, [user]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const useCartState = (): CartState => {
  const { cart, loading, error } = useCart();
  return { cart, loading, error };
};

export const useCartActions = (): CartActions => {
  const { addToCart, removeFromCart, updateCartItem, clearCart, loadCart } = useCart();
  return { addToCart, removeFromCart, updateCartItem, clearCart, loadCart };
};
