'use client';
import { createContext, useContext, useState, useCallback } from 'react';
import LoginPromptModal from '../components/LoginPromptModal';

const LoginPromptContext = createContext({});

export function LoginPromptProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalProps, setModalProps] = useState({});

  const showLoginPrompt = useCallback((options = {}) => {
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

export const useLoginPrompt = () => {
  const context = useContext(LoginPromptContext);
  if (!context || !context.showLoginPrompt) {
    // Return a no-op if used outside provider (SSR safety)
    return {
      showLoginPrompt: () => {},
      hideLoginPrompt: () => {},
    };
  }
  return context;
};
