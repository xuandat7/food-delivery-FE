import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert, RefreshControl, Modal } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { restaurantAPI } from '../../services';
import { styles } from './SellerDashboardStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PendingOrdersScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [tab, setTab] = useState('processing');
  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [processingOrders, setProcessingOrders] = useState([]);
  const [deliveringOrders, setDeliveringOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [showDropdown, setShowDropdown] = useState({});
  const [activeOrderId, setActiveOrderId] = useState(null);
  
  const fetchPendingOrders = async () => {
    setRefreshing(true);
    try {
      console.log('Đang lấy danh sách đơn hàng...');
      const res = await restaurantAPI.getRestaurantOrders(0, 50);
      console.log('Kết quả API:', res.success, res.data?.content?.length);
      
      if (res.success && Array.isArray(res.data.content)) {
        const pendingList = res.data.content.filter(o => o.status === 'pending');
        console.log('Đơn hàng đang chờ:', pendingList.length);
        
        setPendingOrders(pendingList);
        setConfirmedOrders(res.data.content.filter(o => o.status === 'confirmed'));
        setProcessingOrders(res.data.content.filter(o => o.status === 'processing'));
        setDeliveringOrders(res.data.content.filter(o => o.status === 'delivering'));
        setCompletedOrders(res.data.content.filter(o => o.status === 'completed'));
        setCancelledOrders(res.data.content.filter(o => o.status === 'cancelled'));
      } else {
        console.log('Không có dữ liệu hoặc dữ liệu không hợp lệ');
        setPendingOrders([]);
        setConfirmedOrders([]);
        setProcessingOrders([]);
        setDeliveringOrders([]);
        setCompletedOrders([]);
        setCancelledOrders([]);
      }
    } catch (e) {
      console.error('Lỗi khi lấy danh sách đơn hàng:', e);
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

  // Tải dữ liệu khi component mount
  useEffect(() => {
    fetchPendingOrders();
  }, []);
  
  // Tải lại dữ liệu mỗi khi màn hình được focus
  useEffect(() => {
    if (isFocused) {
      console.log('PendingOrderScreen được focus - tải lại dữ liệu');
      fetchPendingOrders();
    }
  }, [isFocused, tab]); // Thêm tab để tải lại dữ liệu khi chuyển tab

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await restaurantAPI.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        await fetchPendingOrders(); // Gọi lại API để cập nhật danh sách mới nhất
        
        // Thông báo thành công và thêm hướng dẫn nếu đơn hàng được hoàn thành hoặc huỷ
        if (newStatus === 'completed' || newStatus === 'cancelled') {
          Alert.alert(
            'Thành công', 
            `Đã cập nhật trạng thái đơn hàng thành ${newStatus === 'completed' ? 'Hoàn thành' : 'Đã huỷ'}! Đơn hàng đã được chuyển sang tab Lịch sử.`
          );
        } else {
          Alert.alert('Thành công', 'Đã cập nhật trạng thái đơn hàng!');
        }
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
    setActiveOrderId(itemId);
    setShowDropdown(prev => {
      if (prev[itemId]) {
        return {};
      }
      return { [itemId]: true };
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
    // Lấy trạng thái hiển thị dựa vào status của item
    const getStatusText = (status) => {
      switch(status) {
        case 'pending': return 'Chờ Xác Nhận';
        case 'confirmed': return 'Đã Xác Nhận';
        case 'processing': return 'Đang Chế Biến';
        case 'delivering': return 'Đang Giao';
        case 'completed': return 'Hoàn Thành';
        case 'cancelled': return 'Đã Huỷ';
        default: return 'Chờ Xác Nhận';
      }
    };

    // Lấy màu sắc cho trạng thái
    const getStatusColor = (status) => {
      if (status === 'completed') return '#22C55E';
      if (status === 'cancelled') return '#EF4444';
      return '#3498db';
    };

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
        </View>
        <View style={{ alignItems: 'flex-end', justifyContent: 'space-between', height: 54, minWidth: 140 }}>
          <Text style={{ 
            color: getStatusColor(item.status), 
            fontWeight: 'bold', 
            fontSize: 14, 
            marginBottom: 8 
          }}>
            {getStatusText(item.status)}
          </Text>
          
          {/* Chỉ hiển thị nút chọn trạng thái cho đơn hàng chưa hoàn thành hoặc chưa huỷ */}
          {item.status !== 'completed' && item.status !== 'cancelled' && (
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
              <Ionicons name="chevron-down" size={16} color="#3498db" />
            </TouchableOpacity>
          )}
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
        {navigation.canGoBack() && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 16, top: 50, zIndex: 2 }}>
            <Ionicons name="arrow-back" size={24} color="#3498db" />
          </TouchableOpacity>
        )}
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#181C2E' }}>Đơn hàng</Text>
      </View>      {/* Tabs */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F2F2F2', marginBottom: 8 }}>
        <TouchableOpacity onPress={() => setTab('processing')} style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}>
          <Text style={{ fontSize: 17, fontWeight: 'bold', color: tab === 'processing' ? '#3498db' : '#B0AEB8' }}>Đang xử lý</Text>
          {tab === 'processing' && <View style={{ height: 3, backgroundColor: '#3498db', borderRadius: 2, marginTop: 4, width: 60 }} />}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('history')} style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}>
          <Text style={{ fontSize: 17, fontWeight: 'bold', color: tab === 'history' ? '#3498db' : '#B0AEB8' }}>Lịch sử</Text>
          {tab === 'history' && <View style={{ height: 3, backgroundColor: '#3498db', borderRadius: 2, marginTop: 4, width: 60 }} />}
        </TouchableOpacity>
      </View>
      {/* List */}
      {tab === 'processing' ? (
        <FlatList
          contentContainerStyle={{ padding: 16, paddingTop: 8, paddingBottom: 120 }}
          data={pendingOrders.concat(confirmedOrders).concat(processingOrders).concat(deliveringOrders)}
          keyExtractor={item => item.id.toString()}
          renderItem={renderPendingItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchPendingOrders} colors={["#3498db"]} />}
          ListEmptyComponent={() => <Text style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>Không có đơn hàng</Text>}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          contentContainerStyle={{ padding: 16, paddingTop: 8, paddingBottom: 120 }}
          data={[...completedOrders, ...cancelledOrders]}
          keyExtractor={item => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchPendingOrders} colors={["#3498db"]} />}
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
          ListEmptyComponent={() => <Text style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>Không có đơn hàng</Text>}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      {/* Status Selection Modal */}
      <Modal
        visible={Object.keys(showDropdown).length > 0}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDropdown({})}
      >
        <TouchableOpacity 
          style={{ 
            flex: 1, 
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end' 
          }}
          activeOpacity={1}
          onPress={() => setShowDropdown({})}
        >
          <View style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 16,
            maxHeight: '50%',
          }}>
            <View style={{ 
              width: 40, 
              height: 5, 
              backgroundColor: '#E0E0E0', 
              borderRadius: 5, 
              alignSelf: 'center',
              marginBottom: 16 
            }} />
            
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>
              Chọn trạng thái
            </Text>
            
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                onPress={() => {
                  if (activeOrderId) {
                    handleStatusSelect(activeOrderId, option.key);
                  }
                }}
                style={{
                  padding: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: '#F0F0F0',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Text style={{ color: option.color, fontWeight: 'bold', fontSize: 16 }}>
                  {option.label}
                </Text>
                {selectedStatus[activeOrderId] === option.key && (
                  <Ionicons name="checkmark-circle" size={20} color={option.color} />
                )}
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={{
                marginTop: 16,
                backgroundColor: '#3498db',
                borderRadius: 10,
                padding: 16,
                alignItems: 'center'
              }}
              onPress={() => setShowDropdown({})}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                Huỷ
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default PendingOrdersScreen;
