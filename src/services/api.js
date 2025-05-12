/**
 * API service for handling network requests
 */
// Uncomment this after installation
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Base URL cho API calls - sử dụng biến môi trường hoặc fallback URL
const BASE_URL = process.env.API_URL || 'http://192.168.1.41:3001';  // 10.0.2.2 dùng cho Android Emulator để trỏ đến localhost của máy chủ

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
      
      // Đảm bảo data có trường full_name nếu server trả về fullName
      if (data.fullName && !data.full_name) {
        data.full_name = data.fullName;
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
      
      // Tạo đối tượng JSON với các trường cần thiết
      const jsonData = {};
      if (userData.full_name) jsonData.full_name = userData.full_name;
      if (userData.phone) jsonData.phone = userData.phone;
      if (userData.address) jsonData.address = userData.address;
      
      console.log('Attempting to update profile with JSON data:', JSON.stringify(jsonData));
      
      // Gửi request JSON đơn giản (không có avatar)
      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData)
      });
      
      console.log('Profile update response status:', response.status);
      const data = await response.json();
      console.log('Profile update response data:', JSON.stringify(data));
      
      if (!response.ok) throw new Error(data.message || 'Failed to update profile');
      
      // Đảm bảo data có trường full_name để UI hiển thị đúng
      if (!data.full_name && data.fullName) {
        data.full_name = data.fullName;
      }
      
      return { success: true, message: 'Profile updated successfully', data: data };
    } catch (error) {
      console.error('Profile update error:', error);
      return handleError(error);
    }
  }
};

/**
 * Restaurant related API calls
 */
