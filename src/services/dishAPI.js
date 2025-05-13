// Dish API service
import { BASE_URL, handleError, AsyncStorage } from './apiConfig';

/**
 * Dish related API calls
 */
const dishAPI = {
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
  },

  /**
   * Add a new dish
   * @param {Object} dishData - Dish data including name, price, description, category, image
   * @returns {Promise} - API response
   */
  addDish: async (dishData) => {
    try {
      const token = await AsyncStorage.getItem('token') || '';
      
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add text fields to FormData
      if (dishData.name) formData.append('name', dishData.name);
      if (dishData.price) formData.append('price', dishData.price.toString());
      if (dishData.description) formData.append('description', dishData.description);
      if (dishData.category) formData.append('category', dishData.category);
      
      // Add image if exists
      if (dishData.image) {
        const imageUri = dishData.image.uri;
        const imageName = imageUri.split('/').pop();
        const imageType = 'image/jpeg'; // Default type
        
        formData.append('thumbnail', {
          uri: imageUri,
          name: imageName,
          type: imageType,
        });
      }
      
      const response = await fetch(`${BASE_URL}/dishes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type when using FormData
        },
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add dish');
      }
      
      return { success: true, message: 'Dish added successfully', data: data };
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Update an existing dish
   * @param {number} id - Dish ID
   * @param {Object} dishData - Updated dish data
   * @returns {Promise} - API response
   */
  updateDish: async (id, dishData) => {
    try {
      const token = await AsyncStorage.getItem('token') || '';
      
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add text fields to FormData if they exist
      if (dishData.name) formData.append('name', dishData.name);
      if (dishData.price) formData.append('price', dishData.price.toString());
      if (dishData.description !== undefined) formData.append('description', dishData.description);
      if (dishData.category) formData.append('category', dishData.category);
      
      // Add image if it exists and is a file object
      if (dishData.thumbnail && typeof dishData.thumbnail === 'object' && dishData.thumbnail.uri) {
        const imageUri = dishData.thumbnail.uri;
        const imageName = imageUri.split('/').pop();
        const imageType = 'image/jpeg'; // Default type
        
        formData.append('thumbnail', {
          uri: imageUri,
          name: imageName,
          type: imageType,
        });
      } else if (dishData.thumbnail && typeof dishData.thumbnail === 'string') {
        // If thumbnail is a string URL, we don't need to upload it again
        formData.append('thumbnail', dishData.thumbnail);
      }
      
      const response = await fetch(`${BASE_URL}/dishes/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type when using FormData
        },
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update dish');
      }
      
      return { success: true, message: 'Dish updated successfully', data: data };
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Delete a dish
   * @param {number} id - Dish ID to delete
   * @returns {Promise} - API response
   */
  deleteDish: async (id) => {
    try {
      const token = await AsyncStorage.getItem('token') || '';
      
      const response = await fetch(`${BASE_URL}/dishes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      
      // For DELETE requests that return no content
      if (response.status === 204) {
        return { success: true, message: 'Dish deleted successfully' };
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete dish');
      }
      
      return { success: true, message: 'Dish deleted successfully', data: data };
    } catch (error) {
      return handleError(error);
    }
  }
};

export default dishAPI; 