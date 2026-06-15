/**
 * PayPalPayment - PayPal Payment Strategy
 * 
 * Concrete implementation of PaymentStrategy for PayPal payments.
 * Handles PayPal payment processing.
 */

import { PaymentStrategy } from './PaymentStrategy';

export class PayPalPayment extends PaymentStrategy {
  constructor(paymentGateway) {
    super();
    this.paymentGateway = paymentGateway;
  }

  validate(paymentData) {
    const { email, amount } = paymentData;

    if (!email || email.trim().length === 0) {
      throw new Error('PayPal email is required');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Invalid email format');
    }

    if (amount <= 0) {
      throw new Error('Invalid amount');
    }

    return true;
  }

  async processPayment(paymentData) {
    try {
      this.validate(paymentData);

      const response = await this.paymentGateway.createPayment({
        amount: paymentData.amount,
        currency: paymentData.currency || 'USD',
        payer: {
          type: 'paypal',
          email: paymentData.email
        },
        description: paymentData.description || 'CLOTHI Purchase',
        returnUrl: paymentData.returnUrl,
        cancelUrl: paymentData.cancelUrl
      });

      return {
        success: true,
        transactionId: response.id,
        amount: paymentData.amount,
        method: 'paypal',
        approvalUrl: response.approvalUrl // User must visit this URL
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
    return 'PayPal';
  }
}
