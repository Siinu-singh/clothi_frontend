/**
 * useAuth - Authentication Hook
 * 
 * Segregated interface for authentication operations.
 * Depends on AuthService through DI container.
 * 
 * SOLID Principles Applied:
 * - Interface Segregation: Only exposes auth-related interface
 * - Dependency Inversion: Depends on AuthService abstraction
 * - Single Responsibility: Only handles auth hook logic
 */

import { useContext, useCallback, useState } from 'react';
import { AppContext } from '../providers/AppProvider';

export function useAuth() {
  const { appContainer } = useContext(AppContext);
  const authService = appContainer.resolve('authService');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.login(email, password);

      if (!result.success) {
        setError(result.error || 'Login failed');
        return result;
      }

      return result;
    } finally {
      setIsLoading(false);
    }
  }, [authService]);

  const register = useCallback(async (name, email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.register(name, email, password);

      if (!result.success) {
        setError(result.error || 'Registration failed');
        return result;
      }

      return result;
    } finally {
      setIsLoading(false);
    }
  }, [authService]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      return await authService.logout();
    } finally {
      setIsLoading(false);
    }
  }, [authService]);

  const getProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.getProfile();

      if (!result.success) {
        setError(result.error || 'Failed to fetch profile');
      }

      return result;
    } finally {
      setIsLoading(false);
    }
  }, [authService]);

  const updateProfile = useCallback(async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.updateProfile(data);

      if (!result.success) {
        setError(result.error || 'Failed to update profile');
      }

      return result;
    } finally {
      setIsLoading(false);
    }
  }, [authService]);

  return {
    login,
    register,
    logout,
    getProfile,
    updateProfile,
    isLoading,
    error
  };
}
