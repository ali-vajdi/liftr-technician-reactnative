import apiClient from './api';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, API_ENDPOINTS } from '../config/api.config';
import type { Technician, LoginResponse, SendOtpResponse, ApiErrorResponse, CheckUpdateResponse } from '../types';

export type { Technician, LoginResponse, CheckUpdateResponse };

class AuthService {
  /**
   * Login with phone number and password
   */
  async login(phoneNumber: string, password: string): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.TECHNICIAN.LOGIN, {
        phone_number: phoneNumber,
        password: password,
      });

      // Store token and user data
      await this.storeAuthData(response.data.token, response.data.technician);

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Send OTP to phone number
   */
  async sendOtp(phoneNumber: string): Promise<SendOtpResponse> {
    try {
      const response = await apiClient.post<SendOtpResponse>(API_ENDPOINTS.TECHNICIAN.SEND_OTP, {
        phone_number: phoneNumber,
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Verify OTP and login
   */
  async verifyOtp(phoneNumber: string, otpCode: string): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.TECHNICIAN.VERIFY_OTP, {
        phone_number: phoneNumber,
        otp_code: otpCode,
      });

      // Store token and user data
      await this.storeAuthData(response.data.token, response.data.technician);

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.TECHNICIAN.LOGOUT);
    } catch (error) {
      // Silently handle logout errors
    } finally {
      // Always clear local data
      await this.clearAuthData();
    }
  }

  /**
   * Check authentication status
   */
  async checkAuth(): Promise<{ authenticated: boolean; technician: Technician }> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.TECHNICIAN.CHECK_AUTH);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get technician profile
   */
  async getProfile(): Promise<Technician> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.TECHNICIAN.PROFILE);
      const profileData = response.data.data;
      
      // Check if technician status is false - if so, logout
      if (profileData.status === false) {
        // Clear auth data and throw error to trigger logout
        await this.clearAuthData();
        throw new Error('TECHNICIAN_STATUS_DISABLED');
      }
      
      // Transform to Technician interface
      const technician: Technician = {
        id: profileData.id,
        phone_number: profileData.phone_number,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        full_name: profileData.full_name,
        national_id: profileData.national_id,
        organization_id: profileData.organization_id,
        organization_name: profileData.organization_name,
        organization: profileData.organization,
        status: profileData.status ?? true,
        has_credentials: true,
      };
      
      // Update stored technician data
      await AsyncStorage.setItem('technician_data', JSON.stringify(technician));
      
      return technician;
    } catch (error: any) {
      // Re-throw the status disabled error as-is
      if (error.message === 'TECHNICIAN_STATUS_DISABLED') {
        throw error;
      }
      throw this.handleError(error);
    }
  }

  /**
   * Get stored auth token
   */
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      return null;
    }
  }

  /**
   * Get stored technician data
   */
  async getTechnician(): Promise<Technician | null> {
    try {
      const data = await AsyncStorage.getItem('technician_data');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Check for app updates
   * This uses a direct axios call to avoid showing loading modal and auth requirements
   */
  async checkUpdate(platform: string, version: string): Promise<CheckUpdateResponse> {
    try {
      // Use direct axios call to bypass interceptors (no loading, no auth required)
      const response = await axios.post<CheckUpdateResponse>(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.TECHNICIAN.CHECK_UPDATE}`,
        {
          platform,
          version,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          timeout: API_CONFIG.TIMEOUT,
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Store auth data (token and technician)
   */
  private async storeAuthData(token: string, technician: Technician): Promise<void> {
    try {
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('technician_data', JSON.stringify(technician));
    } catch (error) {
      throw new Error('خطا در ذخیره اطلاعات احراز هویت');
    }
  }

  /**
   * Clear auth data
   */
  private async clearAuthData(): Promise<void> {
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('technician_data');
    } catch (error) {
      // Silently handle clear errors
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error
      // Try to extract error message from different response structures
      let errorMessage = 'خطای سرور';
      
      if (error.response.data) {
        // Check if error is in message field
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        // Check if error is in error field
        else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
        // Check if error is in errors array (validation errors)
        else if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          errorMessage = error.response.data.errors[0] || errorMessage;
        }
        // Check if it's a string
        else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      }
      
      return new Error(errorMessage);
    } else if (error.request) {
      // Request made but no response
      return new Error('خطا در برقراری ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید.');
    } else {
      // Something else happened
      return new Error(error.message || 'خطای نامشخص');
    }
  }
}

export default new AuthService();

