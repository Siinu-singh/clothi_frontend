/**
 * Application-wide constants and configuration
 * Centralized configuration to prevent magic numbers and ensure consistency
 */

export const APP_CONFIG = {
  APP_NAME: 'CLOTHI',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://clothi.co.in',
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  API_TIMEOUT: 30000,
  API_RETRIES: 2,
  API_RETRY_DELAY: 1000,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  LOAD_MORE_INCREMENT: 10,
} as const;

export const FORM_LIMITS = {
  REVIEW_TITLE_MIN: 0,
  REVIEW_TITLE_MAX: 100,
  REVIEW_COMMENT_MIN: 10,
  REVIEW_COMMENT_MAX: 1000,
  PASSWORD_MIN: 12,
  PASSWORD_MAX: 128,
  EMAIL_MAX: 254,
  PRODUCT_TITLE_MAX: 200,
  PRODUCT_DESC_MAX: 5000,
  INPUT_DEFAULT_MAX: 5000,
} as const;

export const RATE_LIMITS = {
  REVIEW_SUBMISSIONS_PER_MINUTE: 5,
  FORM_SUBMISSIONS_PER_MINUTE: 10,
  API_REQUESTS_PER_MINUTE: 60,
} as const;

export const CACHE_TIMES = {
  PRODUCTS: 5 * 60 * 1000,
  PRODUCT_DETAIL: 10 * 60 * 1000,
  CART: 1 * 60 * 1000,
  USER: 10 * 60 * 1000,
  FAVORITES: 5 * 60 * 1000,
  ANNOUNCEMENTS: 15 * 60 * 1000,
} as const;

export const IMAGE_CONFIG = {
  QUALITY: 80,
  FORMATS: ['image/avif', 'image/webp'] as const,
  SIZES: {
    THUMBNAIL: 64,
    SMALL: 256,
    MEDIUM: 512,
    LARGE: 1024,
  },
  DEVICE_SIZES: [640, 750, 828, 1080, 1200, 1920] as const,
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error — please check your connection and try again.',
  UNAUTHORIZED: 'Session expired. Please log in again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  RATE_LIMIT: 'Too many requests. Please wait before trying again.',
} as const;
