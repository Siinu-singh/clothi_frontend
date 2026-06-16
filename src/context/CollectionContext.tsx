'use client';
import { createContext, useContext, useState, useCallback, type ReactNode, type Dispatch, type SetStateAction } from 'react';
import {
  getCollections,
  getFeaturedCollections,
  searchCollections,
  getCollectionsByCategory,
  getCollectionsByTags,
  getAllCollections,
  getCollectionStats,
  createCollection,
  updateCollection,
  deleteCollection,
  toggleFeaturedCollection,
  toggleActiveCollection,
} from '@/lib/api-collections';
import {
  Collection,
  CollectionListResponse,
  CollectionStats,
  CreateCollectionInput,
  UpdateCollectionInput,
} from '@/models/collection';

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface CollectionContextValue {
  collections: Collection[];
  setCollections: Dispatch<SetStateAction<Collection[]>>;
  featuredCollections: Collection[];
  currentCollection: Collection | null;
  setCurrentCollection: Dispatch<SetStateAction<Collection | null>>;
  stats: CollectionStats | null;
  loading: boolean;
  error: string | null;
  pagination: Pagination;
  loadFeaturedCollections: (page?: number, limit?: number) => Promise<void>;
  loadCollections: (page?: number, limit?: number, filters?: { category?: string; tags?: string[]; search?: string }) => Promise<void>;
  searchCollectionsHandler: (query: string, page?: number, limit?: number) => Promise<void>;
  loadByCategory: (category: string, page?: number, limit?: number) => Promise<void>;
  loadByTags: (tags: string[], page?: number, limit?: number) => Promise<void>;
  loadAllCollections: () => Promise<void>;
  loadStats: () => Promise<void>;
  handleCreateCollection: (data: CreateCollectionInput) => Promise<Collection>;
  handleUpdateCollection: (id: string, data: UpdateCollectionInput) => Promise<Collection>;
  handleDeleteCollection: (id: string) => Promise<void>;
  handleToggleFeatured: (id: string, featured: boolean) => Promise<Collection>;
  handleToggleActive: (id: string, active: boolean) => Promise<Collection>;
}

const CollectionContext = createContext<CollectionContextValue | null>(null);

export function CollectionProvider({ children }: { children: ReactNode }) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [featuredCollections, setFeaturedCollections] = useState<Collection[]>([]);
  const [currentCollection, setCurrentCollection] = useState<Collection | null>(null);
  const [stats, setStats] = useState<CollectionStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Load featured collections
  const loadFeaturedCollections = useCallback(async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getFeaturedCollections(page, limit);
      setFeaturedCollections(response.data || []);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Failed to load featured collections', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load all collections with filters
  const loadCollections = useCallback(async (page = 1, limit = 10, filters?: { category?: string; tags?: string[]; search?: string }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCollections(page, limit, filters);
      setCollections(response.data || []);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Failed to load collections', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search collections
  const searchCollectionsHandler = useCallback(
    async (query: string, page = 1, limit = 10) => {
      try {
        setLoading(true);
        setError(null);
        const response = await searchCollections(query, page, limit);
        setCollections(response.data || []);
        setPagination(response.pagination);
      } catch (err) {
        console.error('Failed to search collections', err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Load collections by category
  const loadByCategory = useCallback(
    async (category: string, page = 1, limit = 10) => {
      try {
        setLoading(true);
        setError(null);
        const response = await getCollectionsByCategory(category, page, limit);
        setCollections(response.data || []);
        setPagination(response.pagination);
      } catch (err) {
        console.error('Failed to load collections by category', err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Load collections by tags
  const loadByTags = useCallback(
    async (tags: string[], page = 1, limit = 10) => {
      try {
        setLoading(true);
        setError(null);
        const response = await getCollectionsByTags(tags, page, limit);
        setCollections(response.data || []);
        setPagination(response.pagination);
      } catch (err) {
        console.error('Failed to load collections by tags', err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Load all collections (no pagination)
  const loadAllCollections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllCollections();
      setCollections(response.data || []);
    } catch (err) {
      console.error('Failed to load all collections', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load collection stats (admin)
  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCollectionStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to load collection stats', err);
      // Check if it's an auth error (401)
      if ((err as Error).message.includes('401') || (err as Error).message.includes('Unauthorized') || (err as Error).message.includes('Invalid or missing token')) {
        setError('Please log in again as admin to access this page.');
        // Optionally redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      } else {
        setError((err as Error).message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Create collection (admin)
  const handleCreateCollection = useCallback(async (data: CreateCollectionInput) => {
    try {
      setError(null);
      const response = await createCollection(data);
      setCollections((prev) => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      console.error('Failed to create collection', err);
      setError((err as Error).message);
      throw err;
    }
  }, []);

  // Update collection (admin)
  const handleUpdateCollection = useCallback(async (id: string, data: UpdateCollectionInput) => {
    try {
      setError(null);
      const response = await updateCollection(id, data);
      setCollections((prev) =>
        prev.map((col) => (col._id === id ? response.data : col))
      );
      if (currentCollection?._id === id) {
        setCurrentCollection(response.data);
      }
      return response.data;
    } catch (err) {
      console.error('Failed to update collection', err);
      setError((err as Error).message);
      throw err;
    }
  }, [currentCollection]);

  // Delete collection (admin)
  const handleDeleteCollection = useCallback(async (id: string) => {
    try {
      setError(null);
      await deleteCollection(id);
      setCollections((prev) => prev.filter((col) => col._id !== id));
      if (currentCollection?._id === id) {
        setCurrentCollection(null);
      }
    } catch (err) {
      console.error('Failed to delete collection', err);
      setError((err as Error).message);
      throw err;
    }
  }, [currentCollection]);

  // Toggle featured (admin)
  const handleToggleFeatured = useCallback(async (id: string, featured: boolean) => {
    try {
      setError(null);
      const response = await toggleFeaturedCollection(id, featured);
      setCollections((prev) =>
        prev.map((col) => (col._id === id ? response.data : col))
      );
      if (currentCollection?._id === id) {
        setCurrentCollection(response.data);
      }
      return response.data;
    } catch (err) {
      console.error('Failed to toggle featured status', err);
      setError((err as Error).message);
      throw err;
    }
  }, [currentCollection]);

  // Toggle active (admin)
  const handleToggleActive = useCallback(async (id: string, active: boolean) => {
    try {
      setError(null);
      const response = await toggleActiveCollection(id, active);
      setCollections((prev) =>
        prev.map((col) => (col._id === id ? response.data : col))
      );
      if (currentCollection?._id === id) {
        setCurrentCollection(response.data);
      }
      return response.data;
    } catch (err) {
      console.error('Failed to toggle active status', err);
      setError((err as Error).message);
      throw err;
    }
  }, [currentCollection]);

  return (
    <CollectionContext.Provider
      value={{
        // State
        collections,
        setCollections,
        featuredCollections,
        currentCollection,
        setCurrentCollection,
        stats,
        loading,
        error,
        pagination,

        // Public loaders
        loadFeaturedCollections,
        loadCollections,
        searchCollectionsHandler,
        loadByCategory,
        loadByTags,
        loadAllCollections,

        // Admin loaders
        loadStats,

        // Admin handlers
        handleCreateCollection,
        handleUpdateCollection,
        handleDeleteCollection,
        handleToggleFeatured,
        handleToggleActive,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
}

export const useCollection = (): CollectionContextValue => {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error('useCollection must be used within CollectionProvider');
  }
  return context;
};
