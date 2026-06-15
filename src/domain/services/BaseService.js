/**
 * BaseService - Base class for all services
 * 
 * Implements common error handling and logging patterns
 * for all service classes.
 */

export class BaseService {
  constructor(name) {
    this.serviceName = name;
  }

  /**
   * Log service activity
   * @protected
   */
  log(action, details = {}) {
    console.log(`[${this.serviceName}] ${action}`, details);
  }

  /**
   * Log service error
   * @protected
   */
  logError(action, error) {
    console.error(`[${this.serviceName}] ${action} FAILED:`, error);
  }

  /**
   * Handle errors with consistent format
   * @protected
   */
  handleError(error, context = '') {
    this.logError(context, error);

    // Return normalized error object
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
      statusCode: error.statusCode || 500,
      context
    };
  }
}
