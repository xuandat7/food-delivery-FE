// Cart API service
import { BASE_URL, handleError, AsyncStorage } from './apiConfig';

/**
 * Cart related API calls
 */
const cartAPI = {
  /**
   * Get cart
   * @returns {Promise} - API response
   */
  getCart: async () => {
    try {
      const token = await AsyncStorage.getItem('token') || '';
      const response = await fetch(`${BASE_URL}/cart`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch cart');
      }
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Add dish to cart
   * @param {number} dishId - Dish ID
   * @param {number} quantity - Quantity to add
   * @returns {Promise} - API response
   */
  addToCart: async (dishId, quantity = 1) => {
    try {
      const token = await AsyncStorage.getItem('token') || '';
      const response = await fetch(`${BASE_URL}/cart/${dishId}?quantity=${quantity}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Add to cart failed');
      return { success: true, data };
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Remove item from cart
   * @param {number} dishId - Dish ID
   * @returns {Promise} - API response
   */
  removeCartItem: async (dishId) => {
    try {
      const token = await AsyncStorage.getItem('token') || '';
      const response = await fetch(`${BASE_URL}/cart/${dishId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Remove from cart failed');
      return { success: true, data };
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Update quantity of item in cart
   * @param {number} dishId - Dish ID
   * @param {number} quantity - New quantity
   * @returns {Promise} - API response
   */
  updateCartItemQuantity: async (dishId, quantity) => {
    try {
      const token = await AsyncStorage.getItem('token') || '';
      const response = await fetch(`${BASE_URL}/cart/item/${dishId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Update cart quantity failed');
      return { success: true, data };
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Clear all items from cart
   * @returns {Promise} - API response
   */
  clearCart: async () => {
    try {
      const token = await AsyncStorage.getItem('token') || '';
      const response = await fetch(`${BASE_URL}/cart`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || 'Failed to clear cart' };
      return { success: true, data };
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Create a new order
   * @returns {Promise} - API response
   */
  createOrder: async () => {
    try {
      const token = await AsyncStorage.getItem('token') || '';
      const response = await fetch(`${BASE_URL}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || 'Failed to create order' };
      return { success: true, data };
    } catch (error) {
      return handleError(error);
    }
  }
};

export default cartAPI; 