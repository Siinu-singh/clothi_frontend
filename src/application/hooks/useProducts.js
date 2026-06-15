/**
 * useProducts - Product Catalog Hook
 * 
 * Segregated interface for product operations.
 * Depends on ProductService through DI container.
 * 
 * SOLID Principles Applied:
 * - Interface Segregation: Only exposes product-related interface
 * - Dependency Inversion: Depends on ProductService abstraction
 */

import { useContext, useCallback, useState } from 'react';
import { AppContext } from '../providers/AppProvider';

export function useProducts() {
  const { appContainer } = useContext(AppContext);
  const productService = appContainer.resolve('productService');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllProducts = useCallback(async (filters = {}, pagination = { page: 1, limit: 20 }) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await productService.getAllProducts(filters, pagination);

      if (!result.success) {
        setError(result.error || 'Failed to fetch products');
      }

      return result;
    } finally {
      setIsLoading(false);
    }
  }, [productService]);

  const getProduct = useCallback(async (productId) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await productService.getProduct(productId);

      if (!result.success) {
        setError(result.error || 'Failed to fetch product');
      }

      return result;
    } finally {
      setIsLoading(false);
    }
  }, [productService]);

  const searchProducts = useCallback(async (query, filters = {}, pagination = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await productService.searchProducts(query, filters, pagination);

      if (!result.success) {
        setError(result.error || 'Failed to search products');
      }

      return result;
    } finally {
      setIsLoading(false);
    }
  }, [productService]);

  const getProductsByCategory = useCallback(async (category, filters = {}, pagination = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await productService.getProductsByCategory(category, filters, pagination);

      if (!result.success) {
        setError(result.error || 'Failed to fetch category products');
      }

      return result;
    } finally {
      setIsLoading(false);
    }
  }, [productService]);

  const getRelatedProducts = useCallback(async (productId) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await productService.getRelatedProducts(productId);

      if (!result.success) {
        setError(result.error || 'Failed to fetch related products');
      }

      return result;
    } finally {
      setIsLoading(false);
    }
  }, [productService]);

  const getProductReviews = useCallback(async (productId) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await productService.getProductReviews(productId);

      if (!result.success) {
        setError(result.error || 'Failed to fetch reviews');
      }

      return result;
    } finally {
      setIsLoading(false);
    }
  }, [productService]);

  const addReview = useCallback(async (productId, reviewData) => {
    setError(null);

    try {
      const result = await productService.addReview(productId, reviewData);

      if (!result.success) {
        setError(result.error || 'Failed to add review');
      }

      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [productService]);

  return {
    getAllProducts,
    getProduct,
    searchProducts,
    getProductsByCategory,
    getRelatedProducts,
    getProductReviews,
    addReview,
    isLoading,
    error
  };
}
