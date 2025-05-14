import { BASE_URL, handleError, AsyncStorage } from './apiConfig';

const statisticsAPI = {
  /**
   * Get restaurant dashboard statistics
   * @param {string} timeFilter - Time filter (daily, monthly, yearly)
   * @returns {Promise} - API response
   */
  getDashboard: async (timeFilter = 'daily') => {
    try {
      const token = await AsyncStorage.getItem('token') || '';
      if (!token) {
        return { success: false, message: 'Bạn chưa đăng nhập!', data: null };
      }
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        const response = await fetch(`${BASE_URL}/statistics/dashboard?timeFilter=${timeFilter}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch dashboard statistics');
        await AsyncStorage.setItem('dashboardStats', JSON.stringify(data));
        console.log('Dashboard statistics fetched successfully', data);
        return { success: true, message: 'Dashboard statistics fetched successfully', data };
      } catch (fetchError) {
        const cachedData = await AsyncStorage.getItem('dashboardStats');
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          return { success: true, message: 'Using cached dashboard statistics', data: parsedData, isOffline: true };
        }
        // Mock data nếu không có cache
        const mockData = {
          runningOrders: 3,
          orderRequests: 1,
          todayRevenue: 0,
          revenueData: [],
          timeFilterType: timeFilter,
          averageRating: 4.9,
          totalRatings: 20
        };
        return { success: true, message: 'Using mock dashboard data', data: mockData, isOffline: true };
      }
    } catch (error) {
      return handleError(error);
    }
  }
};

export default statisticsAPI;
