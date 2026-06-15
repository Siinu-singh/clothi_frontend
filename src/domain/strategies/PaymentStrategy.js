/**
 * PaymentStrategy - Abstract Payment Strategy Pattern
 * 
 * Defines the interface for all payment strategies.
 * Allows adding new payment methods without modifying existing code (Open/Closed Principle).
 * 
 * SOLID Principles Applied:
 * - Open/Closed: New payment methods can be added as new strategy implementations
 * - Liskov Substitution: All strategies follow same interface
 * - Interface Segregation: Only necessary payment operations exposed
 */

export class PaymentStrategy {
  /**
   * Process payment
   * @param {Object} paymentData - Payment information
   * @returns {Promise<Object>} - Payment result
   */
  async processPayment(paymentData) {
    throw new Error('processPayment() must be implemented');
  }

  /**
   * Validate payment data
   * @param {Object} paymentData - Payment information to validate
   * @returns {boolean} - True if valid
   */
  validate(paymentData) {
    throw new Error('validate() must be implemented');
  }

  /**
   * Refund payment
   * @param {string} transactionId - Transaction ID to refund
   * @returns {Promise<Object>} - Refund result
   */
  async refund(transactionId) {
    throw new Error('refund() must be implemented');
  }

  /**
   * Get payment method name
   * @returns {string} - Name of payment method
   */
  getMethodName() {
    throw new Error('getMethodName() must be implemented');
  }
}
