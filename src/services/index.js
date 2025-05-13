/**
 * API services entry point
 */
import authAPI from './authAPI';
import userAPI from './userAPI';
import categoryAPI from './categoryAPI';
import restaurantAPI from './restaurantAPI';
import dishAPI from './dishAPI';
import cartAPI from './cartAPI';
import { BASE_URL, AsyncStorage } from './apiConfig';

// Export for use in components
export {
  authAPI,
  userAPI,
  categoryAPI,
  restaurantAPI,
  dishAPI,
  cartAPI,
  BASE_URL,
  AsyncStorage
};

// Default export for backward compatibility
export default {
  auth: authAPI,
  user: userAPI,
  category: categoryAPI,
  restaurant: restaurantAPI,
  dish: dishAPI,
  ...cartAPI
}; 