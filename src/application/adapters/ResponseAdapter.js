/**
 * ResponseAdapter - Response Normalization Adapter
 * 
 * Normalizes API responses to consistent format across all endpoints.
 * Implements the Adapter Pattern to convert inconsistent API responses.
 * 
 * SOLID Principles Applied:
 * - Adapter Pattern: Converts inconsistent API responses to standard format
 * - Single Responsibility: Only handles response normalization
 */

import { handleError } from './AppError';

export class ResponseAdapter {
  /**
   * Normalize any API response to standard format
   */
  static normalize(response) {
    try {
      // If response is already normalized, return as is
      if (this.isNormalized(response)) {
        return response;
      }

      // Handle different response formats
      if (response.data !== undefined) {
        return {
          success: response.success !== false,
          data: response.data,
          message: response.message || '',
          statusCode: response.statusCode || 200
        };
      }

      if (response.results !== undefined) {
        return {
          success: true,
          data: response.results,
          message: '',
          statusCode: 200
        };
      }

      // Assume entire response is data
      return {
        success: true,
        data: response,
        message: '',
        statusCode: 200
      };
    } catch (error) {
      const appError = handleError(error);
      return {
        success: false,
        data: null,
        message: appError.message,
        statusCode: appError.statusCode,
        error: appError
      };
    }
  }

  /**
   * Normalize list responses (pagination, filtering)
   */
  static normalizeList(response, defaultLimit = 20) {
    const normalized = this.normalize(response);

    const data = normalized.data;
    const isArray = Array.isArray(data);

    return {
      success: normalized.success,
      items: isArray ? data : data?.items || data?.results || [],
      total: data?.total || data?.count || (isArray ? data.length : 0),
      page: data?.page || 1,
      limit: data?.limit || defaultLimit,
      pages: data?.pages || Math.ceil((data?.total || 0) / (data?.limit || defaultLimit)),
      message: normalized.message,
      statusCode: normalized.statusCode
    };
  }

  /**
   * Normalize single item response
   */
  static normalizeSingle(response) {
    const normalized = this.normalize(response);

    return {
      success: normalized.success,
      item: normalized.data,
      message: normalized.message,
      statusCode: normalized.statusCode
    };
  }

  /**
   * Normalize error response
   */
  static normalizeError(error) {
    const appError = handleError(error);

    return {
      success: false,
      data: null,
      message: appError.message,
      statusCode: appError.statusCode,
      error: appError,
      context: appError.context
    };
  }

  /**
   * Check if response is already normalized
   * @private
   */
  static isNormalized(response) {
    return (
      response &&
      typeof response === 'object' &&
      'success' in response &&
      'data' in response &&
      'message' in response &&
      'statusCode' in response
    );
  }
}
