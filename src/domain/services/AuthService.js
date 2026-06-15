/**
 * AuthService - Authentication Business Logic
 * 
 * Handles authentication operations using AuthRepository.
 * Implements Dependency Inversion by depending on repository abstraction.
 * 
 * SOLID Principles Applied:
 * - Single Responsibility: Only handles auth business logic
 * - Open/Closed: Can extend without modifying
 * - Liskov Substitution: Repository can be swapped
 * - Interface Segregation: Only necessary methods exposed
 * - Dependency Inversion: Depends on AuthRepository abstraction
 */

import { BaseService } from './BaseService';

export class AuthService extends BaseService {
  constructor(authRepository, notificationService) {
    super('AuthService');
    this.authRepository = authRepository;
    this.notificationService = notificationService;
  }

  async login(email, password) {
    try {
      this.log('login attempt', { email });

      const result = await this.authRepository.login(email, password);

      if (result.token) {
        this.log('login successful', { email });
        await this.notificationService?.success(`Welcome back!`);
        return result;
      } else {
        throw new Error('No token received from server');
      }
    } catch (error) {
      return this.handleError(error, 'login');
    }
  }

  async register(name, email, password) {
    try {
      this.log('register attempt', { email, name });

      const result = await this.authRepository.register(name, email, password);

      if (result.token) {
        this.log('registration successful', { email });
        await this.notificationService?.success('Welcome to CLOTHI!');
        return result;
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      return this.handleError(error, 'register');
    }
  }

  async logout() {
    try {
      this.log('logout attempt');
      await this.authRepository.logout().catch(() => {
        // Logout succeeds even if backend call fails
      });
      this.log('logout successful');
      return { success: true };
    } catch (error) {
      return this.handleError(error, 'logout');
    }
  }

  async getProfile() {
    try {
      this.log('fetching profile');
      const result = await this.authRepository.getProfile();
      return result;
    } catch (error) {
      return this.handleError(error, 'getProfile');
    }
  }

  async updateProfile(data) {
    try {
      this.log('updating profile', { fields: Object.keys(data) });
      const result = await this.authRepository.updateProfile(data);
      await this.notificationService?.success('Profile updated successfully');
      return result;
    } catch (error) {
      return this.handleError(error, 'updateProfile');
    }
  }

  async changePassword(currentPassword, newPassword) {
    try {
      this.log('changing password');
      await this.authRepository.changePassword(currentPassword, newPassword);
      this.log('password changed successfully');
      await this.notificationService?.success('Password changed successfully');
      return { success: true };
    } catch (error) {
      return this.handleError(error, 'changePassword');
    }
  }

  async verifyEmail(token) {
    try {
      this.log('verifying email');
      const result = await this.authRepository.verifyEmail(token);
      this.log('email verified');
      await this.notificationService?.success('Email verified successfully');
      return result;
    } catch (error) {
      return this.handleError(error, 'verifyEmail');
    }
  }

  async forgotPassword(email) {
    try {
      this.log('forgot password request', { email });
      await this.authRepository.forgotPassword(email);
      await this.notificationService?.success('Reset link sent to your email');
      return { success: true };
    } catch (error) {
      return this.handleError(error, 'forgotPassword');
    }
  }

  async resetPassword(token, newPassword) {
    try {
      this.log('resetting password');
      await this.authRepository.resetPassword(token, newPassword);
      this.log('password reset successful');
      await this.notificationService?.success('Password reset successful');
      return { success: true };
    } catch (error) {
      return this.handleError(error, 'resetPassword');
    }
  }
}
