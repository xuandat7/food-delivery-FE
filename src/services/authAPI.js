// Auth API service
import { BASE_URL, handleError, AsyncStorage } from './apiConfig';

/**
 * Authentication related API calls
 */
const authAPI = {
  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {boolean} isRestaurant - Whether user is restaurant or customer
   * @returns {Promise} - API response
   */
  login: async (email, password, isRestaurant = false) => {
    try {
      console.log(`Attempting login as ${isRestaurant ? 'RESTAURANT' : 'CUSTOMER'} with email: ${email}`);
      
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
      console.log('Login response status:', response.status);
      console.log('Login response data:', data);
      
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
      // Add role to user data and ensure field names match backend expectations
      const completeUserData = {
        email: userData.email,
        password: userData.password,
        role: isRestaurant ? 'RESTAURANT' : 'CUSTOMER',
        name: userData.name
      };
      
      console.log(`Attempting to register ${isRestaurant ? 'restaurant' : 'customer'} account:`, completeUserData);
      
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

export default authAPI; 