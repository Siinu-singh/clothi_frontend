/**
 * Container - Dependency Injection Container
 * 
 * Centralized dependency management for all services, repositories, and strategies.
 * Implements the Dependency Inversion Principle by decoupling object creation from usage.
 * 
 * SOLID Principles Applied:
 * - Dependency Inversion: All dependencies resolved through DI container
 * - Single Responsibility: Only handles dependency creation and management
 * - Open/Closed: Easy to register new dependencies without modifying container
 */

export class Container {
  constructor() {
    this.services = new Map();
    this.singletons = new Map();
  }

  /**
   * Register a service/dependency
   * @param {string} name - Service name
   * @param {Function} factory - Factory function to create instance
   * @param {Object} options - Options (singleton: true/false)
   */
  register(name, factory, options = {}) {
    if (typeof factory !== 'function') {
      throw new Error(`Factory for "${name}" must be a function`);
    }

    this.services.set(name, {
      factory,
      singleton: options.singleton || false
    });
  }

  /**
   * Resolve a service
   * @param {string} name - Service name
   * @returns {*} - Service instance
   */
  resolve(name) {
    if (!this.services.has(name)) {
      throw new Error(`Service "${name}" is not registered`);
    }

    const { factory, singleton } = this.services.get(name);

    // Return singleton instance if already created
    if (singleton && this.singletons.has(name)) {
      return this.singletons.get(name);
    }

    // Create new instance
    const instance = factory(this);

    // Store singleton
    if (singleton) {
      this.singletons.set(name, instance);
    }

    return instance;
  }

  /**
   * Check if service is registered
   */
  has(name) {
    return this.services.has(name);
  }

  /**
   * Clear all singletons
   */
  clearSingletons() {
    this.singletons.clear();
  }

  /**
   * Clear all registrations
   */
  clear() {
    this.services.clear();
    this.singletons.clear();
  }
}

/**
 * Create and configure the application container
 */
export function createContainer() {
  const container = new Container();

  // Register Infrastructure Layer
  container.register('apiClient', (c) => {
    const { ApiClient } = require('../infrastructure/api/ApiClient');
    return new ApiClient();
  }, { singleton: true });

  container.register('cacheDecorator', (c) => {
    const { CacheDecorator } = require('../infrastructure/decorators/CacheDecorator');
    return new CacheDecorator(c.resolve('apiClient'));
  }, { singleton: true });

  container.register('retryDecorator', (c) => {
    const { RetryDecorator } = require('../infrastructure/decorators/RetryDecorator');
    return new RetryDecorator(c.resolve('cacheDecorator'));
  }, { singleton: true });

  // Register Repositories
  container.register('authRepository', (c) => {
    const { AuthRepository } = require('../infrastructure/repositories/AuthRepository');
    return new AuthRepository(c.resolve('retryDecorator'));
  }, { singleton: true });

  container.register('cartRepository', (c) => {
    const { CartRepository } = require('../infrastructure/repositories/CartRepository');
    return new CartRepository(c.resolve('retryDecorator'));
  }, { singleton: true });

  container.register('productRepository', (c) => {
    const { ProductRepository } = require('../infrastructure/repositories/ProductRepository');
    return new ProductRepository(c.resolve('retryDecorator'));
  }, { singleton: true });

  container.register('favoritesRepository', (c) => {
    const { FavoritesRepository } = require('../infrastructure/repositories/FavoritesRepository');
    return new FavoritesRepository(c.resolve('retryDecorator'));
  }, { singleton: true });

  // Register Domain Services
  container.register('notificationService', (c) => {
    const { NotificationService } = require('../domain/services/NotificationService');
    return new NotificationService();
  }, { singleton: true });

  container.register('authService', (c) => {
    const { AuthService } = require('../domain/services/AuthService');
    return new AuthService(
      c.resolve('authRepository'),
      c.resolve('notificationService')
    );
  }, { singleton: true });

  container.register('cartService', (c) => {
    const { CartService } = require('../domain/services/CartService');
    return new CartService(
      c.resolve('cartRepository'),
      c.resolve('productRepository'),
      c.resolve('notificationService')
    );
  }, { singleton: true });

  container.register('productService', (c) => {
    const { ProductService } = require('../domain/services/ProductService');
    return new ProductService(c.resolve('productRepository'));
  }, { singleton: true });

  container.register('favoritesService', (c) => {
    const { FavoritesService } = require('../domain/services/FavoritesService');
    return new FavoritesService(
      c.resolve('favoritesRepository'),
      c.resolve('notificationService')
    );
  }, { singleton: true });

  // Register Payment Strategies
  container.register('creditCardPayment', (c) => {
    const { CreditCardPayment } = require('../domain/strategies/CreditCardPayment');
    // Note: Replace with actual payment gateway implementation
    return new CreditCardPayment(null);
  });

  container.register('paypalPayment', (c) => {
    const { PayPalPayment } = require('../domain/strategies/PayPalPayment');
    // Note: Replace with actual payment gateway implementation
    return new PayPalPayment(null);
  });

  container.register('applePayPayment', (c) => {
    const { ApplePayPayment } = require('../domain/strategies/GooglePayPayment');
    // Note: Replace with actual payment gateway implementation
    return new ApplePayPayment(null);
  });

  return container;
}

// Export singleton instance
export const appContainer = createContainer();
