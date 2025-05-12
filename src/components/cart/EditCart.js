import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Nếu bạn dùng Expo, hoặc dùng react-native-vector-icons
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';

const EditCart = () => {
  // State for cart items
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Pizza Calzone European',
      price: 64,
      size: '14"',
      qty: 2,
    },
    {
      id: 2,
      name: 'Pizza Calzone European',
      price: 32,
      size: '14"',
      qty: 1,
    },
  ]);
  // State for address
  const [address, setAddress] = useState('2118 Thornridge Cir. Syracuse');
  const [editingAddress, setEditingAddress] = useState(false);
  const [addressInput, setAddressInput] = useState(address);
  const [editMode, setEditMode] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  // Reset cart nếu nhận được params resetCart
  useFocusEffect(
    React.useCallback(() => {
      if (route.params && route.params.resetCart) {
        setCartItems([]);
      }
      // Thêm sản phẩm nếu có param addItem
      if (route.params && route.params.addItem) {
        setCartItems(items => {
          // Nếu sản phẩm đã có trong giỏ thì tăng qty, nếu chưa thì thêm mới
          const exists = items.find(i => i.id === route.params.addItem.id);
          if (exists) {
            return items.map(i => i.id === route.params.addItem.id ? { ...i, qty: i.qty + 1 } : i);
          } else {
            return [...items, route.params.addItem];
          }
        });
      }
    }, [route.params])
  );

  // Quantity handlers
  const handleQtyChange = (id, delta) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      )
    );
  };

  // Xoá sản phẩm khỏi giỏ hàng
  const handleRemoveItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  // Total calculation
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Address save handler
  const handleSaveAddress = () => {
    setAddress(addressInput);
    setEditingAddress(false);
  };

  const handlePlaceOrder = () => {
    navigation.navigate('PaymentMethod', { total });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.container}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.cartTitle}>Cart</Text>
          <TouchableOpacity onPress={() => setEditMode(!editMode)}>
            <Text style={[styles.editItems, editMode && { color: '#1ec28b' }]}>{editMode ? 'DONE' : 'EDIT ITEMS'}</Text>
          </TouchableOpacity>
        </View>

        {/* Cart Items */}
        <ScrollView style={styles.cartList} keyboardShouldPersistTaps="handled">
          {cartItems.map(item => (
            <View style={styles.cartItem} key={item.id}>
              {/* Image placeholder */}
              <View style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>${item.price}</Text>
                <Text style={styles.itemSize}>{item.size}</Text>
              </View>
              <View style={styles.qtyControl}>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => handleQtyChange(item.id, -1)}>
                  {/* Dùng icon nếu có, nếu không thì dùng emoji */}
                  {/* <Ionicons name="remove-circle-outline" size={20} color="#fff" /> */}
                  <Text style={styles.qtyBtnText}>➖</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.qty}</Text>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => handleQtyChange(item.id, 1)}>
                  {/* <Ionicons name="add-circle-outline" size={20} color="#fff" /> */}
                  <Text style={styles.qtyBtnText}>➕</Text>
                </TouchableOpacity>
              </View>
              {editMode && (
                <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemoveItem(item.id)}>
                  <Text style={styles.removeBtnText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Delivery Address & Total */}
        <View style={styles.infoSection}>
          <View style={styles.addressRow}>
            <Text style={styles.addressLabel}>DELIVERY ADDRESS</Text>
            {editingAddress ? (
              <TouchableOpacity onPress={handleSaveAddress}>
                <Text style={styles.editAddress}>SAVE</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => {
                setEditingAddress(true);
                setAddressInput(address);
              }}>
                <Text style={styles.editAddress}>EDIT</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.addressBox}>
            {editingAddress ? (
              <TextInput
                style={[styles.addressText, { color: '#31343d', opacity: 1 }]}
                value={addressInput}
                onChangeText={setAddressInput}
                autoFocus
                placeholder="Enter delivery address"
                placeholderTextColor="#a0a5ba"
                returnKeyType="done"
              />
            ) : (
              <Text style={styles.addressText}>{address}</Text>
            )}
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL:</Text>
            <Text style={styles.totalValue}>${total}</Text>
            {/* <TouchableOpacity><Text style={styles.breakdown}>Breakdown</Text></TouchableOpacity> */}
          </View>
          <TouchableOpacity style={styles.placeOrderBtn} onPress={handlePlaceOrder}>
            <Text style={styles.placeOrderText}>PLACE ORDER</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121223' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 24, marginTop: 24 },
  backBtn: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  cartTitle: { color: '#fff', fontSize: 17, fontWeight: '400' },
  editItems: { color: '#ff7621', fontSize: 14, textDecorationLine: 'underline' },
  cartList: { flex: 1, paddingHorizontal: 24, marginTop: 16 },
  cartItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  itemImage: { width: 64, height: 64, borderRadius: 12, backgroundColor: '#22223a', marginRight: 16 },
  itemInfo: { flex: 1 },
  itemName: { color: '#fff', fontSize: 18 },
  itemPrice: { color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 8 },
  itemSize: { color: '#fff', fontSize: 16, opacity: 0.5, marginTop: 4 },
  qtyControl: { flexDirection: 'row', alignItems: 'center', marginLeft: 8 },
  qtyBtn: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff', opacity: 0.2, justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  qtyText: { color: '#fff', fontSize: 16, fontWeight: '700', marginHorizontal: 8 },
  infoSection: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  addressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  addressLabel: { color: '#a0a5ba', fontSize: 14 },
  editAddress: { color: '#ff7621', fontSize: 14, textDecorationLine: 'underline' },
  addressBox: { backgroundColor: '#f6f8fa', borderRadius: 12, padding: 16, marginTop: 8, marginBottom: 16 },
  addressText: { color: '#31343d', fontSize: 16, opacity: 0.5 },
  totalRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  totalLabel: { color: '#a0a5ba', fontSize: 14 },
  totalValue: { color: '#181c2e', fontSize: 30, fontWeight: '400', marginLeft: 16 },
  breakdown: { color: '#ff7621', fontSize: 14, marginLeft: 'auto', textDecorationLine: 'underline' },
  placeOrderBtn: { backgroundColor: '#ff7621', borderRadius: 12, height: 62, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  placeOrderText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  addressInput: {
    color: '#31343d',
    fontSize: 16,
    backgroundColor: '#f6f8fa',
    borderRadius: 8,
    padding: 0,
    margin: 0,
    height: 24,
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  removeBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default EditCart;
