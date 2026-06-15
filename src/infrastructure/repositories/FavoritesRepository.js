/**
 * FavoritesRepository - Handles all favorites/wishlist API calls
 * 
 * Implements Repository Pattern for favorites operations.
 * Responsible only for API communication, not business logic.
 */

import { BaseRepository } from './BaseRepository';

export class FavoritesRepository extends BaseRepository {
  constructor(apiClient) {
    super(apiClient, '/favorites');
  }

  async getFavorites() {
    const response = await this.apiClient.get(this.endpoint);
    return this.normalizeFavoritesResponse(response);
  }

  async addFavorite(productId) {
    const response = await this.apiClient.post(this.endpoint, { productId });
    return this.normalizeFavoritesResponse(response);
  }

  async removeFavorite(productId) {
    const response = await this.apiClient.delete(`${this.endpoint}/${productId}`);
    return this.normalizeFavoritesResponse(response);
  }

  async isFavorite(productId) {
    try {
      const response = await this.apiClient.get(`${this.endpoint}/${productId}`);
      return response.data?.isFavorite || response.isFavorite || false;
    } catch {
      return false;
    }
  }

  /**
   * Normalize favorites responses
   * @private
   */
  normalizeFavoritesResponse(response) {
    const data = response.data || response;
    return Array.isArray(data) ? data : data.favorites || [];
  }
}
