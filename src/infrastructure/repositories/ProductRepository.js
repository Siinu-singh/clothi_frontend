/**
 * ProductRepository - Handles all product API calls
 * 
 * Implements Repository Pattern for product operations.
 * Responsible only for API communication, not business logic.
 */

import { BaseRepository } from './BaseRepository';

export class ProductRepository extends BaseRepository {
  constructor(apiClient) {
    super(apiClient, '/products');
  }

  async search(query, filters = {}, pagination = {}) {
    const params = new URLSearchParams({
      q: query,
      ...filters,
      ...pagination
    });

    const response = await this.apiClient.get(
      `${this.endpoint}/search?${params.toString()}`
    );
    return this.normalizeProductListResponse(response);
  }

  async getByCategory(category, filters = {}, pagination = {}) {
    const params = new URLSearchParams({
      category,
      ...filters,
      ...pagination
    });

    const response = await this.apiClient.get(
      `${this.endpoint}/category/${category}?${params.toString()}`
    );
    return this.normalizeProductListResponse(response);
  }

  async getRelated(productId) {
    const response = await this.apiClient.get(
      `${this.endpoint}/${productId}/related`
    );
    return this.normalizeProductListResponse(response);
  }

  async getReviews(productId) {
    const response = await this.apiClient.get(
      `${this.endpoint}/${productId}/reviews`
    );
    return response.data || response;
  }

  async addReview(productId, reviewData) {
    return this.apiClient.post(
      `${this.endpoint}/${productId}/reviews`,
      reviewData
    );
  }

  /**
   * Normalize product list responses
   * @private
   */
  normalizeProductListResponse(response) {
    const data = response.data || response;
    return {
      products: Array.isArray(data) ? data : data.products || [],
      total: data.total || data.length || 0,
      page: data.page || 1,
      pages: data.pages || 1
    };
  }

  /**
   * Override normalizeResponse for single product
   */
  normalizeResponse(response) {
    return response.data || response;
  }
}
