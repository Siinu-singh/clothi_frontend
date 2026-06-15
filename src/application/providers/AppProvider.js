/**
 * AppProvider - Application Context Provider
 * 
 * Provides the DI container and global application state to all components.
 * Uses React Context to inject dependencies without prop drilling.
 * 
 * SOLID Principles Applied:
 * - Dependency Inversion: Provides container abstraction to all children
 * - Single Responsibility: Only manages dependency injection and global state
 */

import React, { createContext } from 'react';
import { appContainer } from '../container';

export const AppContext = createContext();

export function AppProvider({ children }) {
  return (
    <AppContext.Provider value={{ appContainer }}>
      {children}
    </AppContext.Provider>
  );
}
