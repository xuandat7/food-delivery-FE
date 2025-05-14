import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Image, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Nếu bạn dùng Expo, hoặc dùng react-native-vector-icons
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { cartAPI, userAPI, AsyncStorage } from '../../services';

const EditCart = () => {
  // State for cart items
  const [cartItems, setCartItems] = useState([]);
  // State for address
  const [address, setAddress] = useState('');
  const [editingAddress, setEditingAddress] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [cartId, setCartId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [addressLoading, setAddressLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();

  // Fetch user profile to get address
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setAddressLoading(true);
        console.log('Fetching user address...');
        
        // First try to get user data from AsyncStorage
        const userData = await AsyncStorage.getItem('userData');
        let userAddress = '';
        let userProfileData = null;
        
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setUserProfile(parsedUserData);
          
          // Get address from local storage if available
          if (parsedUserData.address) {
            userAddress = parsedUserData.address;
            console.log('Found address in AsyncStorage:', userAddress);
          }
        }
        
        // Always try to fetch the latest data from API as well
        try {
          const response = await userAPI.getProfile();
          console.log('API response for user profile:', response);
          
          if (response.success && response.data) {
            // Update user profile with latest data from API
            setUserProfile(response.data);
            userProfileData = response.data;
            
            // If API has an address and it's different from what we have locally, update it
            if (response.data.address && (!userAddress || response.data.address !== userAddress)) {
              userAddress = response.data.address;
              console.log('Updated address from API:', userAddress);
              
              // Update the local storage with the new address
              if (userData) {
                const parsedUserData = JSON.parse(userData);
                const updatedUserData = { ...parsedUserData, address: userAddress };
                await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
              }
            }
          }
        } catch (apiError) {
          console.error('Error fetching user profile from API:', apiError);
          // Continue with local data if API fails
        }
        
        // Update the address state with whatever we found
        setAddress(userAddress);
        setAddressInput(userAddress);
        
        setAddressLoading(false);
      } catch (error) {
        console.error('Error in fetch user profile process:', error);
        setAddressLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);

  // Fetch cart from API
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      const res = await cartAPI.getCart();
      console.log('Cart data:', res);
      if (res.success) {
        setCartId(res.data.cartId);
        // Map lại dữ liệu từ API về đúng format UI cần
        setCartItems((res.data.items || []).map(item => ({
          id: item.dishId,
          name: item.name,
          price: Number(item.price),
          size: item.size || '',
          qty: item.quantity,
          thumbnail: item.thumbnail,
          description: item.description,
          category: item.category
        })));
      }
      setLoading(false);
    };
    fetchCart();
  }, []);

  // Reset cart nếu nhận được params resetCart
  useFocusEffect(
    React.useCallback(() => {
      if (route.params && route.params.resetCart) {
        // Refetch cart from backend to ensure UI is in sync after clearCart
        const fetchCart = async () => {
          setLoading(true);
          const res = await cartAPI.getCart();
          if (res.success) {
            setCartId(res.data.cartId);
            setCartItems((res.data.items || []).map(item => ({
              id: item.dishId,
              name: item.name,
              price: Number(item.price),
              size: item.size || '',
              qty: item.quantity,
              thumbnail: item.thumbnail,
              description: item.description,
              category: item.category
            })));
          } else {
            setCartItems([]);
          }
          setLoading(false);
        };
        fetchCart();
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
  const handleQtyChange = async (id, delta) => {
    if (!editMode) return; // Chỉ cho phép khi đang ở chế độ edit
    const item = cartItems.find(i => i.id === id);
    if (!item) return;
    const newQty = Math.max(1, item.qty + delta);
    setCartItems(items => items.map(i => i.id === id ? { ...i, qty: newQty } : i));
  };

  // Lưu lại trạng thái khi bấm DONE
  const handleDoneEdit = async () => {
    for (const item of cartItems) {
      try {
        await cartAPI.updateCartItemQuantity(item.id, item.qty);
      } catch (e) {
        // Có thể show thông báo lỗi nếu muốn
      }
    }
    setEditMode(false);
  };

  // Xoá sản phẩm khỏi giỏ hàng
  const handleRemoveItem = async (id) => {
    try {
      const res = await cartAPI.removeCartItem(id);
      if (res.success) {
        setCartItems(items => items.filter(item => item.id !== id));
      }
    } catch (e) {
      // Có thể show thông báo lỗi nếu muốn
    }
  };

  // Total calculation
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Address save handler
  const handleSaveAddress = async () => {
    try {
      setAddress(addressInput);
      setEditingAddress(false);
      
      // Nếu có userProfile, cập nhật địa chỉ vào thông tin user
      if (userProfile) {
        // Cập nhật địa chỉ vào AsyncStorage
        const updatedUserData = { ...userProfile, address: addressInput };
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
        setUserProfile(updatedUserData);
        
        // Cập nhật địa chỉ lên server (nếu API hỗ trợ)
        try {
          await userAPI.updateProfile(userProfile.id, { address: addressInput });
          console.log('Updated user address successfully');
        } catch (error) {
          console.error('Failed to update user address on server:', error);
        }
      }
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const handlePlaceOrder = () => {
    // Kiểm tra xem có địa chỉ giao hàng chưa
    if (!address.trim()) {
      // Nếu chưa có địa chỉ, mở chức năng chỉnh sửa địa chỉ
      setEditingAddress(true);
      setAddressInput('');
      
      // Hiển thị cảnh báo cho người dùng
      Alert.alert(
        "Địa chỉ giao hàng",
        "Vui lòng nhập địa chỉ giao hàng để tiếp tục đặt hàng",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
      return;
    }
    
    // Nếu có địa chỉ và có sản phẩm trong giỏ hàng, chuyển sang màn hình thanh toán
    if (cartItems.length > 0) {
      navigation.navigate('PaymentMethod', { total, address });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.container}>
        {/* Top Bar */}
        <View style={[styles.topBar, { position: 'relative' }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: -1 }}>
            <Text style={styles.cartTitle}>Giỏ hàng</Text>
          </View>
          {cartItems.length > 0 && (
            <TouchableOpacity onPress={() => editMode ? handleDoneEdit() : setEditMode(true)}>
              <Text style={[styles.editItems, editMode && { color: '#1ec28b' }]}>{editMode ? 'XONG' : 'CHỈNH SỬA'}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Cart Items */}
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#fff' }}>Đang tải giỏ hàng...</Text>
          </View>
        ) : (
          <ScrollView style={styles.cartList} keyboardShouldPersistTaps="handled">
            {cartItems.length === 0 ? (
              <Text style={{ color: '#fff', textAlign: 'center', marginTop: 32 }}>Giỏ hàng của bạn đang trống.</Text>
            ) : (
              cartItems.map(item => (
                <View style={styles.cartItem} key={item.id}>
                  {/* Show thumbnail if available */}
                  {item.thumbnail ? (
                    <Image
                      source={{ uri: item.thumbnail }}
                      style={styles.itemImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <Image
                      source={require('../../../assets/icon.png')}
                      style={styles.itemImage}
                      resizeMode="cover"
                    />
                  )}
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>{new Intl.NumberFormat('vi-VN').format(item.price)} đ</Text>
                    <Text style={styles.itemSize}>{item.size}</Text>
                  </View>
                  <View style={styles.qtyControl}>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => handleQtyChange(item.id, -1)} disabled={!editMode}>
                      <Text style={[styles.qtyBtnText, !editMode && { opacity: 0.3 }]}>➖</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.qty}</Text>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => handleQtyChange(item.id, 1)} disabled={!editMode}>
                      <Text style={[styles.qtyBtnText, !editMode && { opacity: 0.3 }]}>➕</Text>
                    </TouchableOpacity>
                  </View>
                  {editMode && (
                    <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemoveItem(item.id)}>
                      <Text style={styles.removeBtnText}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))
            )}
          </ScrollView>
        )}

        {/* Delivery Address & Total */}
        <View style={styles.infoSection}>
          <View style={styles.addressRow}>
            <Text style={styles.addressLabel}>ĐỊA CHỈ GIAO HÀNG</Text>
            {editingAddress ? (
              <TouchableOpacity onPress={handleSaveAddress}>
                <Text style={styles.editAddress}>LƯU</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => {
                setEditingAddress(true);
                setAddressInput(address);
              }}>
                <Text style={styles.editAddress}>SỬA</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.addressBox}>
            {addressLoading ? (
              <View style={{ alignItems: 'center', justifyContent: 'center', padding: 8 }}>
                <ActivityIndicator size="small" color="#ff7621" />
                <Text style={{ color: '#a0a5ba', fontSize: 12, marginTop: 4 }}>Đang tải địa chỉ...</Text>
              </View>
            ) : editingAddress ? (
              <TextInput
                style={[styles.addressText, { color: '#31343d', opacity: 1 }]}
                value={addressInput}
                onChangeText={setAddressInput}
                autoFocus
                placeholder="Nhập địa chỉ giao hàng"
                placeholderTextColor="#a0a5ba"
                returnKeyType="done"
              />
            ) : (
              <Text style={[styles.addressText, !address && { color: '#ff7621' }]}>
                {address || 'Vui lòng nhập địa chỉ giao hàng của bạn'}
              </Text>
            )}
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TỔNG CỘNG:</Text>
            <Text style={styles.totalValue}>{new Intl.NumberFormat('vi-VN').format(total)} đ</Text>
            {/* <TouchableOpacity><Text style={styles.breakdown}>Chi tiết</Text></TouchableOpacity> */}
          </View>
          <TouchableOpacity
            style={[styles.placeOrderBtn, (cartItems.length === 0 || addressLoading) && { opacity: 0.5 }]}
            onPress={handlePlaceOrder}
            disabled={cartItems.length === 0 || addressLoading}
          >
            <Text style={styles.placeOrderText}>ĐẶT HÀNG</Text>
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
