/**
 * useNotifications - Notifications Hook
 * 
 * Segregated interface for notification operations.
 * Depends on NotificationService through DI container.
 * 
 * SOLID Principles Applied:
 * - Interface Segregation: Only exposes notification-related interface
 * - Dependency Inversion: Depends on NotificationService abstraction
 */

import { useContext, useCallback } from 'react';
import { AppContext } from '../providers/AppProvider';

export function useNotifications() {
  const { appContainer } = useContext(AppContext);
  const notificationService = appContainer.resolve('notificationService');

  const success = useCallback((message, duration = 3000) => {
    return notificationService.success(message, duration);
  }, [notificationService]);

  const error = useCallback((message, duration = 5000) => {
    return notificationService.error(message, duration);
  }, [notificationService]);

  const info = useCallback((message, duration = 3000) => {
    return notificationService.info(message, duration);
  }, [notificationService]);

  const warning = useCallback((message, duration = 4000) => {
    return notificationService.warning(message, duration);
  }, [notificationService]);

  const loading = useCallback((message) => {
    return notificationService.loading(message);
  }, [notificationService]);

  const subscribe = useCallback((callback) => {
    return notificationService.subscribe(callback);
  }, [notificationService]);

  return {
    success,
    error,
    info,
    warning,
    loading,
    subscribe
  };
}
