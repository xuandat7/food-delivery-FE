import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const PaymentSuccessScreen = () => {
  const navigation = useNavigation();

  // Chặn back gesture hoặc back vật lý, nhưng cho phép nhấn nút QUAY LẠI TRANG CHỦ
  useFocusEffect(
    React.useCallback(() => {
      const onBeforeRemove = (e) => {
        if (e.data.action.type === 'POP' || e.data.action.type === 'GO_BACK') {
          e.preventDefault();
        }
      };
      const sub = navigation.addListener('beforeRemove', onBeforeRemove);
      return () => sub();
    }, [navigation])
  );

  const handleTrackOrder = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home', params: { resetCart: true } }],
    });
  };

  return (
    <View style={styles.container}>
      {/* Placeholder for success image */}
      <View style={styles.imagePlaceholder}>
        <Ionicons name="checkmark-done" size={64} color="#b0b7c3" />
      </View>
      <Text style={styles.title}>Chúc mừng!</Text>
      <Text style={styles.desc}>Bạn đã thanh toán thành công!</Text>
      <TouchableOpacity style={styles.trackBtn} onPress={handleTrackOrder}>
        <Text style={styles.trackBtnText}>QUAY LẠI TRANG CHỦ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  imagePlaceholder: {
    width: 180,
    height: 180,
    borderRadius: 32,
    backgroundColor: '#b0b7c3',
    opacity: 0.4,
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#181c2e',
    marginBottom: 16,
    textAlign: 'center',
  },
  desc: {
    fontSize: 15,
    color: '#a0a5ba',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 22,
  },
  trackBtn: {
    backgroundColor: '#ff7621',
    borderRadius: 16,
    height: 56,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

export default PaymentSuccessScreen;
