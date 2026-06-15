/**
 * RetryDecorator - Decorator Pattern Implementation
 * 
 * Adds automatic retry logic with exponential backoff
 * to any API client. Retries on network errors and 5xx status codes.
 * 
 * SOLID Principles Applied:
 * - Single Responsibility: Only handles retries
 * - Open/Closed: Can be stacked with other decorators
 * - Liskov Substitution: Works with any client interface
 */

export class RetryDecorator {
  constructor(client, maxRetries = 3, initialDelayMs = 1000) {
    this.client = client;
    this.maxRetries = maxRetries;
    this.initialDelayMs = initialDelayMs;
  }

  /**
   * Sleep for specified duration
   * @private
   */
  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if error is retryable
   * @private
   */
  isRetryable(error) {
    // Retry on network errors
    if (error.statusCode === 0) return true;

    // Retry on 5xx errors
    if (error.statusCode >= 500) return true;

    // Retry on timeout (408)
    if (error.statusCode === 408) return true;

    // Retry on rate limit (429)
    if (error.statusCode === 429) return true;

    return false;
  }

  /**
   * Calculate backoff delay with jitter
   * @private
   */
  calculateDelay(attempt) {
    const exponentialDelay = this.initialDelayMs * Math.pow(2, attempt);
    const jitter = Math.random() * 0.1 * exponentialDelay;
    return exponentialDelay + jitter;
  }

  /**
   * Make request with retry logic
   * @private
   */
  async requestWithRetry(method, attempt, ...args) {
    try {
      return await this.client[method](...args);
    } catch (error) {
      if (attempt < this.maxRetries && this.isRetryable(error)) {
        const delay = this.calculateDelay(attempt);
        console.warn(
          `Retry attempt ${attempt + 1}/${this.maxRetries} for ${method} after ${Math.round(delay)}ms`,
          error.message
        );

        await this.sleep(delay);
        return this.requestWithRetry(method, attempt + 1, ...args);
      }

      throw error;
    }
  }

  /**
   * Public methods that delegate to wrapped client with retry logic
   */
  get(endpoint, customHeaders = {}) {
    return this.requestWithRetry('get', 0, endpoint, customHeaders);
  }

  post(endpoint, data, customHeaders = {}) {
    return this.requestWithRetry('post', 0, endpoint, data, customHeaders);
  }

  put(endpoint, data, customHeaders = {}) {
    return this.requestWithRetry('put', 0, endpoint, data, customHeaders);
  }

  delete(endpoint, customHeaders = {}) {
    return this.requestWithRetry('delete', 0, endpoint, customHeaders);
  }

  patch(endpoint, data, customHeaders = {}) {
    return this.requestWithRetry('patch', 0, endpoint, data, customHeaders);
  }
}
