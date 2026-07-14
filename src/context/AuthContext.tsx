'use client';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { apiFetch, ApiError } from '../lib/api';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface User {
  _id: string;
  email: string;
  name?: string;
  role?: string;
  avatar?: string;
  [key: string]: unknown; // allow additional backend fields
}

/** Read-only state slice — subscribe to this for rendering. */
interface AuthState {
  user: User | null;
  loading: boolean;
}

/** Action slice — use for mutations only. */
interface AuthActions {
  login: (email: string, password: string) => Promise<{ token: string; user: User }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

type AuthContextValue = AuthState & AuthActions;

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AuthContext = createContext<AuthContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AuthProvider({ children }: { children: ReactNode }) {
  // --- State ---
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // --- Bootstrap: check stored token on mount ---
  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await apiFetch<{ success: boolean; data: User }>('/auth/profile');
          const userData = response.data || (response as unknown as User);
          setUser(userData);
        }
      } catch (err) {
        console.error('Session expired or invalid token', err);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  // --- Listen for global 401 auto-logout events from the API client ---
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
    };
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  // --- Actions ---
  const login = useCallback(
    async (email: string, password: string): Promise<{ token: string; user: User }> => {
      const response = await apiFetch<{
        success: boolean;
        data?: { user: User; accessToken?: string };
        accessToken?: string;
        token?: string;
        user?: User;
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      const token =
        response.data?.accessToken || response.accessToken || response.token;
      const loggedInUser = response.data?.user || response.user;

      if (!token) {
        throw new Error('No token received from server');
      }

      localStorage.setItem('token', token);
      setUser(loggedInUser as User);
      return { token, user: loggedInUser as User };
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' }).catch(() => {
        // Logout succeeds even if backend call fails
      });
    } catch {
      // Silently handle logout errors
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await apiFetch<{ success: boolean; data: User }>('/auth/profile');
        const userData = response.data || (response as unknown as User);
        setUser(userData);
      }
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hooks — segregated for performance
// ---------------------------------------------------------------------------

/** Full context (state + actions). Use in components that need both. */
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/** State-only hook. Use for rendering (avoids re-render on action ref changes). */
export const useAuthState = (): AuthState => {
  const { user, loading } = useAuth();
  return { user, loading };
};

/** Actions-only hook. Use for event handlers. */
export const useAuthActions = (): AuthActions => {
  const { login, logout, refreshUser } = useAuth();
  return { login, logout, refreshUser };
};
