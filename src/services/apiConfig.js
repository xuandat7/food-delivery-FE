/**
 * API configuration and utilities
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Base URL cho API calls - sử dụng biến môi trường hoặc fallback URL
const BASE_URL = process.env.API_URL || 'http://172.20.10.5:4000';  // 10.0.2.2 dùng cho Android Emulator để trỏ đến localhost của máy chủ

// Log API URL
console.log('Using API URL:', BASE_URL);

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

// Export for use in other API modules
export { AsyncStorage, BASE_URL, handleError }; 