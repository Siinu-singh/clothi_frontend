'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Verify token and get user profile from auth/profile endpoint
          const response = await apiFetch('/auth/profile');
          // Backend returns { success, data: { _id, email, ... } }
          const userData = response.data || response.user || response;
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

  const login = async (email, password) => {
    try {
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      // Backend returns { success, data: { user, accessToken }, message }
      const token = response.data?.accessToken || response.accessToken || response.token;
      const user = response.data?.user || response.user;
      
      if (token) {
        localStorage.setItem('token', token);
        setUser(user);
        return { token, user };
      } else {
        throw new Error('No token received from server');
      }
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint
      await apiFetch('/auth/logout', { method: 'POST' }).catch(() => {
        // Logout still succeeds even if backend call fails
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
