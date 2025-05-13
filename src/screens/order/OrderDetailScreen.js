import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const OrderDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { order } = route.params || {};

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Không tìm thấy đơn hàng.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.circleBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Order #{order.id}</Text>
        <View style={styles.circleBtn} />
      </View>
      {/* Restaurant Info */}
      <View style={styles.restaurantRow}>
        {order.restaurant?.image_url ? (
          <Image source={{ uri: order.restaurant.image_url }} style={styles.restaurantImg} />
        ) : (
          <View style={styles.restaurantImg} />
        )}
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.restaurantName}>{order.restaurant?.name || 'Nhà hàng'}</Text>
          <Text style={styles.restaurantAddress}>{order.restaurant?.address || ''}</Text>
        </View>
      </View>
      {/* Order Status & Info */}
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Trạng thái:</Text>
        <Text style={styles.infoValue}>{order.status}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Ngày đặt:</Text>
        <Text style={styles.infoValue}>{new Date(order.created_at).toLocaleString('vi-VN')}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Tổng tiền:</Text>
        <Text style={styles.infoValue}>{new Intl.NumberFormat('vi-VN').format(order.total_price)} đ</Text>
      </View>
      {/* Order Items */}
      <Text style={styles.sectionTitle}>Danh sách món ăn</Text>
      <ScrollView style={styles.itemsList}>
        {order.items && order.items.length > 0 ? (
          order.items.map(item => (
            <View key={item.id} style={styles.itemRow}>
              {item.dish_thumbnail ? (
                <Image source={{ uri: item.dish_thumbnail }} style={styles.itemImg} />
              ) : (
                <View style={styles.itemImg} />
              )}
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.itemName}>{item.dish_name}</Text>
                <Text style={styles.itemMeta}>Số lượng: {item.quantity}</Text>
                <Text style={styles.itemMeta}>Đơn giá: {new Intl.NumberFormat('vi-VN').format(item.price)} đ</Text>
                <Text style={styles.itemMeta}>Thành tiền: {new Intl.NumberFormat('vi-VN').format(item.subtotal)} đ</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.errorText}>Không có món ăn nào trong đơn này.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 24, paddingTop: 40 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  circleBtn: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#ecf0f4', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 17, fontWeight: '400', color: '#181c2e' },
  restaurantRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  restaurantImg: { width: 64, height: 64, borderRadius: 12, backgroundColor: '#b0b7c3', opacity: 0.7 },
  restaurantName: { fontSize: 18, fontWeight: '700', color: '#181c2e' },
  restaurantAddress: { fontSize: 13, color: '#a0a5ba', marginTop: 2 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  infoLabel: { color: '#a0a5ba', fontSize: 14 },
  infoValue: { color: '#181c2e', fontSize: 14, fontWeight: '500' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#181c2e', marginTop: 18, marginBottom: 8 },
  itemsList: { flex: 1 },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, backgroundColor: '#f6f8fa', borderRadius: 12, padding: 10 },
  itemImg: { width: 56, height: 56, borderRadius: 8, backgroundColor: '#b0b7c3', opacity: 0.7 },
  itemName: { fontSize: 15, fontWeight: '700', color: '#181c2e' },
  itemMeta: { fontSize: 13, color: '#646982', marginTop: 2 },
  errorText: { color: '#ff3b30', textAlign: 'center', marginTop: 32 },
  backBtn: { marginTop: 24, alignSelf: 'center', backgroundColor: '#ff7621', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 32 },
  backBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});

export default OrderDetailScreen;
