'use client';
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { ToastContainer } from '../components/Toast/Toast';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ToastItem {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration: number;
}

interface ToastMethods {
  success: (message: string, duration?: number) => number;
  error: (message: string, duration?: number) => number;
  warning: (message: string, duration?: number) => number;
  info: (message: string, duration?: number) => number;
}

interface ToastContextValue {
  toast: ToastMethods;
  addToast: (options: { type?: ToastItem['type']; message: string; duration?: number }) => number;
  removeToast: (id: number) => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ToastContext = createContext<ToastContextValue | null>(null);

let toastIdCounter = 0;

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback(
    ({ type = 'info', message, duration = 2000 }: { type?: ToastItem['type']; message: string; duration?: number }) => {
      const id = ++toastIdCounter;
      setToasts((prev) => [...prev, { id, type, message, duration }]);
      return id;
    },
    [],
  );

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Convenience methods
  const toast: ToastMethods = {
    success: (message, duration) => addToast({ type: 'success', message, duration }),
    error: (message, duration) => addToast({ type: 'error', message, duration }),
    warning: (message, duration) => addToast({ type: 'warning', message, duration }),
    info: (message, duration) => addToast({ type: 'info', message, duration }),
  };

  return (
    <ToastContext.Provider value={{ toast, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    // Return a no-op toast object if used outside provider (SSR safety)
    return {
      toast: {
        success: () => 0,
        error: () => 0,
        warning: () => 0,
        info: () => 0,
      },
      addToast: () => 0,
      removeToast: () => {},
    };
  }
  return context;
};
