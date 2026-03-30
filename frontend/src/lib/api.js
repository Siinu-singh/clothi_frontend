// Helper to parse JSON or throw errors nicely
export async function apiFetch(endpoint, options = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  const url = `${baseUrl}${endpoint}`;
  
  // Set default headers, extracting token from localStorage if exists
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}
