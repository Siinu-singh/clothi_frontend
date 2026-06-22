'use client';
import React, { type ReactNode } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../../context/AuthContext';
import { CartProvider } from '../../context/CartContext';
import { FavoritesProvider } from '../../context/FavoritesContext';
import { ToastProvider } from '../../context/ToastContext';
import { LoginPromptProvider } from '../../context/LoginPromptContext';
import { CollectionProvider } from '../../context/CollectionContext';

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

// Suppress harmless Google GSI initialization warnings in the console
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (
      args[0] &&
      typeof args[0] === 'string' &&
      (args[0].includes('google.accounts.id.initialize') || args[0].includes('GSI_LOGGER'))
    ) {
      return;
    }
    originalWarn(...args);
  };
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 2,
    },
  },
});

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={googleClientId}>
        <ToastProvider>
          <AuthProvider>
            <LoginPromptProvider>
              <CartProvider>
                <FavoritesProvider>
                  <CollectionProvider>
                    {children}
                  </CollectionProvider>
                </FavoritesProvider>
              </CartProvider>
            </LoginPromptProvider>
          </AuthProvider>
        </ToastProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}
