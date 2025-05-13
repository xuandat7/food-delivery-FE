// Category API service
import { BASE_URL, handleError, AsyncStorage } from './apiConfig';

/**
 * Category related API calls
 */
const categoryAPI = {
  /**
   * Get all categories
   * @returns {Promise} - API response
   */
  getAllCategories: async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 giây timeout
      
      const response = await fetch(`${BASE_URL}/categories/all`, {
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

export default categoryAPI; 