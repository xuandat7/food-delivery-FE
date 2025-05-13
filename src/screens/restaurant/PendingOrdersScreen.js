import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert, RefreshControl, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { restaurantAPI } from '../../services';
import { styles } from './SellerDashboardStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PendingOrdersScreen = () => {
  const navigation = useNavigation();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [tab, setTab] = useState('processing');
  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [processingOrders, setProcessingOrders] = useState([]);
  const [deliveringOrders, setDeliveringOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [showDropdown, setShowDropdown] = useState({}); // Để kiểm soát dropdown cho từng item
  const fetchPendingOrders = async () => {
    setRefreshing(true);
    try {
      const res = await restaurantAPI.getRestaurantOrders(0, 50);
    //   console.log('Pending Orders:', res.data.content);
      if (res.success && Array.isArray(res.data.content)) {
        setPendingOrders(res.data.content.filter(o => o.status === 'pending'));
        setConfirmedOrders(res.data.content.filter(o => o.status === 'confirmed'));
        setProcessingOrders(res.data.content.filter(o => o.status === 'processing'));
        setDeliveringOrders(res.data.content.filter(o => o.status === 'delivering'));
        setCompletedOrders(res.data.content.filter(o => o.status === 'completed'));
        setCancelledOrders(res.data.content.filter(o => o.status === 'cancelled'));
      } else {
        setPendingOrders([]);
        setConfirmedOrders([]);
        setProcessingOrders([]);
        setDeliveringOrders([]);
        setCompletedOrders([]);
        setCancelledOrders([]);
      }
    } catch (e) {
      setPendingOrders([]);
      setConfirmedOrders([]);
      setProcessingOrders([]);
      setDeliveringOrders([]);
      setCompletedOrders([]);
      setCancelledOrders([]);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    
    fetchPendingOrders();
  }, []);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await restaurantAPI.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        await fetchPendingOrders(); // Gọi lại API để cập nhật danh sách mới nhất
        Alert.alert('Thành công', 'Đã cập nhật trạng thái đơn hàng!');
      } else {
        Alert.alert('Lỗi', res.message || 'Không thể cập nhật trạng thái!');
      }
    } catch (e) {
      Alert.alert('Lỗi', e.message || 'Không thể cập nhật trạng thái!');
    }
  };

  const statusOptions = [
    { key: 'confirmed', label: 'Xác nhận', color: '#3498db' },
    { key: 'processing', label: 'Đang chế biến', color: '#3498db' },
    { key: 'delivering', label: 'Đang giao', color: '#3498db' },
    { key: 'completed', label: 'Hoàn thành', color: '#22C55E' },
    { key: 'cancelled', label: 'Huỷ', color: '#EF4444' },
  ];

  const toggleDropdown = (itemId) => {
    // Đóng tất cả các dropdown khác và chỉ mở/đóng dropdown được chọn
    setShowDropdown(prev => {
      const newState = {};
      // Nếu dropdown này đã mở, đóng nó lại
      if (prev[itemId]) {
        return newState; // Trả về object rỗng để đóng tất cả
      } 
      // Ngược lại, mở dropdown này và đóng các dropdown khác
      newState[itemId] = true;
      return newState;
    });
  };

  // Lấy tên trạng thái dựa trên key
  const getStatusLabel = (statusKey) => {
    const status = statusOptions.find(opt => opt.key === statusKey);
    return status ? status.label : 'Chọn trạng thái';
  };

  // Đóng dropdown khi chạm vào bất kỳ đâu trên màn hình
  useEffect(() => {
    const closeDropdown = () => {
      setShowDropdown({});
    };
    
    // Đảm bảo dropdown sẽ đóng khi component unmount
    return () => {
      closeDropdown();
    };
  }, [tab]); // Đóng dropdown khi chuyển tab

  const handleStatusSelect = (itemId, status) => {
    setSelectedStatus(prev => ({ ...prev, [itemId]: status }));
    handleUpdateOrderStatus(itemId, status);
    setShowDropdown({}); // Đóng tất cả dropdown
  };

  const renderPendingItem = ({ item }) => {
    return (
      <View style={{
        backgroundColor: '#fff',
        borderRadius: 18,
        marginBottom: 18,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 3,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F2F2F2',
      }}>
        <View style={{ marginRight: 14 }}>
          <Image
            source={item.user?.avatar ? { uri: item.user.avatar } : require('../../../assets/icon.png')}
            style={{ width: 54, height: 54, borderRadius: 12, backgroundColor: '#eee' }}
          />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text numberOfLines={1} style={{ color: '#888', fontSize: 14, marginBottom: 2 }}>{item.user?.fullName || 'Ẩn danh'}</Text>
          <Text numberOfLines={1} style={{ fontWeight: 'bold', fontSize: 17, color: '#181C2E', marginBottom: 2 }}>{item.restaurant_name || item.user?.fullName || 'Đơn hàng'}</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#181C2E', marginBottom: 2 }}>{parseInt(item.total_price).toLocaleString()} đ</Text>
          <Text style={{ color: '#888', fontSize: 13, marginBottom: 2 }}>{item.created_at?.slice(11, 16)} {item.created_at?.slice(8, 10)} thg {item.created_at?.slice(5, 7)}, {item.created_at?.slice(0, 4)}  •  {item.totalItems} món</Text>
          <Text style={{ color: '#aaa', fontSize: 13 }}>#{item.id}</Text>
        </View>        <View style={{ alignItems: 'flex-end', justifyContent: 'space-between', height: 54, minWidth: 140 }}>
          <Text style={{ color: '#3498db', fontWeight: 'bold', fontSize: 14, marginBottom: 8 }}>Chờ Xác Nhận</Text>
          
          {/* Custom Dropdown */}
          <View style={{ position: 'relative', zIndex: showDropdown[item.id] ? 9999 : 1 }}>
            <TouchableOpacity 
              onPress={() => toggleDropdown(item.id)}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#3498db',
                borderRadius: 8,
                backgroundColor: '#F0F6FB',
                paddingHorizontal: 12,
                paddingVertical: 8,
                width: 140,
              }}
            >
              <Text style={{ color: '#3498db', fontWeight: 'bold', fontSize: 13 }}>
                {selectedStatus[item.id] ? getStatusLabel(selectedStatus[item.id]) : 'Chọn trạng thái'}
              </Text>
              <Ionicons name={showDropdown[item.id] ? "chevron-up" : "chevron-down"} size={16} color="#3498db" />
            </TouchableOpacity>
            
            {showDropdown[item.id] && (
              <View style={{
                position: 'absolute',
                top: 40,
                right: 0,
                width: 140,
                backgroundColor: 'white',
                borderRadius: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 10,
                zIndex: 9999,
                borderWidth: 1,
                borderColor: '#eee',
              }}>
                {statusOptions.map((option, index) => (
                  <TouchableOpacity
                    key={option.key}
                    onPress={() => handleStatusSelect(item.id, option.key)}
                    style={{
                      padding: 10,
                      borderBottomWidth: index < statusOptions.length - 1 ? 1 : 0,
                      borderBottomColor: '#F0F0F0',
                      backgroundColor: selectedStatus[item.id] === option.key ? '#F5F5F5' : 'white',
                    }}
                  >
                    <Text style={{ color: option.color, fontWeight: 'bold', fontSize: 13 }}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderConfirmedItem = ({ item }) => (
    <View style={{
      backgroundColor: '#fff',
      borderRadius: 18,
      marginBottom: 18,
      padding: 16,
      shadowColor: '#000',
      shadowOpacity: 0.07,
      shadowRadius: 8,
      elevation: 3,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#F2F2F2',
    }}>
      <View style={{ marginRight: 14 }}>
        <Image
          source={item.user?.avatar ? { uri: item.user.avatar } : require('../../../assets/icon.png')}
          style={{ width: 54, height: 54, borderRadius: 12, backgroundColor: '#eee' }}
        />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text numberOfLines={1} style={{ color: '#888', fontSize: 14, marginBottom: 2 }}>{item.user?.fullName || 'Ẩn danh'}</Text>
        <Text numberOfLines={1} style={{ fontWeight: 'bold', fontSize: 17, color: '#181C2E', marginBottom: 2 }}>{item.restaurant_name || item.user?.fullName || 'Đơn hàng'}</Text>
        <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#181C2E', marginBottom: 2 }}>{parseInt(item.total_price).toLocaleString()} đ</Text>
        <Text style={{ color: '#888', fontSize: 13, marginBottom: 2 }}>{item.created_at?.slice(11, 16)} {item.created_at?.slice(8, 10)} thg {item.created_at?.slice(5, 7)}, {item.created_at?.slice(0, 4)}  •  {item.totalItems} món</Text>
        <Text style={{ color: '#aaa', fontSize: 13 }}>#{item.id}</Text>
      </View>
      <View style={{ alignItems: 'flex-end', justifyContent: 'space-between', height: 54 }}>
        <Text style={{ color: '#3498db', fontWeight: 'bold', fontSize: 14, marginBottom: 8 }}>Đã Xác Nhận</Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 0 }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 50, paddingBottom: 10, backgroundColor: '#fff' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 16, top: 50, zIndex: 2 }}>
          <Ionicons name="arrow-back" size={24} color="#FB6D3A" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#181C2E' }}>Đơn hàng</Text>
      </View>
      {/* Tabs */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F2F2F2', marginBottom: 8 }}>
        <TouchableOpacity onPress={() => setTab('processing')} style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}>
          <Text style={{ fontSize: 17, fontWeight: 'bold', color: tab === 'processing' ? '#FB6D3A' : '#B0AEB8' }}>Đang chờ</Text>
          {tab === 'processing' && <View style={{ height: 3, backgroundColor: '#FB6D3A', borderRadius: 2, marginTop: 4, width: 60 }} />}        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('history')} style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}>
          <Text style={{ fontSize: 17, fontWeight: 'bold', color: tab === 'history' ? '#FB6D3A' : '#B0AEB8' }}>Lịch sử</Text>
          {tab === 'history' && <View style={{ height: 3, backgroundColor: '#FB6D3A', borderRadius: 2, marginTop: 4, width: 60 }} />}
        </TouchableOpacity></View>
      {/* List */}
      {tab === 'processing' ? (
        <FlatList
          contentContainerStyle={{ padding: 16, paddingTop: 8, paddingBottom: 8 }}
          data={pendingOrders}
          keyExtractor={item => item.id.toString()}
          renderItem={renderPendingItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchPendingOrders} colors={["#FB6D3A"]} />}
          ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>Không có đơn hàng</Text>}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          contentContainerStyle={{ padding: 16, paddingTop: 8, paddingBottom: 8 }}
          data={[...confirmedOrders, ...processingOrders, ...deliveringOrders, ...completedOrders, ...cancelledOrders]}
          keyExtractor={item => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchPendingOrders} colors={["#FB6D3A"]} />}
          renderItem={({ item }) => (
            <View style={{
              backgroundColor: '#fff',
              borderRadius: 18,
              marginBottom: 18,
              padding: 16,
              shadowColor: '#000',
              shadowOpacity: 0.07,
              shadowRadius: 8,
              elevation: 3,
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#F2F2F2',
            }}>
              <View style={{ marginRight: 14 }}>
                <Image
                  source={item.user?.avatar ? { uri: item.user.avatar } : require('../../../assets/icon.png')}
                  style={{ width: 54, height: 54, borderRadius: 12, backgroundColor: '#eee' }}
                />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text numberOfLines={1} style={{ color: '#888', fontSize: 14, marginBottom: 2 }}>{item.user?.fullName || 'Ẩn danh'}</Text>
                <Text numberOfLines={1} style={{ fontWeight: 'bold', fontSize: 17, color: '#181C2E', marginBottom: 2 }}>{item.restaurant_name || item.user?.fullName || 'Đơn hàng'}</Text>
                <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#181C2E', marginBottom: 2 }}>{parseInt(item.total_price).toLocaleString()} đ</Text>
                <Text style={{ color: '#888', fontSize: 13, marginBottom: 2 }}>{item.created_at?.slice(11, 16)} {item.created_at?.slice(8, 10)} thg {item.created_at?.slice(5, 7)}, {item.created_at?.slice(0, 4)}  •  {item.totalItems} món</Text>
                <Text style={{ color: '#aaa', fontSize: 13 }}>#{item.id}</Text>
              </View>
              <View style={{ alignItems: 'flex-end', justifyContent: 'space-between', height: 54 }}>
                <Text style={{ 
                  color: item.status === 'cancelled' ? '#EF4444' : 
                         item.status === 'completed' ? '#22C55E' : 
                         '#3498db', 
                  fontWeight: 'bold', 
                  fontSize: 14, 
                  marginBottom: 8 
                }}>
                  {item.status === 'confirmed' ? 'Đã xác nhận' : 
                   item.status === 'processing' ? 'Đang chế biến' : 
                   item.status === 'delivering' ? 'Đang giao' : 
                   item.status === 'completed' ? 'Hoàn thành' : 
                   'Đã huỷ'}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>Không có đơn hàng</Text>}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default PendingOrdersScreen;
