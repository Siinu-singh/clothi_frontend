/**
 * CacheDecorator - Decorator Pattern Implementation
 * 
 * Adds caching layer for GET requests to reduce API calls
 * and improve performance. Supports cache invalidation and TTL.
 * 
 * SOLID Principles Applied:
 * - Single Responsibility: Only handles caching
 * - Open/Closed: Can be stacked with other decorators
 * - Liskov Substitution: Works with any client interface
 */

export class CacheDecorator {
  constructor(client, cacheDurationMs = 5 * 60 * 1000) {
    this.client = client;
    this.cacheDurationMs = cacheDurationMs;
    this.cache = new Map();
  }

  /**
   * Generate cache key from method and endpoint
   * @private
   */
  getCacheKey(method, endpoint) {
    return `${method}:${endpoint}`;
  }

  /**
   * Check if cached data is still valid
   * @private
   */
  isCacheValid(cacheEntry) {
    if (!cacheEntry) return false;

    const age = Date.now() - cacheEntry.timestamp;
    return age < this.cacheDurationMs;
  }

  /**
   * Get from cache if available and valid
   * @private
   */
  getFromCache(method, endpoint) {
    const key = this.getCacheKey(method, endpoint);
    const cached = this.cache.get(key);

    if (this.isCacheValid(cached)) {
      console.log(`Cache hit: ${key}`);
      return cached.data;
    }

    if (cached) {
      this.cache.delete(key);
    }

    return null;
  }

  /**
   * Store in cache
   * @private
   */
  setCache(method, endpoint, data) {
    const key = this.getCacheKey(method, endpoint);
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Clear all cache or specific keys
   */
  clearCache(pattern = null) {
    if (!pattern) {
      this.cache.clear();
      console.log('Cache cleared');
      return;
    }

    // Clear cache matching pattern (e.g., 'GET:/products')
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Invalidate specific endpoints
   */
  invalidate(...endpoints) {
    endpoints.forEach(endpoint => this.clearCache(endpoint));
  }

  /**
   * GET with caching
   */
  async get(endpoint, customHeaders = {}) {
    const cached = this.getFromCache('GET', endpoint);
    if (cached !== null) {
      return cached;
    }

    const data = await this.client.get(endpoint, customHeaders);
    this.setCache('GET', endpoint, data);
    return data;
  }

  /**
   * POST invalidates related cache
   */
  async post(endpoint, data, customHeaders = {}) {
    const result = await this.client.post(endpoint, data, customHeaders);
    // Invalidate GET caches related to this resource
    this.invalidate(endpoint.split('/')[1]); // Invalidate collection
    return result;
  }

  /**
   * PUT invalidates related cache
   */
  async put(endpoint, data, customHeaders = {}) {
    const result = await this.client.put(endpoint, data, customHeaders);
    this.invalidate(endpoint.split('/')[1]);
    return result;
  }

  /**
   * DELETE invalidates related cache
   */
  async delete(endpoint, customHeaders = {}) {
    const result = await this.client.delete(endpoint, customHeaders);
    this.invalidate(endpoint.split('/')[1]);
    return result;
  }

  /**
   * PATCH invalidates related cache
   */
  async patch(endpoint, data, customHeaders = {}) {
    const result = await this.client.patch(endpoint, data, customHeaders);
    this.invalidate(endpoint.split('/')[1]);
    return result;
  }
}
