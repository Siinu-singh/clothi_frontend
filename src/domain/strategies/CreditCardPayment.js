/**
 * CreditCardPayment - Credit Card Payment Strategy
 * 
 * Concrete implementation of PaymentStrategy for credit card payments.
 * Handles credit card payment processing with validation.
 */

import { PaymentStrategy } from './PaymentStrategy';

export class CreditCardPayment extends PaymentStrategy {
  constructor(paymentGateway) {
    super();
    this.paymentGateway = paymentGateway;
  }

  validate(paymentData) {
    const { cardNumber, expiryDate, cvv, amount } = paymentData;

    if (!cardNumber || cardNumber.trim().length === 0) {
      throw new Error('Card number is required');
    }

    if (!this.isValidCardNumber(cardNumber)) {
      throw new Error('Invalid card number format');
    }

    if (!expiryDate || !this.isValidExpiry(expiryDate)) {
      throw new Error('Invalid expiry date');
    }

    if (!cvv || cvv.length < 3 || cvv.length > 4) {
      throw new Error('Invalid CVV');
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
          type: 'card',
          cardNumber: paymentData.cardNumber,
          expiryDate: paymentData.expiryDate,
          cvv: paymentData.cvv,
          cardholderName: paymentData.cardholderName
        },
        description: paymentData.description || 'CLOTHI Purchase'
      });

      return {
        success: true,
        transactionId: response.id,
        amount: paymentData.amount,
        method: 'credit_card'
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
    return 'Credit Card';
  }

  /**
   * Luhn algorithm for card validation
   * @private
   */
  isValidCardNumber(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, '');

    if (!/^\d{13,19}$/.test(cleaned)) {
      return false;
    }

    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  /**
   * Validate card expiry date (MM/YY format)
   * @private
   */
  isValidExpiry(expiryDate) {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;

    if (!regex.test(expiryDate)) {
      return false;
    }

    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    const expYear = parseInt(year, 10);
    const expMonth = parseInt(month, 10);

    if (expYear < currentYear) {
      return false;
    }

    if (expYear === currentYear && expMonth < currentMonth) {
      return false;
    }

    return true;
  }
}
