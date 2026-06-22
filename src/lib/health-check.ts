/**
 * Health check utilities for monitoring
 */

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  checks: Record<string, boolean>;
  message: string;
}

/**
 * Check if API is reachable
 */
export async function checkApiHealth(apiUrl: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(`${apiUrl}/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Check if localStorage is available
 */
export function checkLocalStorage(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if sessionStorage is available
 */
export function checkSessionStorage(): boolean {
  try {
    const test = '__storage_test__';
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Perform comprehensive health check
 */
export async function performHealthCheck(
  apiUrl: string,
): Promise<HealthCheckResult> {
  const checks = {
    localStorage: checkLocalStorage(),
    sessionStorage: checkSessionStorage(),
    api: await checkApiHealth(apiUrl),
  };

  const allHealthy = Object.values(checks).every((v) => v);
  const allFailing = Object.values(checks).every((v) => !v);

  return {
    status: allHealthy ? 'healthy' : allFailing ? 'unhealthy' : 'degraded',
    timestamp: new Date().toISOString(),
    checks,
    message: allHealthy
      ? 'All systems operational'
      : allFailing
        ? 'Critical: multiple systems down'
        : 'Warning: some systems degraded',
  };
}
