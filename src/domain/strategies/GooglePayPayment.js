/**
 * ApplePayPayment - Apple Pay Payment Strategy
 * 
 * Concrete implementation of PaymentStrategy for Apple Pay payments.
 * Handles Apple Pay payment processing.
 */

import { PaymentStrategy } from './PaymentStrategy';

export class ApplePayPayment extends PaymentStrategy {
  constructor(paymentGateway) {
    super();
    this.paymentGateway = paymentGateway;
  }

  validate(paymentData) {
    const { token, amount } = paymentData;

    if (!token || token.trim().length === 0) {
      throw new Error('Apple Pay token is required');
    }

    if (amount <= 0) {
      throw new Error('Invalid amount');
    }

    return true;
  }

  async processPayment(paymentData) {
    try {
      this.validate(paymentData);

      const response = await this.paymentGateway.charge({
        amount: paymentData.amount,
        currency: paymentData.currency || 'USD',
        source: {
          type: 'apple_pay',
          token: paymentData.token
        },
        description: paymentData.description || 'CLOTHI Purchase'
      });

      return {
        success: true,
        transactionId: response.id,
        amount: paymentData.amount,
        method: 'apple_pay'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async refund(transactionId) {
    try {
      const response = await this.paymentGateway.refund(transactionId);

      return {
        success: true,
        transactionId: response.id
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  getMethodName() {
    return 'Apple Pay';
  }
}
