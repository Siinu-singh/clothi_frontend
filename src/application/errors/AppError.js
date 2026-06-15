/**
 * AppError - Standardized Error Class
 * 
 * Provides consistent error handling across the application.
 * All errors should be normalized to this format.
 */

export class AppError extends Error {
  constructor(message, statusCode = 500, context = 'Application') {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.context = context;
    this.timestamp = new Date();
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      context: this.context,
      timestamp: this.timestamp
    };
  }
}

/**
 * Specific error classes
 */

export class ValidationError extends AppError {
  constructor(message, field = null) {
    super(message, 400, 'Validation');
    this.name = 'ValidationError';
    this.field = field;
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'Authentication');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403, 'Authorization');
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource', id = null) {
    const message = id ? `${resource} with ID ${id} not found` : `${resource} not found`;
    super(message, 404, 'NotFound');
    this.name = 'NotFoundError';
    this.resource = resource;
    this.id = id;
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409, 'Conflict');
    this.name = 'ConflictError';
  }
}

export class ServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(message, 500, 'Server');
    this.name = 'ServerError';
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Network request failed') {
    super(message, 0, 'Network');
    this.name = 'NetworkError';
  }
}

/**
 * Error handler utility
 */
export function handleError(error) {
  // If already an AppError, return as is
  if (error instanceof AppError) {
    return error;
  }

  // Handle Fetch API errors
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return new NetworkError(error.message);
  }

  // Handle network errors
  if (error.message === 'Network Error' || error.message === 'timeout of') {
    return new NetworkError(error.message);
  }

  // Handle generic errors
  return new AppError(
    error.message || 'An unexpected error occurred',
    error.statusCode || 500,
    error.context || 'Application'
  );
}
