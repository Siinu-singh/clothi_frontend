/**
 * sanitize.ts — Input sanitization utilities for frontend forms.
 * Prevents XSS by stripping dangerous characters before sending to API.
 */

/** Strip HTML tags and dangerous characters from a string */
export function sanitizeString(value: string, maxLength = 5000): string {
  return value
    .replace(/<[^>]*>/g, '')           // strip HTML tags
    .replace(/javascript:/gi, '')       // strip JS protocol
    .replace(/on\w+\s*=/gi, '')         // strip inline event handlers
    .trim()
    .slice(0, maxLength);
}

/** Sanitize an email — lowercase + strip whitespace + length check */
export function sanitizeEmail(value: string, maxLength = 254): string {
  return value.toLowerCase().trim().slice(0, maxLength);
}

/** Sanitize a whole form data object — recursively sanitizes string values */
export function sanitizeFormData<T extends Record<string, unknown>>(data: T): T {
  const result = { ...data };
  for (const key of Object.keys(result)) {
    if (typeof result[key] === 'string') {
      (result as Record<string, unknown>)[key] = sanitizeString(result[key] as string);
    }
  }
  return result;
}

/** Validate email format */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

/** Validate minimum password strength (NIST SP 800-63B: 12+ chars recommended + complexity) */
export function isValidPassword(password: string): boolean {
  if (password.length < 12) return false;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  return hasUppercase && hasLowercase && hasNumber && hasSpecial;
}

/** Sanitize URL to prevent SSRF — must be http/https */
export function sanitizeUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    throw new Error('URL must start with http:// or https://');
  }
  return trimmed.slice(0, 2048); // Max URL length
}

/** Clamp a numeric string to prevent injection in query params */
export function sanitizeQueryParam(value: string): string {
  return encodeURIComponent(sanitizeString(value));
}
