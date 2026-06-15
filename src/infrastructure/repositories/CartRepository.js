/**
 * CartRepository - Handles all cart API calls
 * 
 * Implements Repository Pattern for cart operations.
 * Responsible only for API communication, not business logic.
 */

import { BaseRepository } from './BaseRepository';

export class CartRepository extends BaseRepository {
  constructor(apiClient) {
    super(apiClient, '/cart');
  }

  async getCart() {
    const response = await this.apiClient.get(this.endpoint);
    return this.normalizeCartResponse(response);
  }

  async addItem(productId, quantity, size, color) {
    const response = await this.apiClient.post(`${this.endpoint}/add`, {
      productId,
      quantity,
      size,
      color
    });
    return this.normalizeCartResponse(response);
  }

  async removeItem(itemId) {
    const response = await this.apiClient.delete(`${this.endpoint}/${itemId}`);
    return this.normalizeCartResponse(response);
  }

  async updateItem(itemId, quantity) {
    const response = await this.apiClient.put(`${this.endpoint}/${itemId}`, {
      quantity
    });
    return this.normalizeCartResponse(response);
  }

  async clearCart() {
    const response = await this.apiClient.delete(this.endpoint);
    return this.normalizeCartResponse(response);
  }

  async applyCoupon(couponCode) {
    const response = await this.apiClient.post(`${this.endpoint}/apply-coupon`, {
      code: couponCode
    });
    return this.normalizeCartResponse(response);
  }

  /**
   * Normalize cart responses to consistent format
   * @private
   */
  normalizeCartResponse(response) {
    const data = response.data || response;
    return {
      items: data.items || [],
      totalPrice: data.totalPrice || data.total || 0,
      totalItems: data.totalItems || data.itemCount || 0,
      subtotal: data.subtotal || 0,
      tax: data.tax || 0,
      shipping: data.shipping || 0,
      discount: data.discount || 0,
      coupon: data.coupon || null
    };
  }
}
