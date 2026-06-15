/**
 * NotificationService - User Notifications/Toast Messages
 * 
 * Centralized notification management service.
 * Provides unified interface for displaying toast messages.
 * Can be integrated with toast libraries (React Toastify, Sonner, etc.)
 * 
 * SOLID Principles Applied:
 * - Single Responsibility: Only handles notifications
 * - Open/Closed: Can extend with new notification types
 * - Dependency Inversion: Depends on notification store abstraction
 */

export class NotificationService {
  constructor(notificationStore = null) {
    this.notificationStore = notificationStore;
    this.listeners = [];
  }

  /**
   * Register a listener for notifications
   */
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  /**
   * Emit notification to all listeners
   * @private
   */
  emit(notification) {
    this.listeners.forEach(listener => listener(notification));
    if (this.notificationStore) {
      this.notificationStore.addNotification(notification);
    }
  }

  /**
   * Show success notification
   */
  async success(message, duration = 3000) {
    const notification = {
      id: Date.now(),
      type: 'success',
      message,
      duration,
      timestamp: new Date()
    };

    console.log('[Notification] Success:', message);
    this.emit(notification);

    if (duration > 0) {
      return new Promise(resolve => {
        setTimeout(resolve, duration);
      });
    }
  }

  /**
   * Show error notification
   */
  async error(message, duration = 5000) {
    const notification = {
      id: Date.now(),
      type: 'error',
      message,
      duration,
      timestamp: new Date()
    };

    console.error('[Notification] Error:', message);
    this.emit(notification);

    if (duration > 0) {
      return new Promise(resolve => {
        setTimeout(resolve, duration);
      });
    }
  }

  /**
   * Show info notification
   */
  async info(message, duration = 3000) {
    const notification = {
      id: Date.now(),
      type: 'info',
      message,
      duration,
      timestamp: new Date()
    };

    console.log('[Notification] Info:', message);
    this.emit(notification);

    if (duration > 0) {
      return new Promise(resolve => {
        setTimeout(resolve, duration);
      });
    }
  }

  /**
   * Show warning notification
   */
  async warning(message, duration = 4000) {
    const notification = {
      id: Date.now(),
      type: 'warning',
      message,
      duration,
      timestamp: new Date()
    };

    console.warn('[Notification] Warning:', message);
    this.emit(notification);

    if (duration > 0) {
      return new Promise(resolve => {
        setTimeout(resolve, duration);
      });
    }
  }

  /**
   * Show loading notification (must be closed manually)
   */
  loading(message) {
    const notification = {
      id: Date.now(),
      type: 'loading',
      message,
      duration: 0, // Don't auto-dismiss
      timestamp: new Date()
    };

    console.log('[Notification] Loading:', message);
    this.emit(notification);

    // Return dismisser function
    return () => {
      this.emit({ ...notification, type: 'dismiss', id: notification.id });
    };
  }
}
