import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert, SafeAreaView, Platform } from 'react-native';
import api from '../../services/api';

const iconBack = require('../../../assets/icon-back.png');
const iconSave = require('../../../assets/icon-cancel.png');
const iconUser = require('../../../assets/icon.png');

const FoodDetailsScreen = ({ navigation, route }) => {
  const dishId = route?.params?.id;
  const [food, setFood] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (dishId) {
      fetchDishDetails();
    } else {
      setLoading(false);
      setFood({
        name: 'Pizza Calzone European',
        restaurant: 'Uttora Coffe House',
        price: 32,
        desc: 'Prosciutto e funghi is a pizza variety that is topped with tomato sauce.',
        img: iconUser,
      });
    }
  }, [dishId]);

  const fetchDishDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.dish.getDishById(dishId);
      
      if (response.success) {
        setFood({
          id: response.data.id,
          name: response.data.name,
          price: response.data.price,
          desc: response.data.description,
          img: { uri: response.data.thumbnail },
          restaurantId: response.data.restaurantId
        });
        
        // If we have a restaurant ID, fetch restaurant details
        if (response.data.restaurantId) {
          fetchRestaurantDetails(response.data.restaurantId);
        } else {
          setLoading(false);
        }
      } else {
        throw new Error(response.message || 'Failed to load dish details');
      }
    } catch (error) {
      console.error('Error fetching dish details:', error);
      setError('Không thể tải thông tin món ăn. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };
  
  const fetchRestaurantDetails = async (restaurantId) => {
    try {
      const response = await api.restaurant.getRestaurantById(restaurantId);
      
      if (response.success) {
        setRestaurant(response.data);
      } else {
        console.log('Restaurant data not available:', response.message);
      }
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    Alert.alert("Thông báo", "Đã thêm vào giỏ hàng!");
  };
  
  const goToRestaurant = () => {
    if (restaurant && restaurant.id) {
      navigation.navigate('RestaurantView', { id: restaurant.id });
    } else if (food && food.restaurantId) {
      navigation.navigate('RestaurantView', { id: food.restaurantId });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FB6D3A" />
        <Text style={styles.loadingText}>Đang tải thông tin món ăn...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchDishDetails}
        >
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!food) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy thông tin món ăn.</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Image source={iconBack} style={styles.backIcon} />
            </TouchableOpacity>
            <Text style={styles.title}>Chi tiết món ăn</Text>
            <View style={styles.placeholderBtn} />
          </View>
          
          {/* Food Image */}
          <View style={styles.foodImgWrapper}>
            {food.img && food.img.uri ? (
              <Image 
                source={food.img} 
                style={styles.foodImg}
                defaultSource={iconUser}
              />
            ) : (
              <Image source={iconUser} style={styles.foodImg} />
            )}
            <TouchableOpacity style={styles.saveBtn}>
              <View style={styles.saveBtnBg} />
              <Image source={iconSave} style={styles.saveIcon} />
            </TouchableOpacity>
          </View>
          
          {/* Restaurant */}
          <TouchableOpacity 
            style={styles.restaurantBtn} 
            onPress={goToRestaurant}
            disabled={!restaurant && !food.restaurantId}
          >
            {restaurant && restaurant.image_url ? (
              <Image 
                source={{ uri: restaurant.image_url }} 
                style={styles.restaurantIcon}
                defaultSource={iconUser}
              />
            ) : (
              <Image source={iconUser} style={styles.restaurantIcon} />
            )}
            <Text style={styles.restaurantText}>
              {restaurant ? restaurant.name : food.restaurant || "Không có thông tin nhà hàng"}
            </Text>
          </TouchableOpacity>
          
          {/* Food Name & Desc */}
          <Text style={styles.foodName}>{food.name}</Text>
          <Text style={styles.foodDesc}>{food.desc || "Không có mô tả cho món ăn này"}</Text>
          
          {/* Removed Info Row with stars, free, and 20min */}
        </ScrollView>

        {/* Bottom Cart Section - Fixed at bottom */}
        <View style={styles.bottomSection}>
          <View style={styles.cartBar}>
            <View style={styles.priceSection}>
              <Text style={styles.priceLabel}>Tổng tiền:</Text>
              <Text style={styles.price}>
                {food.price ? `${new Intl.NumberFormat('vi-VN').format(food.price * quantity)}đ` : '$0'}
              </Text>
            </View>
            
            <View style={styles.qtyBox}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(Math.max(1, quantity-1))}>
                <Text style={styles.qtyBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(quantity+1)}>
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity style={styles.addCartBtn} onPress={handleAddToCart}>
            <Text style={styles.addCartText}>THÊM VÀO GIỎ HÀNG</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 0 : 50,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FB6D3A',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    borderWidth: 1,
    borderColor: '#FB6D3A',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#FB6D3A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    height: 45,
    marginTop: Platform.OS === 'ios' ? 10 : 0,
  },
  backBtn: {
    backgroundColor: '#ecf0f4',
    borderRadius: 22.5,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderBtn: {
    width: 45,
    height: 45,
  },
  backIcon: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    color: '#181c2e',
    fontFamily: 'Sen-Regular',
    fontWeight: '400',
  },
  foodImgWrapper: {
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  foodImg: {
    width: '100%',
    height: 184,
    borderRadius: 32,
    backgroundColor: '#bfc5d2',
  },
  saveBtn: {
    position: 'absolute',
    right: 24,
    bottom: 16,
    width: 37,
    height: 37,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnBg: {
    backgroundColor: '#fff',
    opacity: 0.2,
    borderRadius: 18.5,
    width: 37,
    height: 37,
    position: 'absolute',
  },
  saveIcon: {
    width: 17,
    height: 15,
    resizeMode: 'contain',
    position: 'absolute',
    left: 10,
    top: 11,
  },
  restaurantBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e5e6eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  restaurantIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#eee',
  },
  restaurantText: {
    color: '#181c2e',
    fontFamily: 'Sen-Regular',
    fontSize: 14,
    fontWeight: '500',
  },
  foodName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#181c2e',
    fontFamily: 'Sen-Bold',
    marginBottom: 4,
  },
  foodDesc: {
    color: '#a0a5ba',
    fontFamily: 'Sen-Regular',
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 16,
  },
  bottomSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16, // Extra padding for iPhone's home indicator
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cartBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  priceSection: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: '#a0a5ba',
    fontFamily: 'Sen-Regular',
    marginBottom: 2,
  },
  price: {
    fontSize: 22,
    color: '#181c2e',
    fontFamily: 'Sen-Bold',
    fontWeight: '700',
  },
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 32,
    paddingHorizontal: 8,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: {
    fontSize: 22,
    color: '#181c2e',
    fontWeight: '500',
  },
  qtyText: {
    fontSize: 18,
    color: '#181c2e',
    fontWeight: '500',
    width: 30,
    textAlign: 'center',
  },
  addCartBtn: {
    backgroundColor: '#fb6d3a',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCartText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Sen-Bold',
    fontWeight: '700',
  },
});

export default FoodDetailsScreen; 