import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  StatusBar,
  Alert,
  AppState,
} from 'react-native';
import { useNavigation, useIsFocused, CommonActions } from '@react-navigation/native';
import { styles } from './SellerDashboardStyle';
import COLORS from '../../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import RunningOrdersScreen from './RunningOrdersScreen';
import { AsyncStorage, restaurantAPI } from '../../services';
import { 
  registerForPushNotificationsAsync, 
  setupNotificationListeners,
  notifyNewOrder
} from '../../services/notifications';

// Custom Chart Component (simplified for this implementation)
const RevenueChart = () => {
  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartPlaceholder}>
        {/* This would be replaced with an actual chart library component */}
        <View style={styles.tooltipBox}>
          <Text style={styles.tooltipText}>$500</Text>
        </View>

        {/* Simplified chart visual elements */}
        <View style={{
          position: 'absolute',
          left: '30%',
          top: '40%',
          width: 13,
          height: 13,
          borderRadius: 6.5,
          backgroundColor: 'white',
          borderWidth: 2.5,
          borderColor: '#FB6D3A'
        }} />
      </View>
      
      <View style={styles.timeLabels}>
        <Text style={styles.timeLabel}>10AM</Text>
        <Text style={styles.timeLabel}>11AM</Text>
        <Text style={styles.timeLabel}>12PM</Text>
        <Text style={styles.timeLabel}>01PM</Text>
        <Text style={styles.timeLabel}>02PM</Text>
        <Text style={styles.timeLabel}>03PM</Text>
        <Text style={styles.timeLabel}>04PM</Text>
      </View>
    </View>
  );
};

