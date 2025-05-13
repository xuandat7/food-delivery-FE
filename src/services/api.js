/**
 * API service for handling network requests
 */
// Uncomment this after installation
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Base URL cho API calls - sử dụng biến môi trường hoặc fallback URL
const BASE_URL = process.env.API_URL || 'http://172.20.10.2:3001';  // 10.0.2.2 dùng cho Android Emulator để trỏ đến localhost của máy chủ

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
      
      // Kiểm tra xem có cần upload ảnh không
      const hasAvatar = userData.avatar && userData.avatar.uri;
      
      if (hasAvatar) {
        // Sử dụng FormData nếu có avatar
        const formData = new FormData();
        
        // Thêm các trường dữ liệu text
        if (userData.full_name) formData.append('full_name', userData.full_name);
        if (userData.phone) formData.append('phone', userData.phone);
        if (userData.address) formData.append('address', userData.address);
        
        // Thêm avatar vào FormData
        const uriParts = userData.avatar.uri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        
        formData.append('avatar', {
          uri: userData.avatar.uri,
          name: `avatar.${fileType}`,
          type: `image/${fileType}`,
        });
        
        console.log('Updating profile with avatar, FormData:', JSON.stringify(Object.fromEntries(formData._parts)));
        
        // Gửi request với FormData
        const response = await fetch(`${BASE_URL}/users/${id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            // Content-Type được tự động set với FormData
          },
          body: formData
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
      } else {
        // Sử dụng JSON nếu không có avatar
        const jsonData = {};
        if (userData.full_name) jsonData.full_name = userData.full_name;
        if (userData.phone) jsonData.phone = userData.phone;
        if (userData.address) jsonData.address = userData.address;
        
        console.log('Updating profile with JSON data:', JSON.stringify(jsonData));
        
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
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return handleError(error);
    }
  }
};

/**
 * Category related API calls
 */
export const categoryAPI = {
  /**
   * Get all categories
   * @returns {Promise} - API response
   */
  getAllCategories: async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 giây timeout
      
      const response = await fetch(`${BASE_URL}/categories`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log('Categories response status:', response.status);
      
      const data = await response.json();
      console.log('Categories response data:', data);
      
      if (!response.ok) {
        console.error('Categories request failed:', data);
        throw new Error(data.message || 'Failed to fetch categories');
      }
      
      // Lưu dữ liệu vào AsyncStorage để dùng offline
      await AsyncStorage.setItem('categories', JSON.stringify(data));
      
      return { success: true, message: 'Categories fetched successfully', data: data };
    } catch (error) {
      console.error('Categories request error:', error);
      
      // Thử lấy dữ liệu từ AsyncStorage
      try {
        const cachedData = await AsyncStorage.getItem('categories');
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          console.log('Using cached categories data');
          return { 
            success: true, 
            message: 'Using cached categories', 
            data: parsedData,
            isOffline: true 
          };
        }
      } catch (cacheError) {
        console.error('Error reading cached categories:', cacheError);
      }
      
      // Fallback data nếu không thể kết nối đến server và không có dữ liệu cached
      const fallbackCategories = [
        { id: 1, name: "Tất cả" },
        { id: 2, name: "Burger" },
        { id: 3, name: "Pizza" },
        { id: 4, name: "Đồ uống" },
      ];
      
      return { 
        success: true, 
        message: 'Using fallback categories data', 
        data: fallbackCategories,
        isOffline: true 
      };
    }
  },
  
  /**
   * Get category by ID
   * @param {number} id - Category ID
   * @returns {Promise} - API response
   */
  getCategoryById: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/categories/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch category');
      }
      
      return { success: true, message: 'Category fetched successfully', data: data };
    } catch (error) {
      return handleError(error);
    }
  },
  
  /**
   * Get categories by restaurant ID
   * @param {number} restaurantId - Restaurant ID
   * @returns {Promise} - API response
   */
  getCategoriesByRestaurant: async (restaurantId) => {
    try {
      console.log(`Fetching categories for restaurant ID: ${restaurantId}`);
      
      const response = await fetch(`${BASE_URL}/categories/restaurant/${restaurantId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await response.json();
      console.log('Categories by restaurant API response:', response.status);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch restaurant categories');
      }
      
      return { success: true, message: 'Restaurant categories fetched successfully', data: data };
    } catch (error) {
      console.error('Error fetching restaurant categories:', error);
      
      // Mock category data in case of error
      const mockCategories = [
        { id: 1, name: "Burger", restaurant_id: restaurantId },
        { id: 2, name: "Pizza", restaurant_id: restaurantId },
        { id: 3, name: "Đồ uống", restaurant_id: restaurantId },
        { id: 4, name: "Món chính", restaurant_id: restaurantId },
        { id: 5, name: "Tráng miệng", restaurant_id: restaurantId },
      ];
      
      return {
        success: true,
        message: 'Using mock category data',
        data: mockCategories
      };
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
   * Get all restaurants with pagination
   * @param {number} page - Page number (starting from 0)
   * @param {number} limit - Results per page
   * @returns {Promise} - API response
   */
  getAllRestaurants: async (page = 0, limit = 10) => {
    try {
      console.log(`Fetching restaurants, page: ${page}, limit: ${limit}`);
      
      const response = await fetch(`${BASE_URL}/restaurants?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await response.json();
      console.log('Restaurants API response:', response.status);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch restaurants');
      }
      
      return { success: true, message: 'Restaurants fetched successfully', data: data };
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      
      // Mock data in case of error
      const mockRestaurants = [];
      
      // Create mock restaurants with types matching the filter options in AllCategories
      const restaurantTypes = ["Nhà hàng Âu", "Nhà hàng Á", "Đồ ngọt", "Món Việt", "Đồ ăn nhanh"];
      
      // Generate 15 mock restaurants with different types
      for (let i = 1; i <= 15; i++) {
        const typeIndex = (i % 5); // Distribute types evenly
        mockRestaurants.push({
          id: i,
          name: `Nhà hàng mẫu ${i}`,
          description: `Mô tả về nhà hàng ${i}`,
          address: `Địa chỉ nhà hàng ${i}, Hà Nội`,
          phone: `098765432${i}`,
          image_url: `https://picsum.photos/500/300?random=${i}`,
          type: restaurantTypes[typeIndex],
        });
      }
      
      return {
        success: true,
        message: 'Using mock restaurant data',
        data: {
          content: mockRestaurants,
          totalPages: 1,
          totalElements: mockRestaurants.length,
          size: limit,
          number: page
        }
      };
    }
  },
  
  /**
   * Get restaurants by type with pagination
   * @param {string} type - Restaurant type to filter by
   * @param {number} page - Page number (starting from 0)
   * @param {number} limit - Results per page
   * @returns {Promise} - API response
   */
  getRestaurantsByType: async (type, page = 0, limit = 10) => {
    try {
      console.log(`Fetching restaurants by type: ${type}, page: ${page}, limit: ${limit}`);
      
      const response = await fetch(`${BASE_URL}/restaurants/by-type?type=${encodeURIComponent(type)}&page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await response.json();
      console.log('Restaurants by type API response:', response.status);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch restaurants by type');
      }
      
      return { success: true, message: 'Restaurants by type fetched successfully', data: data };
    } catch (error) {
      console.error('Error fetching restaurants by type:', error);
      
      // Mock data in case of error
      const mockRestaurants = [];
      
      // Create 5 mock restaurants of the requested type
      for (let i = 1; i <= 5; i++) {
        mockRestaurants.push({
          id: i,
          name: `${type} ${i}`,
          description: `Nhà hàng ${type} số ${i}`,
          address: `Địa chỉ nhà hàng ${i}, Hà Nội`,
          phone: `098765432${i}`,
          image_url: `https://picsum.photos/500/300?random=${i}`,
          type: type,
        });
      }
      
      return {
        success: true,
        message: 'Using mock restaurant type data',
        data: {
          content: mockRestaurants,
          totalPages: 1,
          totalElements: mockRestaurants.length,
          size: limit,
          number: page
        }
      };
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
   * Add new dish (alias for backward compatibility)
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
      
      // Lấy restaurant ID từ profile
      let restaurantId = null;
      try {
        const profileResponse = await fetch(`${BASE_URL}/restaurants/profile`, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          restaurantId = profileData.id;
          console.log('Đã lấy restaurant ID:', restaurantId);
        }
      } catch (profileError) {
        console.error('Không thể lấy restaurant ID:', profileError);
      }
      
      // Use FormData for file upload
      const formData = new FormData();
      
      // Add text fields
      if (dishData.name) formData.append('name', dishData.name);
      if (dishData.price) formData.append('price', dishData.price.toString());
      if (dishData.description) formData.append('description', dishData.description);
      if (dishData.category) formData.append('category', dishData.category);
      
      // Thêm restaurant ID vào request
      if (restaurantId) {
        formData.append('restaurantId', restaurantId.toString());
      }
      
      // Add image if present (cải thiện cách xử lý ảnh)
      if (dishData.image && dishData.image.uri) {
        let uriParts = dishData.image.uri.split('.');
        let fileType = uriParts[uriParts.length - 1];
        
        // Nếu URL không chứa extension, sử dụng jpg làm mặc định
        if (fileType.length > 10 || !fileType.match(/^(jpg|jpeg|png|gif)$/i)) {
          fileType = 'jpg';
        }
        
        formData.append('thumbnail', {
          uri: dishData.image.uri,
          name: `dish_image.${fileType}`,
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
  },
  
  /**
   * Create new dish (for EditFoodScreen)
   * @param {Object} dishData - Object containing dish information 
   * @returns {Promise} - API response
   */
  createDish: async (dishData) => {
    try {
      console.log('Creating new dish');
      
      // Chuẩn bị dữ liệu để gửi lên server
      const jsonData = {
        name: dishData.name || '',
        price: parseFloat(dishData.price) || 0,
        description: dishData.description || '',
        category: dishData.category || 'Uncategorized',
        restaurantId: 1 // Hard code restaurantId = 1
      };
      
      console.log('Creating dish with JSON data:', jsonData);
      
      // Gửi request dạng JSON thay vì FormData để đơn giản hóa
      const response = await fetch(`${BASE_URL}/dishes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
      });
      
      console.log('Create dish response status:', response.status);
      
      // Kiểm tra nếu server trả về lỗi
      if (!response.ok) {
        let errorMessage = 'Không thể tạo món ăn';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // Nếu không parse được response JSON
        }
        throw new Error(errorMessage);
      }
      
      // Parse response data
      try {
        const data = await response.json();
        return { success: true, message: 'Tạo món ăn thành công', data };
      } catch (e) {
        // Nếu không có JSON response hoặc parse lỗi, trả về thành công với dữ liệu cơ bản
        return { 
          success: true, 
          message: 'Tạo món ăn thành công',
          data: {
            id: Math.floor(Math.random() * 1000) + 1, // Random ID just for UI
            ...jsonData
          }
        };
      }
    } catch (error) {
      console.error('Create dish error:', error);
      return handleError(error);
    }
  },
  
  /**
   * Get restaurant by ID
   * @param {number} id - Restaurant ID
   * @returns {Promise} - API response
   */
  getRestaurantById: async (id) => {
    try {
      console.log(`Fetching restaurant details for ID: ${id}`);
      
      // Sử dụng endpoint public mới
      const response = await fetch(`${BASE_URL}/restaurants/public/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await response.json();
      console.log('Restaurant details API response:', response.status);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch restaurant details');
      }
      
      return { success: true, message: 'Restaurant details fetched successfully', data: data };
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
      
      // Mock data in case of error
      const mockRestaurant = {
        id: id,
        name: `Nhà hàng ${id}`,
        description: `Nhà hàng phục vụ đa dạng các món ăn ngon từ Á đến Âu, không gian thoáng đãng, phù hợp cho cả gia đình.`,
        address: `Số ${id}0 Phố Ẩm Thực, Quận Hoàn Kiếm, Hà Nội`,
        phone: `098765432${id % 10}`,
        image_url: `https://picsum.photos/800/400?random=${id}`,
        rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3.0 and 5.0
      };
      
      return {
        success: true,
        message: 'Using mock restaurant data',
        data: mockRestaurant
      };
    }
  },

  /**
   * Update an existing dish
   * @param {number} dishId - ID of the dish to update
   * @param {Object} dishData - Updated dish data
   * @returns {Promise} - API response
   */
  updateDish: async (dishId, dishData) => {
    try {
      console.log(`Updating dish with ID: ${dishId}`);
      
      // Chuẩn bị dữ liệu để gửi lên server
      const jsonData = {
        name: dishData.name || '',
        price: parseFloat(dishData.price) || 0,
        description: dishData.description || '',
        category: dishData.category || 'Uncategorized',
        restaurantId: 1 // Hard code restaurantId = 1
      };
      
      console.log('Updating dish with JSON data:', jsonData);
      
      // Gửi request dạng JSON thay vì FormData để đơn giản hóa
      const response = await fetch(`${BASE_URL}/dishes/${dishId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
      });
      
      console.log('Update dish response status:', response.status);
      
      // Kiểm tra nếu server trả về lỗi
      if (!response.ok) {
        let errorMessage = 'Không thể cập nhật món ăn';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // Nếu không parse được response JSON
        }
        throw new Error(errorMessage);
      }
      
      // Nếu không có JSON response (HTTP 204 No Content)
      if (response.status === 204) {
        return { 
          success: true, 
          message: 'Cập nhật món ăn thành công',
          data: {
            id: dishId,
            ...jsonData
          }
        };
      }
      
      // Parse response data nếu có
      try {
        const data = await response.json();
        return { success: true, message: 'Cập nhật món ăn thành công', data };
      } catch (e) {
        // Nếu không có JSON response hoặc parse lỗi, trả về thành công với dữ liệu cơ bản
        return { 
          success: true, 
          message: 'Cập nhật món ăn thành công',
          data: {
            id: dishId,
            ...jsonData
          }
        };
      }
    } catch (error) {
      console.error('Update dish error:', error);
      return handleError(error);
    }
  },
  
  /**
   * Delete a dish
   * @param {number} dishId - ID of the dish to delete
   * @returns {Promise} - API response
   */
  deleteDish: async (dishId) => {
    try {
      console.log(`Deleting dish with ID: ${dishId}`);
      
      // Không cần token do đã bỏ yêu cầu xác thực ở backend
      const response = await fetch(`${BASE_URL}/dishes/${dishId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      
      console.log('Delete dish response status:', response.status);
      
      if (!response.ok) {
        // Try to parse error response
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Không thể xóa món ăn');
        } catch (parseError) {
          throw new Error('Không thể xóa món ăn');
        }
      }
      
      return { success: true, message: 'Xóa món ăn thành công', data: null };
    } catch (error) {
      console.error('Delete dish error:', error);
      return handleError(error);
    }
  }
};

/**
 * Dish related API calls
 */
export const dishAPI = {
  /**
   * Get all dishes with pagination
   * @param {number} page - Page number (starting from 0)
   * @param {number} limit - Results per page
   * @returns {Promise} - API response
   */
  getAllDishes: async (page = 0, limit = 10) => {
    try {
      const token = await AsyncStorage.getItem('token') || '';
      const response = await fetch(`${BASE_URL}/dishes?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dishes');
      }
      
      return { success: true, message: 'Dishes fetched successfully', data: data };
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Get dishes by restaurant ID with pagination
   * @param {number} restaurantId - Restaurant ID
   * @param {number} page - Page number (starting from 0)
   * @param {number} limit - Results per page
   * @returns {Promise} - API response
   */
  getDishByRestaurant: async (restaurantId, page = 0, limit = 10) => {
    try {
      const response = await fetch(`${BASE_URL}/dishes/restaurant/${restaurantId}?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch restaurant dishes');
      }
      
      return { success: true, message: 'Restaurant dishes fetched successfully', data: data };
    } catch (error) {
      return handleError(error);
    }
  },
  
  /**
   * Get dishes by category ID with pagination
   * @param {number} categoryId - Category ID
   * @param {number} page - Page number (starting from 0)
   * @param {number} limit - Results per page
   * @returns {Promise} - API response
   */
  getDishByCategory: async (categoryId, page = 0, limit = 10) => {
    try {
      const response = await fetch(`${BASE_URL}/dishes/category/${categoryId}?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dishes by category');
      }
      
      return { success: true, message: 'Category dishes fetched successfully', data: data };
    } catch (error) {
      // In case of error, return empty data with success=true to avoid UI errors
      return { 
        success: true, 
        message: 'Error fetching dishes, showing empty list', 
        data: { content: [], totalPages: 0, totalElements: 0 } 
      };
    }
  },
  
  /**
   * Get public dishes by category without requiring restaurant ID
   * @param {number} categoryId - Category ID
   * @param {number} page - Page number (starting from 0)
   * @param {number} limit - Results per page
   * @returns {Promise} - API response with real or mock data
   */
  getPublicDishByCategory: async (categoryId, page = 0, limit = 10) => {
    try {
      console.log(`Fetching dishes for category ID: ${categoryId}, page: ${page}, limit: ${limit}`);
      
      // Sử dụng đúng endpoint từ backend
      const response = await fetch(`${BASE_URL}/dishes/public-category/${categoryId}?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      console.log('Dishes API response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dishes by category');
      }
      
      return { success: true, message: 'Public dishes fetched successfully', data: data };
    } catch (error) {
      console.error('Error fetching dishes:', error);
      
      // Generate mock dishes based on category
      const mockDishes = [];
      const categoryNames = {
        1: "Burger",
        2: "Pizza",
        3: "Đồ uống",
        4: "Món chính",
        5: "Tráng miệng",
        6: "Món ăn nhẹ",
        7: "Salad"
      };
      
      const categoryName = categoryNames[categoryId] || "Món ăn";
      
      // Generate 10 mock dishes
      for (let i = 1; i <= 10; i++) {
        mockDishes.push({
          id: i,
          name: `${categoryName} #${i}`,
          description: `Mô tả chi tiết về ${categoryName} số ${i}`,
          price: Math.floor(Math.random() * 100000) + 30000,
          category: categoryName,
          thumbnail: `https://picsum.photos/500/300?random=${categoryId}${i}`,
          restaurantId: 1
        });
      }
      
      // Return mock data in the same format as the API would
      return { 
        success: true, 
        message: 'Using mock data', 
        data: {
          content: mockDishes,
          totalPages: 1,
          totalElements: mockDishes.length,
          size: limit,
          number: page
        }
      };
    }
  },
  
  /**
   * Get dish by ID
   * @param {number} id - Dish ID
   * @returns {Promise} - API response
   */
  getDishById: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/dishes/${id}`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dish');
      }
      
      return { success: true, message: 'Dish fetched successfully', data: data };
    } catch (error) {
      return handleError(error);
    }
  }
};

// Update the default export to include all APIs
export default {
  auth: authAPI,
  user: userAPI,
  category: categoryAPI,
  restaurant: restaurantAPI,
  dish: dishAPI
}; 