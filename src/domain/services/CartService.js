/**
 * CartService - Shopping Cart Business Logic
 * 
 * Handles cart operations using CartRepository.
 * Implements Command-like pattern for complex operations.
 * Coordinates between repositories and notification service.
 * 
 * SOLID Principles Applied:
 * - Single Responsibility: Only handles cart business logic
 * - Open/Closed: Can extend with new strategies
 * - Liskov Substitution: Repository can be swapped
 * - Interface Segregation: Only necessary methods exposed
 * - Dependency Inversion: Depends on abstractions
 */

import { BaseService } from './BaseService';

export class CartService extends BaseService {
  constructor(cartRepository, productRepository, notificationService) {
    super('CartService');
    this.cartRepository = cartRepository;
    this.productRepository = productRepository;
    this.notificationService = notificationService;
  }

  async getCart() {
    try {
      this.log('fetching cart');
      const cart = await this.cartRepository.getCart();
      return { success: true, cart };
    } catch (error) {
      return this.handleError(error, 'getCart');
    }
  }

  async addToCart(productId, quantity = 1, size = 'M', color = 'Default') {
    try {
      this.log('adding to cart', { productId, quantity, size, color });

      // Validate inputs
      if (!productId || quantity < 1) {
        throw new Error('Invalid product ID or quantity');
      }

      const updatedCart = await this.cartRepository.addItem(
        productId,
        quantity,
        size,
        color
      );

      this.log('item added to cart', { productId, quantity });
      await this.notificationService?.success('Added to cart!');

      return { success: true, cart: updatedCart };
    } catch (error) {
      return this.handleError(error, 'addToCart');
    }
  }

  async removeFromCart(itemId) {
    try {
      this.log('removing from cart', { itemId });

      const updatedCart = await this.cartRepository.removeItem(itemId);

      this.log('item removed from cart', { itemId });
      await this.notificationService?.success('Removed from cart');

      return { success: true, cart: updatedCart };
    } catch (error) {
      return this.handleError(error, 'removeFromCart');
    }
  }

  async updateQuantity(itemId, quantity) {
    try {
      this.log('updating quantity', { itemId, quantity });

      if (quantity < 1) {
        // Remove item if quantity < 1
        return this.removeFromCart(itemId);
      }

      const updatedCart = await this.cartRepository.updateItem(itemId, quantity);

      this.log('quantity updated', { itemId, quantity });

      return { success: true, cart: updatedCart };
    } catch (error) {
      return this.handleError(error, 'updateQuantity');
    }
  }

  async clearCart() {
    try {
      this.log('clearing cart');

      const emptyCart = await this.cartRepository.clearCart();

      this.log('cart cleared');
      await this.notificationService?.success('Cart cleared');

      return { success: true, cart: emptyCart };
    } catch (error) {
      return this.handleError(error, 'clearCart');
    }
  }

  async applyCoupon(couponCode) {
    try {
      if (!couponCode || couponCode.trim().length === 0) {
        throw new Error('Coupon code is required');
      }

      this.log('applying coupon', { couponCode });

      const updatedCart = await this.cartRepository.applyCoupon(couponCode);

      if (updatedCart.coupon) {
        this.log('coupon applied', { couponCode, discount: updatedCart.discount });
        await this.notificationService?.success(
          `Coupon applied! You saved $${updatedCart.discount.toFixed(2)}`
        );
      } else {
        throw new Error('Coupon code is invalid or expired');
      }

      return { success: true, cart: updatedCart };
    } catch (error) {
      return this.handleError(error, 'applyCoupon');
    }
  }

  /**
   * Calculate cart summary (subtotal, tax, shipping, total)
   */
  calculateCartSummary(cart, shippingCost = 0) {
    try {
      const subtotal = cart.items.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      );

      const tax = subtotal * 0.1; // Assuming 10% tax
      const discount = cart.discount || 0;
      const shipping = shippingCost;

      const total = subtotal + tax + shipping - discount;

      return {
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        discount: parseFloat(discount.toFixed(2)),
        shipping: parseFloat(shipping.toFixed(2)),
        total: parseFloat(total.toFixed(2))
      };
    } catch (error) {
      this.logError('calculateCartSummary', error);
      return null;
    }
  }
}