const SellerDashboard = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [showRunningOrders, setShowRunningOrders] = useState(false);
  const [showOrderRequests, setShowOrderRequests] = useState(false);
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [runningOrders, setRunningOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [lastOrderCount, setLastOrderCount] = useState(0);
  const [isFirstCheck, setIsFirstCheck] = useState(true);
  
  const appState = useRef(AppState.currentState);
  const notificationListenerRef = useRef(null);
  
  // Đăng ký push notifications khi component mount
  useEffect(() => {
    registerForPushNotificationsAsync();
    
    // Thiết lập listeners để xử lý thông báo
    notificationListenerRef.current = setupNotificationListeners(
      // Khi nhận được thông báo
      notification => {
        console.log('Thông báo nhận được:', notification);
      },
      // Khi người dùng tương tác với thông báo
      response => {
        console.log('Người dùng tương tác với thông báo:', response);
        const data = response.notification.request.content.data;
        
        // Nếu là thông báo đơn hàng mới, mở tab Đơn hàng
        if (data.type === 'new_order') {
          navigation.navigate('Đơn hàng');
        }
      }
    );
    
    // Theo dõi trạng thái của ứng dụng (foreground/background)
    const appStateSubscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // Ứng dụng quay lại foreground, cập nhật dữ liệu
        fetchRestaurantInfo();
      }
      
      appState.current = nextAppState;
    });
    
    return () => {
      // Dọn dẹp listeners khi unmount
      if (notificationListenerRef.current) {
        notificationListenerRef.current.remove();
      }
      appStateSubscription.remove();
    };
  }, []);

  // Fetch restaurant info
  const fetchRestaurantInfo = async () => {
    try {
      setIsLoading(true);
      // Check if token exists
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token found, redirecting to login');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Auth' }],
        });
        return;
      }
      
      // Lấy thông tin từ server
      const response = await restaurantAPI.getProfile();
      
      if (response.success) {
        setRestaurantInfo(response.data);
        console.log('Restaurant info loaded:', response.data.name || response.data.restaurant_name);
        // Hiển thị thông báo nếu đang dùng dữ liệu offline
        if (response.isOffline) {
          Alert.alert(
            'Chế độ Offline', 
            'Không thể kết nối tới máy chủ. Ứng dụng đang hiển thị dữ liệu đã lưu trước đó hoặc dữ liệu mẫu.',
            [{ text: 'Đã hiểu', style: 'default' }]
          );
        }
        // Lấy số lượng đơn hàng running và pending từ API
        try {
          const ordersRes = await restaurantAPI.getRestaurantOrders(0, 50);
          if (ordersRes.success && Array.isArray(ordersRes.data.content)) {
            const running = ordersRes.data.content.filter(o => o.status === 'processing' || o.status === 'confirmed').length;
            const pending = ordersRes.data.content.filter(o => o.status === 'pending').length;
            setRunningOrders(running);
            setPendingOrders(pending);
          } else {
            setRunningOrders(0);
            setPendingOrders(0);
          }
        } catch (err) {
          setRunningOrders(0);
          setPendingOrders(0);
        }
      } else {
        // Nếu API không thành công, thử lấy từ AsyncStorage
        const userString = await AsyncStorage.getItem('user');
        if (userString) {
          const user = JSON.parse(userString);
          setRestaurantInfo(user);
          console.log('Restaurant info loaded from storage:', user);
        } else {
          throw new Error('Không thể tải thông tin nhà hàng');
        }
      }
      
    } catch (error) {
      console.error('Error fetching restaurant info:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin nhà hàng. Vui lòng kiểm tra kết nối mạng và thử lại.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (isFocused) {
      fetchRestaurantInfo();
    }
  }, [isFocused]);

  // Kiểm tra đơn hàng mới mỗi 2 giây
  useEffect(() => {
    let intervalId;
    
    const checkForNewOrders = async () => {
      try {
        console.log('Kiểm tra đơn hàng mới...');
        const ordersRes = await restaurantAPI.getRestaurantOrders(0, 50);
        if (ordersRes.success && Array.isArray(ordersRes.data.content)) {
          const pendingOrdersCount = ordersRes.data.content.filter(o => o.status === 'pending').length;
          console.log(`Đơn hàng đang chờ: ${pendingOrdersCount}, Lần trước: ${lastOrderCount}`);
          
          // Nếu không phải lần kiểm tra đầu tiên và số đơn hàng đã tăng
          if (!isFirstCheck && pendingOrdersCount > lastOrderCount) {
            const newOrdersCount = pendingOrdersCount - lastOrderCount;
            
            // Hiển thị thông báo trong ứng dụng
            Alert.alert(
              'Đơn hàng mới!',
              `Bạn có ${newOrdersCount} đơn hàng mới đang chờ xác nhận`,
              [
                {
                  text: 'Xem ngay',
                  onPress: () => navigation.navigate('Đơn hàng')
                },
                {
                  text: 'Để sau',
                  style: 'cancel'
                }
              ],
              { cancelable: true }
            );
            
            // Hiển thị thông báo trên thiết bị
            notifyNewOrder(newOrdersCount);
          }
          
          // Cập nhật trạng thái
          setPendingOrders(pendingOrdersCount);
          setLastOrderCount(pendingOrdersCount);
          setIsFirstCheck(false);
        }
      } catch (err) {
        console.error('Lỗi kiểm tra đơn hàng mới:', err);
      }
    };
    
    // Nếu đang ở màn hình dashboard, bắt đầu kiểm tra định kỳ
    if (isFocused) {
      // Kiểm tra ngay lập tức
      checkForNewOrders();
      
      // Thiết lập kiểm tra định kỳ
      intervalId = setInterval(checkForNewOrders, 2000); // 2 giây
    }
    
    return () => {
      // Dọn dẹp interval khi unmount hoặc mất focus
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isFocused, lastOrderCount, isFirstCheck, navigation]);
  
  const handleToggleRunningOrders = () => {
    setShowRunningOrders(!showRunningOrders);
  };
  
  const handleToggleOrderRequests = () => {
    // Chuyển đến tab Đơn hàng trong Bottom Tab Navigator
    navigation.navigate('Đơn hàng');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F7F8" />
      
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuButton}>
          <Feather name="menu" size={18} color="#000" />
        </TouchableOpacity>
        
        <View style={styles.locationContainer}>
          <Text style={styles.locationLabel}>NHÀ HÀNG</Text>
          <View style={styles.locationWrapper}>
            <Text style={styles.locationText}>
              {restaurantInfo ? restaurantInfo.restaurant_name || restaurantInfo.name : 'Đang tải...'}
            </Text>
            <Ionicons name="chevron-down-sharp" size={8} color="#676767" style={{marginLeft: 8, marginTop: 5}} />
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.profileImage}
          onPress={() => navigation.navigate('ProfileScreen')}
        />
      </View>
      
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Đang tải thông tin...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Restaurant Status Summary */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>
              Xin chào, {restaurantInfo?.restaurant_name || restaurantInfo?.name || 'Nhà hàng'}!
            </Text>
            <Text style={styles.statusText}>
              Trạng thái: <Text style={{color: '#4CAF50', fontWeight: 'bold'}}>Đang mở cửa</Text>
            </Text>
          </View>

          {/* Running Orders and Order Requests */}
          <View style={styles.statsContainer}>
            <TouchableOpacity 
              style={styles.statsCard}
              onPress={handleToggleRunningOrders}
            >
              <Text style={styles.statsNumber}>{runningOrders}</Text>
              <Text style={styles.statsLabel}>ĐƠN HÀNG</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.statsCard}
              onPress={handleToggleOrderRequests}
            >
              <Text style={styles.statsNumber}>{pendingOrders}</Text>
              <Text style={styles.statsLabel}>CHỜ XÁC NHẬN</Text>
            </TouchableOpacity>
          </View>
          
          {/* Revenue Card */}
          <View style={styles.revenueCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>Total Revenue</Text>
                <Text style={styles.revenueAmount}>$2,241</Text>
              </View>
              
              <View style={styles.headerRight}>
                <TouchableOpacity style={styles.periodSelector}>
                  <Text style={styles.periodText}>Daily</Text>
                  <Ionicons name="chevron-down" size={14} color="#9B9BA5" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.seeDetails}>See Details</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <RevenueChart />
          </View>
          
          {/* Reviews Card */}
          <View style={styles.reviewsCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Reviews</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>See All Reviews</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.reviewStats}>
              <View style={styles.ratingContainer}>
                <View style={{
                  width: 26,
                  height: 26,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <FontAwesome name="star" size={18} color="#FB6D3A" />
                </View>
                <Text style={styles.ratingText}>4.9</Text>
              </View>
              <Text style={styles.totalReviews}>Total 20 Reviews</Text>
            </View>
          </View>
          
          {/* Popular Items Card */}
          <View style={styles.popularItemsCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Populer Items This Weeks</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.itemsContainer}>
              <View style={styles.itemImage} />
              <View style={styles.itemImage} />
            </View>
          </View>
        </ScrollView>
      )}
      
      {/* Display running orders modal if needed */}
      {showRunningOrders && (
        <RunningOrdersScreen onClose={handleToggleRunningOrders} />
      )}
    </SafeAreaView>
  );
};

export default SellerDashboard;