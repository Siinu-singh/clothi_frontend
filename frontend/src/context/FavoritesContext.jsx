'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';
import { useAuth } from './AuthContext';
import { useLoginPrompt } from './LoginPromptContext';

const FavoritesContext = createContext({});

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const { showLoginPrompt } = useLoginPrompt();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shareLinks, setShareLinks] = useState([]);

  // Load favorites when user logs in
  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const response = await apiFetch('/favorites');
      setFavorites(response.data?.favorites || []);
    } catch (err) {
      console.error('Failed to load favorites', err);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (productId) => {
    if (!user) {
      showLoginPrompt({
        title: 'Sign in to save favorites',
        message: 'Create an account or sign in to save your favorite items and access them anytime.',
      });
      return false;
    }

    try {
      const response = await apiFetch('/favorites/add', {
        method: 'POST',
        body: JSON.stringify({ productId })
      });
      
      // Update local state
      setFavorites(prev => {
        // Check if product is already in favorites
        const exists = prev.some(item => item._id === productId || item.productId === productId);
        if (!exists) {
          return [...prev, { productId }];
        }
        return prev;
      });
      
      return true;
    } catch (err) {
      console.error('Add to favorites failed', err);
      throw err;
    }
  };

  const removeFromFavorites = async (productId) => {
    if (!user) {
      return false;
    }

    try {
      await apiFetch(`/favorites/${productId}`, {
        method: 'DELETE'
      });
      
      // Update local state
      setFavorites(prev => prev.filter(item => item._id !== productId && item.productId !== productId));
      
      return true;
    } catch (err) {
      console.error('Remove from favorites failed', err);
      throw err;
    }
  };

  const isFavorited = (productId) => {
    return favorites.some(item => item._id === productId || item.productId === productId);
  };

  const checkFavorite = async (productId) => {
    if (!user) {
      return false;
    }

    try {
      const data = await apiFetch(`/favorites/${productId}/check`);
      return data.isFavorited || data.favorited || false;
    } catch (err) {
      console.error('Check favorite failed', err);
      return false;
    }
  };

  const createShareLink = async (expiresInDays = null) => {
    if (!user) {
      return null;
    }

    try {
      const response = await apiFetch('/wishlist-share', {
        method: 'POST',
        body: JSON.stringify({ expiresIn: expiresInDays })
      });
      
      setShareLinks(prev => [...prev, response.data.shareToken]);
      return response.data;
    } catch (err) {
      console.error('Failed to create share link', err);
      throw err;
    }
  };

  const getShareLinks = async () => {
    if (!user) {
      return [];
    }

    try {
      const response = await apiFetch('/wishlist-share');
      setShareLinks(response.data.shareLinks);
      return response.data;
    } catch (err) {
      console.error('Failed to get share links', err);
      return [];
    }
  };

  const revokeShareLink = async (shareTokenId) => {
    if (!user) {
      return false;
    }

    try {
      await apiFetch(`/wishlist-share/${shareTokenId}/revoke`, {
        method: 'PATCH'
      });
      
      setShareLinks(prev => prev.filter(link => link._id !== shareTokenId));
      return true;
    } catch (err) {
      console.error('Failed to revoke share link', err);
      throw err;
    }
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorited,
      checkFavorite,
      loading,
      loadFavorites,
      createShareLink,
      getShareLinks,
      revokeShareLink,
      shareLinks,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
