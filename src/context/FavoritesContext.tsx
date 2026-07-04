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

export interface FavoriteItem {
  _id: string;
  productId: string;
  product?: {
    _id: string;
    title: string;
    image: string;
    price: number;
    [key: string]: unknown;
  } | null;
}

export interface ShareLink {
  _id: string;
  shareToken: string;
  expiresAt?: string;
  [key: string]: unknown;
}

interface FavoritesState {
  favorites: FavoriteItem[];
  loading: boolean;
  shareLinks: ShareLink[];
}

interface FavoritesActions {
  addToFavorites: (productId: string) => Promise<boolean>;
  removeFromFavorites: (productId: string) => Promise<boolean>;
  isFavorited: (productId: string) => boolean;
  checkFavorite: (productId: string) => Promise<boolean>;
  loadFavorites: () => Promise<void>;
  createShareLink: (expiresInDays?: number | null) => Promise<unknown>;
  getShareLinks: () => Promise<unknown>;
  revokeShareLink: (shareTokenId: string) => Promise<boolean>;
}

type FavoritesContextValue = FavoritesState & FavoritesActions;

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { showLoginPrompt } = useLoginPrompt();

  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);

  // Load favorites when user logs in
  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiFetch<{
        data?: { favorites?: unknown[] } | unknown[];
        favorites?: unknown[];
      }>('/favorites');

      const favoritesData =
        (response.data as { favorites?: unknown[] })?.favorites ||
        (response as { favorites?: unknown[] }).favorites ||
        response.data ||
        [];

      const raw = Array.isArray(favoritesData) ? favoritesData : [];
      const normalized: FavoriteItem[] = raw
        .map((item: unknown) => {
          const entry = item as Record<string, unknown>;
          if (!entry) return null;

          let productId: string | null = null;
          let productData: FavoriteItem['product'] = null;

          if (entry.productId) {
            if (
              typeof entry.productId === 'object' &&
              (entry.productId as Record<string, unknown>)?._id
            ) {
              productId = String((entry.productId as Record<string, unknown>)._id);
              productData = entry.productId as FavoriteItem['product'];
            } else if (typeof entry.productId === 'string') {
              productId = entry.productId;
            }
          }

          if (!productId) return null;

          return {
            _id: String(entry._id),
            productId,
            product: productData,
          };
        })
        .filter(Boolean) as FavoriteItem[];

      setFavorites(normalized);
    } catch (err) {
      console.error('Failed to load favorites', err);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToFavorites = useCallback(
    async (productId: string): Promise<boolean> => {
      if (!user) {
        showLoginPrompt({
          title: 'Sign in to save favorites',
          message:
            'Create an account or sign in to save your favorite items and access them anytime.',
        });
        return false;
      }

      try {
        const idString = String(productId);
        await apiFetch('/favorites/add', {
          method: 'POST',
          body: JSON.stringify({ productId: idString }),
        });

        setFavorites((prev) => {
          const exists = prev.some(
            (item) =>
              String(item._id) === idString ||
              String(item.productId) === idString,
          );
          if (!exists) {
            return [...prev, { productId: idString, _id: idString }];
          }
          return prev;
        });

        return true;
      } catch (err: unknown) {
        // 409 = already favorited — treat as success and sync local state
        if (err && typeof err === 'object' && 'status' in err && (err as { status: number }).status === 409) {
          const idString = String(productId);
          setFavorites((prev) => {
            const exists = prev.some(
              (item) =>
                String(item._id) === idString ||
                String(item.productId) === idString,
            );
            if (!exists) {
              return [...prev, { productId: idString, _id: idString }];
            }
            return prev;
          });
          return true;
        }
        console.error('Add to favorites failed', err);
        throw err;
      }
    },
    [user, showLoginPrompt],
  );

  const removeFromFavorites = useCallback(
    async (productId: string): Promise<boolean> => {
      if (!user) return false;

      try {
        const idString = String(productId);
        await apiFetch(`/favorites/${idString}`, { method: 'DELETE' });

        setFavorites((prev) =>
          prev.filter(
            (item) =>
              String(item._id) !== idString &&
              String(item.productId) !== idString,
          ),
        );

        return true;
      } catch (err) {
        console.error('Remove from favorites failed', err);
        throw err;
      }
    },
    [user],
  );

  const isFavorited = useCallback(
    (productId: string): boolean => {
      const idString = String(productId);
      return favorites.some(
        (item) =>
          String(item._id) === idString ||
          String(item.productId) === idString,
      );
    },
    [favorites],
  );

  const checkFavorite = useCallback(
    async (productId: string): Promise<boolean> => {
      if (!user) return false;

      try {
        const idString = String(productId);
        const data = await apiFetch<{
          isFavorited?: boolean;
          favorited?: boolean;
        }>(`/favorites/${idString}/check`);
        return data.isFavorited || data.favorited || false;
      } catch (err) {
        console.error('Check favorite failed', err);
        return false;
      }
    },
    [user],
  );

  const createShareLink = useCallback(
    async (expiresInDays: number | null = null) => {
      if (!user) return null;

      try {
        const response = await apiFetch<{
          data: { shareToken: ShareLink; [key: string]: unknown };
        }>('/wishlist-share', {
          method: 'POST',
          body: JSON.stringify({ expiresIn: expiresInDays }),
        });

        setShareLinks((prev) => [...prev, response.data.shareToken]);
        return response.data;
      } catch (err) {
        console.error('Failed to create share link', err);
        throw err;
      }
    },
    [user],
  );

  const getShareLinks = useCallback(async () => {
    if (!user) return [];

    try {
      const response = await apiFetch<{
        data: { shareLinks: ShareLink[] };
      }>('/wishlist-share');
      setShareLinks(response.data.shareLinks);
      return response.data;
    } catch (err) {
      console.error('Failed to get share links', err);
      return [];
    }
  }, [user]);

  const revokeShareLink = useCallback(
    async (shareTokenId: string): Promise<boolean> => {
      if (!user) return false;

      try {
        await apiFetch(`/wishlist-share/${shareTokenId}/revoke`, {
          method: 'PATCH',
        });

        setShareLinks((prev) =>
          prev.filter((link) => link._id !== shareTokenId),
        );
        return true;
      } catch (err) {
        console.error('Failed to revoke share link', err);
        throw err;
      }
    },
    [user],
  );

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        shareLinks,
        addToFavorites,
        removeFromFavorites,
        isFavorited,
        checkFavorite,
        loadFavorites,
        createShareLink,
        getShareLinks,
        revokeShareLink,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

export const useFavorites = (): FavoritesContextValue => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const useFavoritesState = (): FavoritesState => {
  const { favorites, loading, shareLinks } = useFavorites();
  return { favorites, loading, shareLinks };
};

export const useFavoritesActions = (): FavoritesActions => {
  const {
    addToFavorites,
    removeFromFavorites,
    isFavorited,
    checkFavorite,
    loadFavorites,
    createShareLink,
    getShareLinks,
    revokeShareLink,
  } = useFavorites();
  return {
    addToFavorites,
    removeFromFavorites,
    isFavorited,
    checkFavorite,
    loadFavorites,
    createShareLink,
    getShareLinks,
    revokeShareLink,
  };
};
