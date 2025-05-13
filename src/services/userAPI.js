// User API service
import { BASE_URL, handleError, AsyncStorage } from './apiConfig';

/**
 * User related API calls
 */
const userAPI = {
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

export default userAPI; 