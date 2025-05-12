import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import PaymentSuccessScreen from './PaymentSuccessScreen';

const paymentMethods = [
  {
    key: 'cash',
    label: 'Cash',
    icon: null, // Sử dụng icon Ionicons thay vì ảnh, không require cash.png
  },
  {
    key: 'vnpay',
    label: 'VNPAY',
    icon: require('../../../assets/vnpay.png'), // Bạn cần thêm icon vnpay vào assets
  },
];

const PaymentMethodScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { total } = route.params || {};
  const [selected, setSelected] = useState('cash');

  const handleSelect = (key) => {
    setSelected(key);
    if (key === 'vnpay') {
      Alert.alert('Thông báo', 'Chức năng đang phát triển');
    }
  };

  const handlePay = () => {
    navigation.navigate('PaymentSuccess');
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#181c2e" />
        </TouchableOpacity>
        <Text style={styles.title}>Payment</Text>
      </View>
      {/* Payment Methods */}
      <View style={styles.methodRow}>
        {paymentMethods.map(method => (
          <TouchableOpacity
            key={method.key}
            style={[styles.methodBtn, selected === method.key && styles.methodBtnActive]}
            onPress={() => handleSelect(method.key)}
          >
            {method.icon ? (
              <Image source={method.icon} style={styles.methodIcon} resizeMode="contain" />
            ) : (
              <Ionicons name="cash-outline" size={32} color="#464e57" style={{ marginBottom: 8 }} />
            )}
            <Text style={[styles.methodLabel, selected === method.key && styles.methodLabelActive]}>{method.label}</Text>
            {selected === method.key && (
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={16} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
      {/* Total & Pay */}
      <View style={styles.bottomSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TỔNG:</Text>
          <Text style={styles.totalValue}>${total}</Text>
        </View>
        <TouchableOpacity style={styles.payBtn} onPress={handlePay}>
          <Text style={styles.payBtnText}>THANH TOÁN & XÁC NHẬN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topBar: { flexDirection: 'row', alignItems: 'center', padding: 24, marginTop: 24 },
  backBtn: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#ecf0f4', justifyContent: 'center', alignItems: 'center' },
  title: { color: '#181c2e', fontSize: 17, fontWeight: '400', marginLeft: 16 },
  methodRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 32, gap: 16 },
  methodBtn: { alignItems: 'center', padding: 12, borderRadius: 16, backgroundColor: '#f6f8fa', width: 90, height: 90, position: 'relative', marginHorizontal: 8 },
  methodBtnActive: { borderWidth: 2, borderColor: '#ff7621', backgroundColor: '#fff' },
  methodIcon: { width: 32, height: 32, marginBottom: 8 },
  methodLabel: { color: '#464e57', fontSize: 14 },
  methodLabelActive: { color: '#ff7621', fontWeight: '700' },
  checkCircle: { position: 'absolute', top: 8, right: 8, backgroundColor: '#ff7621', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  bottomSection: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24, alignItems: 'center' },
  totalRow: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between', marginBottom: 8 },
  totalLabel: { color: '#a0a5ba', fontSize: 14 },
  totalValue: { color: '#181c2e', fontSize: 30, fontWeight: '400', marginVertical: 8 },
  payBtn: { backgroundColor: '#ff7621', borderRadius: 12, height: 62, justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 16 },
  payBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});

export default PaymentMethodScreen;
