/**
 * BaseRepository - Repository Pattern Implementation
 * 
 * Abstract base class for all repositories. Provides common CRUD operations
 * and implements Dependency Inversion by depending on an ApiClient abstraction.
 * 
 * SOLID Principles Applied:
 * - Single Responsibility: Only handles data access
 * - Open/Closed: Extendable by subclasses
 * - Liskov Substitution: All repositories follow same interface
 * - Interface Segregation: Only provides necessary methods
 * - Dependency Inversion: Depends on ApiClient abstraction
 */

export class BaseRepository {
  constructor(apiClient, endpoint) {
    this.apiClient = apiClient;
    this.endpoint = endpoint;
  }

  /**
   * Normalize response to consistent format
   * @protected
   */
  normalizeResponse(response) {
    // Override in subclasses if needed
    return response.data || response;
  }

  /**
   * Get all items
   */
  async getAll(filters = {}, pagination = {}) {
    const params = new URLSearchParams({
      ...filters,
      ...pagination
    });

    const queryString = params.toString();
    const url = queryString ? `${this.endpoint}?${queryString}` : this.endpoint;

    const response = await this.apiClient.get(url);
    return this.normalizeResponse(response);
  }

  /**
   * Get single item by ID
   */
  async getOne(id) {
    const response = await this.apiClient.get(`${this.endpoint}/${id}`);
    return this.normalizeResponse(response);
  }

  /**
   * Create new item
   */
  async create(data) {
    const response = await this.apiClient.post(this.endpoint, data);
    return this.normalizeResponse(response);
  }

  /**
   * Update existing item
   */
  async update(id, data) {
    const response = await this.apiClient.put(`${this.endpoint}/${id}`, data);
    return this.normalizeResponse(response);
  }

  /**
   * Delete item
   */
  async delete(id) {
    const response = await this.apiClient.delete(`${this.endpoint}/${id}`);
    return this.normalizeResponse(response);
  }

  /**
   * Batch delete items
   */
  async deleteBatch(ids) {
    const response = await this.apiClient.post(`${this.endpoint}/batch-delete`, { ids });
    return this.normalizeResponse(response);
  }
}
