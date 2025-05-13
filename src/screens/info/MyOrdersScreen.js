import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ORDERS = [
  {
    id: '162432',
    type: 'Food',
    status: 'Completed',
    name: 'Pizza Hut',
    price: 35.25,
    date: '29 JAN, 12:30',
    items: 3,
    cartItem: { id: 1, name: 'Pizza Hut', price: 35.25, size: 'Large', qty: 1 },
  },
  {
    id: '242432',
    type: 'Drink',
    status: 'Completed',
    name: 'McDonald',
    price: 40.15,
    date: '30 JAN, 12:30',
    items: 2,
    cartItem: { id: 2, name: 'McDonald', price: 40.15, size: 'Large', qty: 1 },
  },
  {
    id: '240112',
    type: 'Drink',
    status: 'Canceled',
    name: 'Starbucks',
    price: 10.20,
    date: '30 JAN, 12:30',
    items: 1,
    cartItem: { id: 3, name: 'Starbucks', price: 10.20, size: 'Medium', qty: 1 },
  },
  {
    id: '999999',
    type: 'Food',
    status: 'Processing',
    name: 'Burger King',
    price: 25.00,
    date: '12 MAY, 14:00',
    items: 2,
    cartItem: { id: 4, name: 'Burger King', price: 25.00, size: 'Medium', qty: 1 },
  },
];

const MyOrdersScreen = () => {
  const navigation = useNavigation();
  const [tab, setTab] = useState('History');

  // Lọc đơn hàng theo tab
  const filteredOrders = tab === 'Processing'
    ? ORDERS.filter(order => order.status === 'Processing')
    : ORDERS.filter(order => order.status !== 'Processing');

  // Thêm sản phẩm vào giỏ hàng và chuyển sang EditCart
  const handleReOrder = (order) => {
    navigation.navigate('EditCart', { addItem: order.cartItem });
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
        {filteredOrders.map((order, idx) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderType}>{order.type}</Text>
              <Text style={[
                styles.orderStatus,
                order.status === 'Completed' ? styles.statusCompleted : order.status === 'Processing' ? styles.statusProcessing : styles.statusCanceled
              ]}>{order.status}</Text>
            </View>
            <View style={styles.orderBody}>
              <View style={styles.orderImage} />
              <View style={{ flex: 1 }}>
                <Text style={styles.orderName}>{order.name}</Text>
                <Text style={styles.orderPrice}>${order.price.toFixed(2)}</Text>
                <Text style={styles.orderMeta}>{order.date}  •  {order.items} Items</Text>
              </View>
              <Text style={styles.orderId}>#{order.id}</Text>
            </View>
            <View style={styles.orderActions}>
              {/* Bỏ nút Re-Order */}
            </View>
          </View>
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
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  orderType: { color: '#181c2e', fontSize: 15, fontWeight: '500' },
  orderStatus: { fontSize: 15, fontWeight: '500' },
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
