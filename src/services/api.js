/**
 * API service for handling network requests
 */
// Uncomment this after installation
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Base URL for API calls - THAY ĐỔI IP NÀY THÀNH IP THỰC TẾ CỦA MÁY TÍNH CỦA BẠN
const BASE_URL = 'http://192.168.53.105:4000'; // Đổi cổng từ 3001 thành 4000

// Log API URL
console.log('Using API URL:', BASE_URL);

// Export for use in components
export { AsyncStorage, BASE_URL };

/**
 * Handles API errors and formats them appropriately
 * @param {Error} error - Error object
 * @returns {Object} - Formatted error object
 */
const handleError = (error) => {
  console.error('API Error:', error);
  
  // Return simplified error format
  return {
    success: false,
    message: error.message || 'Đã xảy ra lỗi khi kết nối đến máy chủ',
    data: null
  };
};

/**
 * Authentication related API calls
 */
export const authAPI = {
  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {boolean} isRestaurant - Whether user is restaurant or customer
   * @returns {Promise} - API response
   */
  login: async (email, password, isRestaurant = false) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          role: isRestaurant ? 'RESTAURANT' : 'CUSTOMER'
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
      return { success: true, message: 'Login successful', data: data };
    } catch (error) {
      return handleError(error);
    }
  },
  
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {boolean} isRestaurant - Whether user is restaurant or customer
   * @returns {Promise} - API response
   */
  register: async (userData, isRestaurant = false) => {
    try {
      // Add role to user data
      const completeUserData = {
        ...userData,
        role: isRestaurant ? 'RESTAURANT' : 'CUSTOMER'
      };
      
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completeUserData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Register failed');
      return { success: true, message: 'Registration successful', data: data };
    } catch (error) {
      return handleError(error);
    }
  },
  
  /**
   * Send password reset code
   * @param {string} email - User email
   * @returns {Promise} - API response
   */
  forgotPassword: async (email) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Forgot password failed');
      return { success: true, message: 'Recovery code sent', data: data };
    } catch (error) {
      return handleError(error);
    }
  },
  
  /**
   * Verify OTP code
   * @param {string} email - User email
   * @param {string} otp - One-time password
   * @returns {Promise} - API response
   */
  verifyOTP: async (email, otp) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Verify OTP failed');
      return { success: true, message: 'OTP verified successfully', data: data };
    } catch (error) {
      return handleError(error);
    }
  },
  
  /**
   * Reset password with new password
   * @param {string} email - User email
   * @param {string} otp - OTP code
   * @param {string} newPassword - New password
   * @returns {Promise} - API response
   */
  resetPassword: async (email, otp, newPassword) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Reset password failed');
      return { success: true, message: 'Password reset successful', data: data };
    } catch (error) {
      return handleError(error);
    }
  },
  
  /**
   * Logout user
   * @returns {Promise} - API response
   */
  logout: async () => {
    try {
      const token = await AsyncStorage.getItem('token') || '';
      const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Logout failed');
      
      // Clear token from storage
      await AsyncStorage.removeItem('token');
      
      return { success: true, message: 'Logout successful', data: null };
    } catch (error) {
      return handleError(error);
    }
  }
};

/**
 * User related API calls
 */
export const userAPI = {
  /**
   * Get current user profile
   * @returns {Promise} - API response
   */
  getProfile: async () => {
    try {
      const token = await AsyncStorage.getItem('token') || '';
      console.log('Using token for profile request:', token);
      
      if (!token) {
        console.error('No token available for profile request');
        return { 
          success: false, 
          message: 'Bạn chưa đăng nhập!', 
          data: null 
        };
      }
      
      const response = await fetch(`${BASE_URL}/users/profile`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      
      console.log('Profile response status:', response.status);
      
      const data = await response.json();
      console.log('Profile response data:', data);
      
      if (!response.ok) {
        console.error('Profile request failed:', data);
        throw new Error(data.message || 'Failed to fetch profile');
      }
      
      return { success: true, message: 'Profile fetched successfully', data: data };
    } catch (error) {
      console.error('Profile request error:', error);
      return handleError(error);
    }
  },
  
  /**
   * Update user profile
   * @param {number} id - User ID
   * @param {Object} userData - User profile data to update
   * @returns {Promise} - API response
   */
  updateProfile: async (id, userData) => {
    try {
      const token = await AsyncStorage.getItem('token') || '';
      const formData = new FormData();
      
      // Add text fields
      if (userData.full_name) formData.append('full_name', userData.full_name);
      if (userData.phone) formData.append('phone', userData.phone);
      if (userData.address) formData.append('address', userData.address);
      
      // Add avatar if present
      if (userData.avatar && userData.avatar.uri) {
        const uriParts = userData.avatar.uri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        
        formData.append('avatar', {
          uri: userData.avatar.uri,
          name: `avatar.${fileType}`,
          type: `image/${fileType}`,
        });
      }
      
      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type when sending FormData
        },
        body: formData
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update profile');
      return { success: true, message: 'Profile updated successfully', data: data };
    } catch (error) {
      return handleError(error);
    }
  }
};

export default {
  auth: authAPI,
  user: userAPI
}; 