/**
 * ProductService - Product/Catalog Business Logic
 * 
 * Handles product-related operations using ProductRepository.
 * Implements filtering, searching, and catalog management.
 * 
 * SOLID Principles Applied:
 * - Single Responsibility: Only handles product business logic
 * - Open/Closed: Can extend with new search strategies
 * - Dependency Inversion: Depends on ProductRepository abstraction
 */

import { BaseService } from './BaseService';

export class ProductService extends BaseService {
  constructor(productRepository) {
    super('ProductService');
    this.productRepository = productRepository;
  }

  async getAllProducts(filters = {}, pagination = { page: 1, limit: 20 }) {
    try {
      this.log('fetching all products', { filters, pagination });

      const result = await this.productRepository.getAll(filters, pagination);

      this.log('products fetched', { count: result.products?.length || 0 });

      return { success: true, ...result };
    } catch (error) {
      return this.handleError(error, 'getAllProducts');
    }
  }

  async getProduct(productId) {
    try {
      this.log('fetching product', { productId });

      const product = await this.productRepository.getOne(productId);

      this.log('product fetched', { productId });

      return { success: true, product };
    } catch (error) {
      return this.handleError(error, 'getProduct');
    }
  }

  async searchProducts(query, filters = {}, pagination = {}) {
    try {
      if (!query || query.trim().length === 0) {
        throw new Error('Search query is required');
      }

      this.log('searching products', { query, filters });

      const result = await this.productRepository.search(query, filters, pagination);

      this.log('search completed', { count: result.products?.length || 0 });

      return { success: true, ...result };
    } catch (error) {
      return this.handleError(error, 'searchProducts');
    }
  }

  async getProductsByCategory(category, filters = {}, pagination = {}) {
    try {
      if (!category) {
        throw new Error('Category is required');
      }

      this.log('fetching products by category', { category });

      const result = await this.productRepository.getByCategory(
        category,
        filters,
        pagination
      );

      this.log('category products fetched', { count: result.products?.length || 0 });

      return { success: true, ...result };
    } catch (error) {
      return this.handleError(error, 'getProductsByCategory');
    }
  }

  async getRelatedProducts(productId) {
    try {
      this.log('fetching related products', { productId });

      const result = await this.productRepository.getRelated(productId);

      this.log('related products fetched', { count: result.products?.length || 0 });

      return { success: true, ...result };
    } catch (error) {
      return this.handleError(error, 'getRelatedProducts');
    }
  }

  async getProductReviews(productId) {
    try {
      this.log('fetching reviews', { productId });

      const reviews = await this.productRepository.getReviews(productId);

      this.log('reviews fetched', { count: reviews?.length || 0 });

      return { success: true, reviews };
    } catch (error) {
      return this.handleError(error, 'getProductReviews');
    }
  }

  async addReview(productId, reviewData) {
    try {
      this.log('adding review', { productId });

      // Validate review data
      if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      if (!reviewData.comment || reviewData.comment.trim().length < 10) {
        throw new Error('Comment must be at least 10 characters');
      }

      await this.productRepository.addReview(productId, reviewData);

      this.log('review added successfully', { productId });

      return { success: true, message: 'Review added successfully' };
    } catch (error) {
      return this.handleError(error, 'addReview');
    }
  }

  /**
   * Apply business logic to filter and sort products
   * Can be extended with different sorting strategies
   */
  applyProductFilters(products, filters = {}) {
    try {
      let filtered = [...products];

      // Filter by category
      if (filters.category) {
        filtered = filtered.filter(p => p.category === filters.category);
      }

      // Filter by price range
      if (filters.minPrice || filters.maxPrice) {
        filtered = filtered.filter(p => {
          const price = p.price || 0;
          const min = filters.minPrice || 0;
          const max = filters.maxPrice || Number.MAX_VALUE;
          return price >= min && price <= max;
        });
      }

      // Filter by color
      if (filters.color) {
        filtered = filtered.filter(p =>
          p.colors?.includes(filters.color)
        );
      }

      // Filter by size
      if (filters.size) {
        filtered = filtered.filter(p =>
          p.sizes?.includes(filters.size)
        );
      }

      // Sort products
      if (filters.sortBy) {
        filtered.sort((a, b) => {
          switch (filters.sortBy) {
            case 'price-low-to-high':
              return a.price - b.price;
            case 'price-high-to-low':
              return b.price - a.price;
            case 'newest':
              return new Date(b.createdAt) - new Date(a.createdAt);
            case 'bestselling':
              return (b.sales || 0) - (a.sales || 0);
            case 'rating':
              return (b.rating || 0) - (a.rating || 0);
            default:
              return 0;
          }
        });
      }

      return filtered;
    } catch (error) {
      this.logError('applyProductFilters', error);
      return products;
    }
  }
}
