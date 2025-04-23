/**
 * API service for handling network requests
 */

// Base URL for API calls
const BASE_URL = 'https://api.example.com';

/**
 * Handles API errors and formats them appropriately
 * @param {Error} error - Error object
 * @returns {Object} - Formatted error object
 */
const handleError = (error) => {
  console.error('API Error:', error);
  return {
    success: false,
    message: error.message || 'Something went wrong',
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
   * @returns {Promise} - API response
   */
  login: async (email, password) => {
    try {
      // This is a mock response. In a real app, you would call fetch() here
      // Example: const response = await fetch(`${BASE_URL}/auth/login`, { method: 'POST', ... });
      
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'Login successful',
        data: { token: 'mock_token', user: { email } }
      };
    } catch (error) {
      return handleError(error);
    }
  },
  
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - API response
   */
  register: async (userData) => {
    try {
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'Registration successful',
        data: { user: { email: userData.email } }
      };
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
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'Recovery code sent',
        data: null
      };
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
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'OTP verified successfully',
        data: null
      };
    } catch (error) {
      return handleError(error);
    }
  },
  
  /**
   * Reset password with new password
   * @param {string} email - User email
   * @param {string} password - New password
   * @returns {Promise} - API response
   */
  resetPassword: async (email, password) => {
    try {
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'Password reset successful',
        data: null
      };
    } catch (error) {
      return handleError(error);
    }
  }
};

export default {
  auth: authAPI
}; 