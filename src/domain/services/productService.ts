/**
 * Product Service - Handles all product-related API calls
 * Service layer pattern for clean architecture
 */

import { apiFetch } from '@/lib/api';
import { PAGINATION } from '@/config/constants';

export interface ProductFilters {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'popular';
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
}

export interface Product {
  _id: string;
  title: string;
  description?: string;
  price: number;
  oldPrice?: number;
  image: string;
  images?: string[];
  category: string;
  badge?: string;
  colors?: string[];
  sizes?: string[];
  materials?: string;
  sizeGuide?: string;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsResponse {
  data: Product[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ProductService {
  private baseUrl = '/products';

  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
    if (filters.size) queryParams.append('size', filters.size);
    if (filters.color) queryParams.append('color', filters.color);
    
    queryParams.append('page', (filters.page || 1).toString());
    queryParams.append('limit', (filters.limit || PAGINATION.DEFAULT_PAGE_SIZE).toString());

    const query = queryParams.toString();
    const url = query ? `${this.baseUrl}?${query}` : this.baseUrl;

    return apiFetch<ProductsResponse>(url, {
      method: 'GET',
      maxRetries: 2,
    });
  }

  async getProductById(id: string): Promise<Product> {
    if (!id || typeof id !== 'string') {
      throw new Error('Product ID is required and must be a string');
    }

    const response = await apiFetch<{ data: Product }>(`${this.baseUrl}/${id}`, {
      method: 'GET',
      maxRetries: 2,
    });

    return response.data || (response as unknown as Product);
  }

  async searchProducts(query: string): Promise<Product[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const response = await apiFetch<ProductsResponse>(`${this.baseUrl}?search=${encodeURIComponent(query)}`, {
      method: 'GET',
      maxRetries: 1,
    });

    return response.data || [];
  }

  async getProductsByCategory(category: string, limit?: number): Promise<Product[]> {
    if (!category) {
      throw new Error('Category is required');
    }

    const response = await this.getProducts({
      category,
      limit: limit || PAGINATION.DEFAULT_PAGE_SIZE,
    });

    return response.data;
  }

  async getFeaturedProducts(limit = 10): Promise<Product[]> {
    const response = await apiFetch<ProductsResponse>(`${this.baseUrl}?featured=true&limit=${limit}`, {
      method: 'GET',
      maxRetries: 2,
    });

    return response.data || [];
  }

  async getNewArrivals(limit = 10): Promise<Product[]> {
    const response = await this.getProducts({
      sortBy: 'newest',
      limit,
    });

    return response.data;
  }
}

// Singleton instance
export const productService = new ProductService();
