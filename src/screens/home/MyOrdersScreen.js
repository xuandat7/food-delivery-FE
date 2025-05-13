import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';

const STATUS_PROCESSING = ['pending', 'confirmed', 'processing', 'delivering'];
const STATUS_HISTORY = ['completed', 'cancelled'];

const MyOrdersScreen = () => {
  const navigation = useNavigation();
  const [tab, setTab] = useState('History');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const res = await api.getMyOrders(1, 10);
      if (res.success && res.data && Array.isArray(res.data.content)) {
        setOrders(res.data.content);
      } else {
        setOrders([]);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  // Filter orders by tab
  const filteredOrders = orders.filter(order =>
    tab === 'Processing'
      ? STATUS_PROCESSING.includes(order.status?.toLowerCase())
      : STATUS_HISTORY.includes(order.status?.toLowerCase())
  );

  // Format status color
  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === 'completed') return styles.statusCompleted;
    if (s === 'cancelled') return styles.statusCanceled;
    return styles.statusProcessing;
  };

  // Format date
  const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Go to order detail
  const handleOrderPress = (order) => {
    navigation.navigate('OrderDetail', { order });
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.circleBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>My Orders</Text>
        <TouchableOpacity style={styles.circleBtn}>
          <Entypo name="dots-three-horizontal" size={20} color="#333" />
        </TouchableOpacity>
      </View>
      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity onPress={() => setTab('Processing')} style={[styles.tabBtn, tab === 'Processing' && styles.tabBtnActive]}>
          <Text style={[styles.tabText, tab === 'Processing' && styles.tabTextActive]}>Processing</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('History')} style={[styles.tabBtn, tab === 'History' && styles.tabBtnActive]}>
          <Text style={[styles.tabText, tab === 'History' && styles.tabTextActive]}>History</Text>
        </TouchableOpacity>
      </View>
      {/* Orders List */}
      <ScrollView style={styles.orderList} showsVerticalScrollIndicator={false}>
        {loading ? (
          <Text style={{ textAlign: 'center', marginTop: 32 }}>Loading...</Text>
        ) : filteredOrders.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 32 }}>No orders found.</Text>
        ) : filteredOrders.map((order) => (
          <TouchableOpacity key={order.id} style={styles.orderCard} onPress={() => handleOrderPress(order)}>
            <View style={styles.orderHeader}>
              <View style={styles.orderHeaderNameWrap}>
                <Text style={styles.orderType} numberOfLines={1} ellipsizeMode="tail">{order.restaurant?.name || 'Order'}</Text>
              </View>
              <View style={styles.orderHeaderStatusWrap}>
                <Text style={[styles.orderStatus, getStatusStyle(order.status)]} numberOfLines={1} ellipsizeMode="tail">{order.status}</Text>
              </View>
            </View>
            <View style={styles.orderBody}>
              {order.restaurant?.image_url ? (
                <Image source={{ uri: order.restaurant.image_url }} style={styles.orderImage} />
              ) : (
                <View style={styles.orderImage} />
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.orderName}>{order.restaurant?.name || 'Order'}</Text>
                <Text style={styles.orderPrice}>{new Intl.NumberFormat('vi-VN').format(order.total_price)} đ</Text>
                <Text style={styles.orderMeta}>{formatDate(order.created_at)}  •  {order.totalItems} Items</Text>
              </View>
              <Text style={styles.orderId}>#{order.id}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 24, marginTop: 50, marginBottom: 20 },
  circleBtn: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#ecf0f4', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 17, fontWeight: '400', color: '#181c2e' },
  tabRow: { flexDirection: 'row', width: '100%', justifyContent: 'center', borderBottomWidth: 1, borderColor: '#f6f8fa', marginBottom: 8 },
  tabBtn: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  tabBtnActive: {},
  tabText: { fontSize: 16, color: '#a0a5ba', fontWeight: '400' },
  tabTextActive: { color: '#ff7621', fontWeight: '700', borderBottomWidth: 2, borderColor: '#ff7621' },
  orderList: { width: '100%', paddingHorizontal: 0 },
  orderCard: { backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 24, marginVertical: 10, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' },
  orderHeaderNameWrap: { flex: 1, marginRight: 8, maxWidth: '40%' },
  orderHeaderStatusWrap: { minWidth: 80, maxWidth: 120, alignItems: 'flex-end', justifyContent: 'center' },
  orderType: { color: '#181c2e', fontSize: 15, fontWeight: '500' },
  orderStatus: { fontSize: 15, fontWeight: '500', textAlign: 'right' },
  statusCompleted: { color: '#1ec28b' },
  statusCanceled: { color: '#ff3b30' },
  statusProcessing: { color: '#ff9900' },
  orderBody: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  orderImage: { width: 64, height: 64, borderRadius: 12, backgroundColor: '#b0b7c3', opacity: 0.4, marginRight: 16 },
  orderName: { color: '#181c2e', fontSize: 18, fontWeight: '700' },
  orderPrice: { color: '#181c2e', fontSize: 16, fontWeight: '700', marginTop: 4 },
  orderMeta: { color: '#a0a5ba', fontSize: 13, marginTop: 4 },
  orderId: { color: '#a0a5ba', fontSize: 13, marginLeft: 8 },
  orderActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  reorderBtn: { backgroundColor: '#ff7621', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 24 },
  reorderBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});

export default MyOrdersScreen;
