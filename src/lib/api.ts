/**
 * API Client with interceptors and global error handling.
 *
 * Features:
 *  - Request interceptors (auto-attach auth token)
 *  - Response interceptors (global error boundary)
 *  - 401 auto-logout
 *  - Typed options / error classes
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  body?: string | FormData | null;
  /** Skip the default JSON Content-Type header (e.g. for FormData) */
  skipContentType?: boolean;
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
// Core fetch wrapper
// ---------------------------------------------------------------------------

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  let url = `${baseUrl}/api${endpoint}`;

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
    // Network-level failure (offline, DNS, CORS, etc.)
    throw new ApiError(
      'Network error — please check your connection and try again.',
      0,
    );
  }

  // --- Run response interceptors ---
  for (const interceptor of responseInterceptors) {
    response = await interceptor(response);
  }

  // --- Global error handling ---
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message =
      (errorData as { message?: string })?.message ||
      `HTTP error! status: ${response.status}`;

    // 401 — token expired / invalid → auto-logout
    if (response.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      // Dispatch a custom event so AuthContext can react without circular imports
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }

    throw new ApiError(message, response.status, errorData);
  }

  return response.json() as Promise<T>;
}
