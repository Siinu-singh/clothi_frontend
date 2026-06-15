/**
 * ApiClient - Facade Pattern Implementation
 * 
 * Provides a unified interface for all API communication
 * with built-in JWT token management, error handling,
 * and support for decorators (retry, cache, etc.)
 * 
 * SOLID Principles Applied:
 * - Single Responsibility: Only handles HTTP communication
 * - Open/Closed: Extensible via decorators
 * - Liskov Substitution: Can be replaced with GraphQL client
 * - Interface Segregation: Minimal public interface
 * - Dependency Inversion: Depends on abstraction (decorators)
 */

export class ApiError extends Error {
  constructor(statusCode, message, response) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.response = response;
  }
}

export class ApiClient {
  constructor(baseURL, getToken = () => null) {
    this.baseURL = baseURL;
    this.getToken = getToken;
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    };
  }

  /**
   * Get headers with authorization token
   * @private
   */
  getHeaders(customHeaders = {}) {
    const headers = { ...this.defaultHeaders, ...customHeaders };
    const token = this.getToken();

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Make HTTP request
   * @private
   */
  async request(method, endpoint, data = null, customHeaders = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const options = {
      method,
      headers: this.getHeaders(customHeaders),
      ...(data && { body: JSON.stringify(data) })
    };

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          response.status,
          errorData.message || `HTTP ${response.status}`,
          errorData
        );
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        0,
        error.message || 'Network request failed',
        error
      );
    }
  }

  /**
   * GET request
   */
  get(endpoint, customHeaders = {}) {
    return this.request('GET', endpoint, null, customHeaders);
  }

  /**
   * POST request
   */
  post(endpoint, data, customHeaders = {}) {
    return this.request('POST', endpoint, data, customHeaders);
  }

  /**
   * PUT request
   */
  put(endpoint, data, customHeaders = {}) {
    return this.request('PUT', endpoint, data, customHeaders);
  }

  /**
   * DELETE request
   */
  delete(endpoint, customHeaders = {}) {
    return this.request('DELETE', endpoint, null, customHeaders);
  }

  /**
   * PATCH request
   */
  patch(endpoint, data, customHeaders = {}) {
    return this.request('PATCH', endpoint, data, customHeaders);
  }
}
