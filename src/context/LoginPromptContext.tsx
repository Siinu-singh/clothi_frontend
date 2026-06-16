'use client';
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import LoginPromptModal from '../components/LoginPromptModal/LoginPromptModal';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LoginPromptOptions {
  title?: string;
  message?: string;
}

interface LoginPromptContextValue {
  showLoginPrompt: (options?: LoginPromptOptions) => void;
  hideLoginPrompt: () => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const LoginPromptContext = createContext<LoginPromptContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function LoginPromptProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalProps, setModalProps] = useState<LoginPromptOptions>({});

  const showLoginPrompt = useCallback((options: LoginPromptOptions = {}) => {
    setModalProps({
      title: options.title || 'Sign in to continue',
      message: options.message || 'Please sign in to your account to access this feature.',
    });
    setIsOpen(true);
  }, []);

  const hideLoginPrompt = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <LoginPromptContext.Provider value={{ showLoginPrompt, hideLoginPrompt }}>
      {children}
      <LoginPromptModal
        isOpen={isOpen}
        onClose={hideLoginPrompt}
        title={modalProps.title}
        message={modalProps.message}
      />
    </LoginPromptContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export const useLoginPrompt = (): LoginPromptContextValue => {
  const context = useContext(LoginPromptContext);
  if (!context) {
    // Return a no-op if used outside provider (SSR safety)
    return {
      showLoginPrompt: () => {},
      hideLoginPrompt: () => {},
    };
  }
  return context;
};