export const restaurantAPI = {
  /**
   * Get restaurant profile
   * @returns {Promise} - API response
   */
  getProfile: async () => {
    try {
      const token = await AsyncStorage.getItem('token') || '';
      console.log('Using token for restaurant profile request:', token);
      
      if (!token) {
        console.error('No token available for restaurant profile request');
        return { 
          success: false, 
          message: 'Bạn chưa đăng nhập!', 
          data: null 
        };
      }
      
      // Nếu không thể kết nối đến server thì sử dụng dữ liệu từ AsyncStorage
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 giây timeout
        
        const response = await fetch(`${BASE_URL}/restaurants/profile`, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log('Restaurant profile response status:', response.status);
        
        const data = await response.json();
        console.log('Restaurant profile response data:', data);
        
        if (!response.ok) {
          console.error('Restaurant profile request failed:', data);
          throw new Error(data.message || 'Failed to fetch restaurant profile');
        }
        
        // Lưu dữ liệu nhà hàng vào AsyncStorage để dùng offline
        await AsyncStorage.setItem('restaurantProfile', JSON.stringify(data));
        
        return { success: true, message: 'Restaurant profile fetched successfully', data: data };
      } catch (fetchError) {
        console.error('Restaurant profile fetch error, trying cached data:', fetchError);
        
        // Thử lấy dữ liệu từ AsyncStorage
        const cachedData = await AsyncStorage.getItem('restaurantProfile');
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          console.log('Using cached restaurant profile data');
          return { 
            success: true, 
            message: 'Using cached restaurant profile', 
            data: parsedData,
            isOffline: true 
          };
        }
        
        // Nếu không có dữ liệu trong cache, tạo dữ liệu giả để ứng dụng có thể chạy
        console.warn('No cached data found, using fallback data');
        const fallbackData = {
          id: 1,
          name: 'Nhà hàng của bạn',
          email: 'anhhuan@gmail.com',
          isOpen: true
        };
        
        return { 
          success: true, 
          message: 'Using fallback data', 
          data: fallbackData,
          isOffline: true 
        };
      }
    } catch (error) {
      console.error('Restaurant profile request error:', error);
      return handleError(error);
    }
  },
  
  /**
   * Get restaurant dishes
   * @param {number} page - Page number
   * @param {number} limit - Results per page
   * @returns {Promise} - API response
   */
  getDishes: async (page = 0, limit = 10) => {
    try {
      const token = await AsyncStorage.getItem('token') || '';
      
      if (!token) {
        return { 
          success: false, 
          message: 'Bạn chưa đăng nhập!', 
          data: null 
        };
      }
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 giây timeout
        
        // Lấy dishes từ endpoint profile vì theo controller profile sẽ trả về cả danh sách món ăn
        const profileResponse = await fetch(`${BASE_URL}/restaurants/profile`, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        const profileData = await profileResponse.json();
        if (!profileResponse.ok) throw new Error(profileData.message || 'Không thể lấy danh sách món ăn');
        
        // Lưu dishes vào AsyncStorage để dùng offline
        await AsyncStorage.setItem('restaurantDishes', JSON.stringify(profileData.dishes || []));
        
        // Trả về dishes từ response profile
        return { 
          success: true, 
          message: 'Lấy danh sách món ăn thành công', 
          data: profileData.dishes || [] 
        };
      } catch (fetchError) {
        console.error('Get dishes fetch error, trying cached data:', fetchError);
        
        // Thử lấy dữ liệu từ AsyncStorage
        const cachedData = await AsyncStorage.getItem('restaurantDishes');
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          console.log('Using cached dishes data');
          return { 
            success: true, 
            message: 'Using cached dishes', 
            data: parsedData,
            isOffline: true 
          };
        }
        
        // Nếu không có dữ liệu trong cache, tạo dữ liệu giả
        console.warn('No cached dishes found, using fallback data');
        const fallbackDishes = [
          {
            id: 1,
            name: 'Món ăn mẫu 1',
            price: 50000,
            description: 'Mô tả món ăn',
            category: 'Món chính',
            rating: 4.5,
            reviews: 10
          },
          {
            id: 2,
            name: 'Món ăn mẫu 2',
            price: 45000,
            description: 'Mô tả món ăn',
            category: 'Món phụ',
            rating: 4.2,
            reviews: 8
          }
        ];
        
        return { 
          success: true, 
          message: 'Using fallback dishes data', 
          data: fallbackDishes,
          isOffline: true 
        };
      }
    } catch (error) {
      return handleError(error);
    }
  },
  
  /**
   * Add new dish
   * @param {Object} dishData - Dish data including name, price, description, etc.
   * @returns {Promise} - API response
   */
  addDish: async (dishData) => {
    try {
      const token = await AsyncStorage.getItem('token') || '';
      
      if (!token) {
        return { 
          success: false, 
          message: 'Bạn chưa đăng nhập!', 
          data: null 
        };
      }
      
      // Use FormData for file upload
      const formData = new FormData();
      
      // Add text fields
      if (dishData.name) formData.append('name', dishData.name);
      if (dishData.price) formData.append('price', dishData.price.toString());
      if (dishData.description) formData.append('description', dishData.description);
      if (dishData.category) formData.append('category', dishData.category);
      
      // Add image if present
      if (dishData.image && dishData.image.uri) {
        const uriParts = dishData.image.uri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        
        formData.append('thumbnail', {
          uri: dishData.image.uri,
          name: `dish.${fileType}`,
          type: `image/${fileType}`,
        });
      }
      
      // Log formData for debugging
      console.log('Adding dish with data:', JSON.stringify(Object.fromEntries(formData._parts)));
      
      const response = await fetch(`${BASE_URL}/dishes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Content-Type is set automatically with FormData
        },
        body: formData
      });
      
      console.log('Add dish response status:', response.status);
      
      const data = await response.json();
      console.log('Add dish response data:', data);
      
      if (!response.ok) throw new Error(data.message || 'Không thể thêm món ăn');
      
      return { success: true, message: 'Thêm món ăn thành công', data: data };
    } catch (error) {
      console.error('Add dish error:', error);
      return handleError(error);
    }
  }
};

// Update the default export to include restaurant API
export default {
  auth: authAPI,
  user: userAPI,
  restaurant: restaurantAPI
}; 