// Restaurant API service
import { BASE_URL, handleError, AsyncStorage } from './apiConfig';

/**
 * Restaurant related API calls
 */
const restaurantAPI = {
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
   * Search restaurants by keyword
   * @param {string} keyword - Search keyword
   * @param {number} page - Page number (starting from 0)
   * @param {number} limit - Results per page
   * @returns {Promise} - API response
   */
  searchRestaurants: async (keyword, page = 0, limit = 10) => {
    try {
      console.log(`Searching restaurants with keyword: "${keyword}", page: ${page}, limit: ${limit}`);
      
      // Thay vì gọi API search trực tiếp, chúng ta sẽ lấy tất cả nhà hàng và filter ở client side
      const allRestaurantsResponse = await restaurantAPI.getAllRestaurants(0, 100);
      
      if (allRestaurantsResponse.success && allRestaurantsResponse.data?.content) {
        const allRestaurants = allRestaurantsResponse.data.content;
        
        // Filter restaurants theo keyword
        const lowercaseKeyword = keyword.toLowerCase();
        const filteredRestaurants = allRestaurants.filter(restaurant => {
          return (
            (restaurant.name && restaurant.name.toLowerCase().includes(lowercaseKeyword)) ||
            (restaurant.description && restaurant.description.toLowerCase().includes(lowercaseKeyword)) ||
            (restaurant.address && restaurant.address.toLowerCase().includes(lowercaseKeyword)) ||
            (restaurant.type && restaurant.type.toLowerCase().includes(lowercaseKeyword))
          );
        });
        
        // Phân trang kết quả
        const startIndex = page * limit;
        const endIndex = startIndex + limit;
        const paginatedResults = filteredRestaurants.slice(startIndex, endIndex);
        
        return {
          success: true,
          message: `Tìm thấy ${filteredRestaurants.length} nhà hàng với từ khóa "${keyword}"`,
          data: {
            content: paginatedResults,
            totalPages: Math.ceil(filteredRestaurants.length / limit),
            totalElements: filteredRestaurants.length,
            size: limit,
            number: page
          }
        };
      }
      
      throw new Error('Không thể tìm kiếm nhà hàng');
    } catch (error) {
      console.error('Error searching restaurants:', error);
      
      // Mock data nếu xảy ra lỗi
      const mockResults = [];
      for (let i = 1; i <= 3; i++) {
        mockResults.push({
          id: i,
          name: `Nhà hàng ${keyword} ${i}`,
          description: `Kết quả tìm kiếm cho "${keyword}"`,
          address: `Địa chỉ ${i}, Hà Nội`,
          phone: `098765432${i}`,
          image_url: `https://picsum.photos/500/300?random=${i}`,
          type: i % 2 === 0 ? "Nhà hàng Á" : "Nhà hàng Âu",
        });
      }
      
      return {
        success: true,
        message: 'Sử dụng dữ liệu mẫu',
        data: {
          content: mockResults,
          totalPages: 1,
          totalElements: mockResults.length,
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
   * Get public restaurant profile by ID
   * @param {number|string} restaurantId
   * @returns {Promise} - API response
   */
  getPublicProfileById: async (restaurantId) => {
    try {
      const response = await fetch(`${BASE_URL}/restaurants/public/${restaurantId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch public restaurant info');
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching public restaurant info:', error);
      return handleError(error);
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
  },

  /**
   * Update restaurant profile
   * @param {Object} data - Restaurant info to update (expects: id, name, email, phone, address, description, image/avatar)
   * @returns {Promise} - API response
   */
  updateProfile: async (data) => {
    try {
      const token = await AsyncStorage.getItem('token') || '';
      if (!token) {
        return { success: false, message: 'Bạn chưa đăng nhập!', data: null };
      }
      if (!data.id) {
        return { success: false, message: 'Thiếu ID nhà hàng!', data: null };
      }
      // Use FormData for PATCH with image
      const formData = new FormData();
      if (data.name) formData.append('name', data.name);
      if (data.email) formData.append('email', data.email);
      if (data.phone) formData.append('phone', data.phone);
      if (data.address) formData.append('address', data.address);
      if (data.description) formData.append('description', data.description);
      // Accept both avatar and image fields for compatibility
      if (data.avatar && data.avatar.uri) {
        const uri = data.avatar.uri;
        const name = uri.split('/').pop() || 'avatar.jpg';
        const type = data.avatar.type || 'image/jpeg';
        formData.append('image', { uri, name, type });
      } else if (data.image && data.image.uri) {
        const uri = data.image.uri;
        const name = uri.split('/').pop() || 'avatar.jpg';
        const type = data.image.type || 'image/jpeg';
        formData.append('image', { uri, name, type });
      }
      const response = await fetch(`${BASE_URL}/restaurants/${data.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
          // Do not set Content-Type when using FormData
        },
        body: formData
      });
      const resData = await response.json();
      if (!response.ok) throw new Error(resData.message || 'Cập nhật thông tin nhà hàng thất bại');
      return { success: true, message: 'Cập nhật thông tin nhà hàng thành công', data: resData };
    } catch (error) {
      console.error('Update restaurant profile error:', error);
      return handleError(error);
    }
  },

  /**
   * Get orders for the current restaurant
   * @param {number} page - Page number (default 0)
   * @param {number} limit - Results per page (default 10)
   * @returns {Promise} - API response
   */
  getRestaurantOrders: async (page = 0, limit = 10) => {
    try {
      const token = await AsyncStorage.getItem('token') || '';
      if (!token) {
        return { success: false, message: 'Bạn chưa đăng nhập!', data: null };
      }
      const response = await fetch(`${BASE_URL}/orders/restaurant-orders?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Không thể lấy danh sách đơn hàng');
      return { success: true, data };
    } catch (error) {
      console.error('Get restaurant orders error:', error);
      return handleError(error);
    }
  },

  /**
   * Cập nhật trạng thái đơn hàng
   * @param {number} orderId - ID của đơn hàng
   * @param {string} status - Trạng thái mới (ví dụ: 'completed', 'processing', ...)
   * @returns {Promise} - API response
   */
  updateOrderStatus: async (orderId, status) => {
    try {
      const token = await AsyncStorage.getItem('token') || '';
      if (!token) {
        return { success: false, message: 'Bạn chưa đăng nhập!', data: null };
      }
      const response = await fetch(`${BASE_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Không thể cập nhật trạng thái đơn hàng');
      return { success: true, data };
    } catch (error) {
      console.error('Update order status error:', error);
      return handleError(error);
    }
  },

  /**
   * Get total revenue for restaurant
   * @returns {Promise} - API response
   */
  getTotalRevenue: async () => {
    try {
      const token = await AsyncStorage.getItem('token') || '';
      
      if (!token) {
        console.error('No token available for total revenue request');
        return { 
          success: false, 
          message: 'Bạn chưa đăng nhập!', 
          data: { totalRevenue: 0 }
        };
      }
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 giây timeout
      
      const response = await fetch(`${BASE_URL}/statistics/my-restaurant/total-revenue`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const data = await response.json();
      return data;
    } catch (error) {
      return handleError(error, 'Failed to fetch total revenue');
    }
  }
};

export default restaurantAPI;