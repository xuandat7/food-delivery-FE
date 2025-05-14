import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { AsyncStorage } from './apiConfig';

// Cấu hình thông báo
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Đăng ký nhận thông báo đẩy
 * @returns {string} token - Expo push token
 */
export const registerForPushNotificationsAsync = async () => {
  let token;
  
  if (Device.isDevice) {
    // Kiểm tra quyền thông báo
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Không được cấp quyền thông báo!');
      return;
    }
    
    // Lấy token thiết bị
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo push token:', token);
    
    // Lưu token vào AsyncStorage
    await AsyncStorage.setItem('expoPushToken', token);
  } else {
    console.log('Thông báo đẩy chỉ hoạt động trên thiết bị thật');
  }

  // Cấu hình thông báo đặc biệt cho Android
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#3498db',
    });
  }

  return token;
};

/**
 * Hiển thị thông báo cục bộ
 * @param {string} title - Tiêu đề thông báo
 * @param {string} body - Nội dung thông báo
 * @param {object} data - Dữ liệu kèm theo thông báo
 */
export const scheduleLocalNotification = async (title, body, data = {}) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
      badge: 1,
    },
    trigger: { seconds: 1 },
  });
};

/**
 * Thiết lập các listener để xử lý khi nhận thông báo
 * @param {function} handleNotification - Hàm xử lý khi nhận thông báo
 * @param {function} handleNotificationResponse - Hàm xử lý khi người dùng tương tác với thông báo
 * @returns {object} - Các subscription đã đăng ký
 */
export const setupNotificationListeners = (handleNotification, handleNotificationResponse) => {
  // Khi nhận thông báo và ứng dụng đang chạy
  const notificationListener = Notifications.addNotificationReceivedListener(handleNotification);
  
  // Khi người dùng tương tác với thông báo (nhấn vào)
  const responseListener = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

  return {
    remove: () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    }
  };
};

/**
 * Thông báo có đơn hàng mới
 * @param {number} count - Số lượng đơn hàng mới
 */
export const notifyNewOrder = async (count = 1) => {
  try {
    const title = 'Đơn hàng mới!';
    const body = count === 1 
      ? 'Bạn có 1 đơn hàng mới đang chờ xác nhận' 
      : `Bạn có ${count} đơn hàng mới đang chờ xác nhận`;
    
    await scheduleLocalNotification(title, body, { type: 'new_order', count });
  } catch (error) {
    console.error('Lỗi hiển thị thông báo:', error);
  }
}; 