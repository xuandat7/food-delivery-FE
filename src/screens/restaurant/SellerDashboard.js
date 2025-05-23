import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  LogBox
} from 'react-native';
import { useNavigation, useIsFocused, CommonActions } from '@react-navigation/native';
import { styles } from './SellerDashboardStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import RunningOrdersScreen from './RunningOrdersScreen';
import { AsyncStorage, restaurantAPI } from '../../services';
import statisticsAPI from '../../services/statisticsAPI';
import { notifyNewOrder } from '../../services/notifications';

// Bỏ qua các cảnh báo không cần thiết
LogBox.ignoreLogs([
  'Warning: Failed prop type', 
  'VirtualizedLists should never be nested',
  'Warning: Each child in a list',
  'Non-serializable values were found in the navigation state',
  'Component Exception: ngày' // Bỏ qua cảnh báo liên quan đến "ngày"
]);

// Biểu đồ doanh thu
const RevenueChart = ({ data }) => {
  const maxRevenue = Math.max(...(data?.map(i => i.revenue) || [1]), 1);
  return (
    <View style={[styles.chartContainer, { backgroundColor: '#fff', borderRadius: 12, padding: 12 }]}>
      {/* Biểu đồ cột */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 90, marginBottom: 8 }}>
        {data && data.length > 0 && data.map((item, idx) => (
          <View key={item.date} style={{ alignItems: 'center', flex: 1.3, minWidth: 22 }}>
            {/* Giá trị doanh thu trên đầu cột */}
            <Text style={{
              fontSize: 9,
              color: item.revenue > 0 ? '#181c2e' : '#bbb',
              fontWeight: item.revenue > 0 ? 'bold' : 'normal',
              marginBottom: 2
            }}>{item.revenue.toLocaleString('vi-VN')}</Text>
            <View style={{
              width: 10,
              height: Math.max(8, 60 * (item.revenue / maxRevenue)),
              backgroundColor: item.revenue > 0 ? '#FB6D3A' : '#eee',
              borderRadius: 4,
              marginBottom: 2,
              opacity: item.revenue > 0 ? 1 : 0.5
            }} />
            <Text style={{ fontSize: 8, color: '#888', marginTop: 2 }}>
              {(typeof item.date === 'string' && item.date.length >= 5) ? item.date.slice(5) : ''}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const SellerDashboard = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [showRunningOrders, setShowRunningOrders] = useState(false);
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [timeFilter, setTimeFilter] = useState('daily');
  const [pendingOrders, setPendingOrders] = useState([]);
  const [previousPendingCount, setPreviousPendingCount] = useState(0);

  // Fetch restaurant info & dashboard
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Lấy dashboard
        const dashboardRes = await statisticsAPI.getDashboard(timeFilter);
        if (dashboardRes.success) {
          setDashboard(dashboardRes.data);
        }
        // Lấy info nhà hàng (nếu cần)
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await restaurantAPI.getProfile();
          if (response.success) setRestaurantInfo(response.data);
        }
      } catch (e) {
        Alert.alert('Lỗi', 'Không thể tải dữ liệu dashboard.');
      } finally {
        setIsLoading(false);
      }
    };
    if (isFocused) fetchData();
  }, [isFocused, timeFilter]);

  // Kiểm tra đơn hàng mới mỗi 2 giây
  useEffect(() => {
    let intervalId;
    
    const checkForNewOrders = async () => {
      try {
        const res = await restaurantAPI.getRestaurantOrders(0, 30);
        if (res.success && Array.isArray(res.data?.content)) {
          // Lọc đơn hàng đang chờ
          const pendingList = res.data.content.filter(o => o.status === 'pending');
          setPendingOrders(pendingList);
          
          // Kiểm tra nếu có đơn hàng mới
          if (pendingList.length > previousPendingCount && previousPendingCount > 0) {
            const newOrdersCount = pendingList.length - previousPendingCount;
            
            // Hiển thị thông báo có đơn hàng mới
            try {
              await notifyNewOrder(newOrdersCount);
              console.log(`Thông báo đã được gửi cho ${newOrdersCount} đơn hàng mới`);
            } catch (notificationError) {
              console.error('Lỗi khi hiển thị thông báo:', notificationError);
            }
            
            // Hiển thị cảnh báo trong ứng dụng
            Alert.alert(
              'Đơn hàng mới!', 
              `Bạn có ${newOrdersCount} đơn hàng mới đang chờ xác nhận`,
              [
                { 
                  text: 'Xem ngay', 
                  onPress: () => {
                    console.log('Chuyển đến tab Đơn hàng');
                    // Sử dụng CommonActions để chuyển đến tab 'Đơn hàng' trong tab navigator
                    navigation.dispatch(
                      CommonActions.navigate({
                        name: 'Đơn hàng'
                      })
                    );
                  } 
                },
                { text: 'Để sau' }
              ]
            );
          }
          
          // Cập nhật số lượng đơn hàng trước đó
          setPreviousPendingCount(pendingList.length);
        }
      } catch (error) {
        console.error('Lỗi khi kiểm tra đơn hàng mới:', error);
      }
    };
    
    // Chỉ chạy kiểm tra khi màn hình đang hiển thị
    if (isFocused) {
      // Thiết lập interval kiểm tra mỗi 2 giây
      intervalId = setInterval(checkForNewOrders, 2000);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isFocused, previousPendingCount, navigation]);

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
            <Ionicons name="chevron-down-sharp" size={8} color="#676767" style={{ marginLeft: 8, marginTop: 5 }} />
          </View>
        </View>
      </View>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Đang tải thông tin...</Text>
        </View>
      ) : dashboard ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Restaurant Status Summary */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>
              Xin chào, {restaurantInfo?.restaurant_name || restaurantInfo?.name || 'Nhà hàng'}!
            </Text>
            <Text style={styles.statusText}>
              Trạng thái: <Text style={{ color: '#4CAF50', fontWeight: 'bold' }}>Đang mở cửa</Text>
            </Text>
          </View>
          {/* Running Orders and Order Requests */}
          <View style={styles.statsContainer}>
            <View style={styles.statsCard}>
              <Text style={styles.statsNumber}>{dashboard.runningOrders}</Text>
              <Text style={styles.statsLabel}>Đơn hàng</Text>
            </View>
            <View style={styles.statsCard}>
              <Text style={styles.statsNumber}>{pendingOrders.length || dashboard.orderRequests}</Text>
              <Text style={styles.statsLabel}>Đơn hàng mới</Text>
            </View>
          </View>
          {/* Revenue Card */}
          <View className="revenueCard" style={styles.revenueCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>Tổng doanh thu hôm nay</Text>
                {/* Chỉ hiển thị doanh thu của ngày hôm nay */}
                <Text style={styles.revenueAmount}>{(() => {
                  const today = new Date();
                  const todayStr = today.toISOString().slice(0, 10);
                  const todayRevenue = dashboard.revenueData?.find(item => item.date === todayStr)?.revenue || 0;
                  return todayRevenue.toLocaleString('vi-VN');
                })()} đ</Text>
              </View>
              <View style={styles.headerRight}>
                <View style={styles.periodSelector}>
                  <Text style={styles.periodText}>Ngày</Text>
                  <Ionicons name="chevron-down" size={14} color="#9B9BA5" />
                </View>
              </View>
            </View>
            <RevenueChart data={dashboard.revenueData} />
          </View>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
};

export default SellerDashboard;