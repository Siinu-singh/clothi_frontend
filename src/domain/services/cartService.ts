/**
 * Cart Service - Handles all cart-related API calls
 */

import { apiFetch } from '@/lib/api';

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
  };
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}

export interface AddToCartInput {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface UpdateCartItemInput {
  quantity: number;
}

export class CartService {
  private baseUrl = '/cart';

  async getCart(): Promise<Cart> {
    const response = await apiFetch<{ data: Cart }>(this.baseUrl, {
      method: 'GET',
      maxRetries: 2,
    });

    return response.data || { items: [], totalPrice: 0, totalItems: 0 };
  }

  async addToCart(input: AddToCartInput): Promise<Cart> {
    const response = await apiFetch<{ data: Cart }>(`${this.baseUrl}/add`, {
      method: 'POST',
      body: JSON.stringify({
        productId: input.productId,
        quantity: input.quantity,
        size: input.size || 'M',
        color: input.color || 'Default',
      }),
      maxRetries: 1,
    });

    return response.data || { items: [], totalPrice: 0, totalItems: 0 };
  }

  async removeFromCart(itemId: string): Promise<Cart> {
    if (!itemId) {
      throw new Error('Item ID is required');
    }

    const response = await apiFetch<{ data: Cart }>(`${this.baseUrl}/${itemId}`, {
      method: 'DELETE',
      maxRetries: 1,
    });

    return response.data || { items: [], totalPrice: 0, totalItems: 0 };
  }

  async updateCartItem(itemId: string, input: UpdateCartItemInput): Promise<Cart> {
    if (!itemId) {
      throw new Error('Item ID is required');
    }

    if (input.quantity < 1) {
      throw new Error('Quantity must be at least 1');
    }

    const response = await apiFetch<{ data: Cart }>(`${this.baseUrl}/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity: input.quantity }),
      maxRetries: 1,
    });

    return response.data || { items: [], totalPrice: 0, totalItems: 0 };
  }

  async clearCart(): Promise<void> {
    await apiFetch(this.baseUrl, {
      method: 'DELETE',
      maxRetries: 1,
    });
  }
}

export const cartService = new CartService();
