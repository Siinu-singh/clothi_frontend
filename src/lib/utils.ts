/**
 * Utility functions for common operations
 */

/** Sleep for a given number of milliseconds */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Password validation with industry standards:
 * - Minimum 12 characters (NIST-aligned)
 * - Mix of uppercase, lowercase, numbers, special chars
 */
export function isValidPassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 12) {
    errors.push('Password must be at least 12 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain uppercase letters');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain lowercase letters');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain numbers');
  }
  if (!/[!@#$%^&*()_\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain special characters');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Email validation using RFC 5322 simplified pattern
 * More secure than naive regex patterns
 */
export function isValidEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email) && email.length <= 254;
}

/**
 * URL validation - ensures only http/https, validates against private IPs
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }
    // Block private/internal IPs
    const hostname = parsed.hostname;
    const privateIpPatterns = [
      /^127\./, // 127.0.0.0/8
      /^192\.168\./, // 192.168.0.0/16
      /^10\./, // 10.0.0.0/8
      /^172\.(1[6-9]|2[0-9]|3[01])\./, // 172.16.0.0/12
      /^localhost$/i,
      /^::1$/, // IPv6 loopback
      /^fc00:/i, // IPv6 unique local
    ];
    return !privateIpPatterns.some((pattern) => pattern.test(hostname));
  } catch {
    return false;
  }
}

/**
 * Validate environment variables at build/runtime
 */
export function validateEnv(variables: string[]): string[] {
  const missing: string[] = [];
  for (const variable of variables) {
    if (!process.env[variable]) {
      missing.push(variable);
    }
  }
  return missing;
}

/**
 * Rate limiter using in-memory sliding window
 */
export class RateLimiter {
  private requests: number[] = [];

  constructor(
    private maxRequests: number,
    private windowMs: number,
  ) {}

  isAllowed(): boolean {
    const now = Date.now();
    // Remove old entries outside window
    this.requests = this.requests.filter((time) => now - time < this.windowMs);

    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }
    return false;
  }

  getRemainingTime(): number {
    if (this.requests.length === 0) return 0;
    const oldest = this.requests[0];
    const remaining = this.windowMs - (Date.now() - oldest);
    return Math.max(0, remaining);
  }
}

/**
 * Deep clone object safely
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as T;
  }
  if (obj instanceof Object) {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  return obj;
}
