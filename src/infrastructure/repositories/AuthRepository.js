/**
 * AuthRepository - Handles all authentication API calls
 * 
 * Implements Repository Pattern for auth operations.
 * Responsible only for API communication, not business logic.
 */

import { BaseRepository } from './BaseRepository';

export class AuthRepository extends BaseRepository {
  constructor(apiClient) {
    super(apiClient, '/auth');
  }

  async login(email, password) {
    const response = await this.apiClient.post(`${this.endpoint}/login`, {
      email,
      password
    });
    return this.normalizeAuthResponse(response);
  }

  async register(name, email, password) {
    const response = await this.apiClient.post(`${this.endpoint}/register`, {
      name,
      email,
      password
    });
    return this.normalizeAuthResponse(response);
  }

  async getProfile() {
    const response = await this.apiClient.get(`${this.endpoint}/profile`);
    return this.normalizeAuthResponse(response);
  }

  async logout() {
    return this.apiClient.post(`${this.endpoint}/logout`, {});
  }

  async updateProfile(data) {
    const response = await this.apiClient.put(`${this.endpoint}/profile`, data);
    return this.normalizeAuthResponse(response);
  }

  async changePassword(currentPassword, newPassword) {
    return this.apiClient.put(`${this.endpoint}/change-password`, {
      currentPassword,
      newPassword
    });
  }

  async verifyEmail(token) {
    return this.apiClient.post(`${this.endpoint}/verify-email`, { token });
  }

  async forgotPassword(email) {
    return this.apiClient.post(`${this.endpoint}/forgot-password`, { email });
  }

  async resetPassword(token, newPassword) {
    return this.apiClient.post(`${this.endpoint}/reset-password`, {
      token,
      newPassword
    });
  }

  /**
   * Normalize auth responses to consistent format
   * @private
   */
  normalizeAuthResponse(response) {
    return {
      user: response.data?.user || response.user || null,
      token: response.data?.accessToken || response.accessToken || response.token || null,
      success: response.success !== false
    };
  }
}
