'use client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '../../context/AuthContext';
import { CartProvider } from '../../context/CartContext';
import { FavoritesProvider } from '../../context/FavoritesContext';
import { ToastProvider } from '../../context/ToastContext';
import { LoginPromptProvider } from '../../context/LoginPromptContext';
import { CollectionProvider } from '../../context/CollectionContext';

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

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

export default function Providers({ children }) {
  return (
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
  );
}
