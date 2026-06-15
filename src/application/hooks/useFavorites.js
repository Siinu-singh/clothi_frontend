/**
 * useFavorites - Favorites/Wishlist Hook
 * 
 * Segregated interface for favorites operations.
 * Depends on FavoritesService through DI container.
 * 
 * SOLID Principles Applied:
 * - Interface Segregation: Only exposes favorites-related interface
 * - Dependency Inversion: Depends on FavoritesService abstraction
 */

import { useContext, useCallback, useState } from 'react';
import { AppContext } from '../providers/AppProvider';

export function useFavorites() {
  const { appContainer } = useContext(AppContext);
  const favoritesService = appContainer.resolve('favoritesService');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getFavorites = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await favoritesService.getFavorites();

      if (!result.success) {
        setError(result.error || 'Failed to fetch favorites');
      }

      return result;
    } finally {
      setIsLoading(false);
    }
  }, [favoritesService]);

  const addToFavorites = useCallback(async (productId) => {
    setError(null);

    try {
      const result = await favoritesService.addToFavorites(productId);

      if (!result.success) {
        setError(result.error || 'Failed to add to favorites');
      }

      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [favoritesService]);

  const removeFromFavorites = useCallback(async (productId) => {
    setError(null);

    try {
      const result = await favoritesService.removeFromFavorites(productId);

      if (!result.success) {
        setError(result.error || 'Failed to remove from favorites');
      }

      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [favoritesService]);

  const isFavorite = useCallback(async (productId) => {
    setError(null);

    try {
      const result = await favoritesService.isFavorite(productId);

      if (!result.success) {
        setError(result.error || 'Failed to check favorite status');
      }

      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [favoritesService]);

  const toggleFavorite = useCallback(async (productId) => {
    setError(null);

    try {
      const result = await favoritesService.toggleFavorite(productId);

      if (!result.success) {
        setError(result.error || 'Failed to toggle favorite');
      }

      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [favoritesService]);

  return {
    getFavorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    isLoading,
    error
  };
}
