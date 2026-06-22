/**
 * API Client with interceptors, retry logic, and global error handling.
 *
 * Features:
 *  - Request interceptors (auto-attach auth token)
 *  - Response interceptors (global error boundary)
 *  - Exponential backoff retry logic
 *  - 401 auto-logout
 *  - Request deduplication via AbortController
 */

import { sleep } from './utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  body?: string | FormData | null;
  /** Skip the default JSON Content-Type header (e.g. for FormData) */
  skipContentType?: boolean;
  /** Max retries on network/5xx errors (default: 2) */
  maxRetries?: number;
  /** Retry delay in ms (default: 1000) */
  retryDelay?: number;
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// ---------------------------------------------------------------------------
// Request deduplication cache
// ---------------------------------------------------------------------------

const requestCache = new Map<string, Promise<unknown>>();

function getCacheKey(endpoint: string, method?: string): string {
  return `${method || 'GET'}:${endpoint}`;
}

// ---------------------------------------------------------------------------
// Interceptors
// ---------------------------------------------------------------------------

type RequestInterceptor = (
  url: string,
  options: RequestInit,
) => { url: string; options: RequestInit };

type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

const requestInterceptors: RequestInterceptor[] = [];
const responseInterceptors: ResponseInterceptor[] = [];

/** Register a request interceptor. Returns an unsubscribe function. */
export function addRequestInterceptor(fn: RequestInterceptor): () => void {
  requestInterceptors.push(fn);
  return () => {
    const idx = requestInterceptors.indexOf(fn);
    if (idx !== -1) requestInterceptors.splice(idx, 1);
  };
}

/** Register a response interceptor. Returns an unsubscribe function. */
export function addResponseInterceptor(fn: ResponseInterceptor): () => void {
  responseInterceptors.push(fn);
  return () => {
    const idx = responseInterceptors.indexOf(fn);
    if (idx !== -1) responseInterceptors.splice(idx, 1);
  };
}

// ---------------------------------------------------------------------------
// Core fetch wrapper with retry logic
// ---------------------------------------------------------------------------

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const maxRetries = options.maxRetries ?? 2;
  const initialDelay = options.retryDelay ?? 1000;
  const method = options.method || 'GET';

  // GET requests can use cache to deduplicate concurrent requests
  if (method === 'GET') {
    const cacheKey = getCacheKey(endpoint, method);
    if (requestCache.has(cacheKey)) {
      return requestCache.get(cacheKey) as Promise<T>;
    }

    const promise = apiFetchWithRetry<T>(endpoint, options, maxRetries, initialDelay);
    requestCache.set(cacheKey, promise);
    return promise.finally(() => requestCache.delete(cacheKey));
  }

  return apiFetchWithRetry<T>(endpoint, options, maxRetries, initialDelay);
}

async function apiFetchWithRetry<T>(
  endpoint: string,
  options: ApiFetchOptions,
  maxRetries: number,
  initialDelay: number,
): Promise<T> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  let url = `${baseUrl}/api${endpoint}`;
  let lastError: Error | null = null;

  // Exponential backoff retry loop
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // --- Build headers ---
      const headers: Record<string, string> = {};

      // Only set Content-Type for requests with a JSON body
      if (options.body && !options.skipContentType) {
        headers['Content-Type'] = 'application/json';
      }

      // Attach auth token (client-side only)
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      let fetchOptions: RequestInit = {
        ...options,
        headers: {
          ...headers,
          ...(options.headers as Record<string, string>),
        },
      };

      // --- Run request interceptors ---
      for (const interceptor of requestInterceptors) {
        const result = interceptor(url, fetchOptions);
        url = result.url;
        fetchOptions = result.options;
      }

      // --- Execute fetch ---
      let response: Response;
      try {
        response = await fetch(url, fetchOptions);
      } catch (networkError) {
        // Retry on network-level failures
        if (attempt < maxRetries) {
          const delay = initialDelay * Math.pow(2, attempt);
          await sleep(delay);
          lastError = new Error(
            `Network error (attempt ${attempt + 1}/${maxRetries + 1}) — retrying...`,
          );
          continue;
        }
        throw new ApiError(
          'Network error — please check your connection and try again.',
          0,
        );
      }

      // --- Run response interceptors ---
      for (const interceptor of responseInterceptors) {
        response = await interceptor(response);
      }

      // --- Handle errors ---
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message =
          (errorData as { message?: string })?.message ||
          `HTTP error! status: ${response.status}`;

        // 401 — token expired / invalid → auto-logout
        if (response.status === 401 && typeof window !== 'undefined') {
          localStorage.removeItem('token');
          window.dispatchEvent(new CustomEvent('auth:logout'));
        }

        // Retry on 5xx errors (server failure)
        if (response.status >= 500 && attempt < maxRetries) {
          const delay = initialDelay * Math.pow(2, attempt);
          await sleep(delay);
          lastError = new ApiError(
            `Server error (attempt ${attempt + 1}/${maxRetries + 1}) — retrying...`,
            response.status,
            errorData,
          );
          continue;
        }

        throw new ApiError(message, response.status, errorData);
      }

      // Success
      return response.json() as Promise<T>;
    } catch (error) {
      // If this was our last attempt, throw the error
      if (attempt === maxRetries) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(
          error instanceof Error ? error.message : 'Unknown error',
          500,
        );
      }

      // Otherwise, save error and continue loop for retry
      lastError = error as Error;
    }
  }

  // This should never be reached due to the throw in the loop, but TypeScript doesn't know
  throw lastError || new ApiError('Request failed', 500);
}
