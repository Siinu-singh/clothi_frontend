/**
 * FavoritesService - Wishlist/Favorites Business Logic
 * 
 * Handles favorites operations using FavoritesRepository.
 * Manages user's favorite products and wishlist functionality.
 * 
 * SOLID Principles Applied:
 * - Single Responsibility: Only handles favorites business logic
 * - Dependency Inversion: Depends on FavoritesRepository abstraction
 */

import { BaseService } from './BaseService';

export class FavoritesService extends BaseService {
  constructor(favoritesRepository, notificationService) {
    super('FavoritesService');
    this.favoritesRepository = favoritesRepository;
    this.notificationService = notificationService;
  }

  async getFavorites() {
    try {
      this.log('fetching favorites');

      const favorites = await this.favoritesRepository.getFavorites();

      this.log('favorites fetched', { count: favorites?.length || 0 });

      return { success: true, favorites };
    } catch (error) {
      return this.handleError(error, 'getFavorites');
    }
  }

  async addToFavorites(productId) {
    try {
      if (!productId) {
        throw new Error('Product ID is required');
      }

      this.log('adding to favorites', { productId });

      const favorites = await this.favoritesRepository.addFavorite(productId);

      this.log('product added to favorites', { productId });
      await this.notificationService?.success('Added to favorites!');

      return { success: true, favorites };
    } catch (error) {
      return this.handleError(error, 'addToFavorites');
    }
  }

  async removeFromFavorites(productId) {
    try {
      if (!productId) {
        throw new Error('Product ID is required');
      }

      this.log('removing from favorites', { productId });

      const favorites = await this.favoritesRepository.removeFavorite(productId);

      this.log('product removed from favorites', { productId });
      await this.notificationService?.success('Removed from favorites');

      return { success: true, favorites };
    } catch (error) {
      return this.handleError(error, 'removeFromFavorites');
    }
  }

  async isFavorite(productId) {
    try {
      if (!productId) {
        throw new Error('Product ID is required');
      }

      const isFav = await this.favoritesRepository.isFavorite(productId);

      return { success: true, isFavorite: isFav };
    } catch (error) {
      return this.handleError(error, 'isFavorite');
    }
  }

  async toggleFavorite(productId) {
    try {
      const isFav = await this.favoritesRepository.isFavorite(productId);

      if (isFav) {
        return this.removeFromFavorites(productId);
      } else {
        return this.addToFavorites(productId);
      }
    } catch (error) {
      return this.handleError(error, 'toggleFavorite');
    }
  }
}
