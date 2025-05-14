import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { restaurantAPI, categoryAPI, dishAPI, cartAPI } from '../../services';

const iconBack = require('../../../assets/icon-back.png');
const foodImg = require('../../../assets/icon.png'); // Thay bằng ảnh món ăn nếu có

const RestaurantViewScreen = ({ navigation }) => {
  const route = useRoute();
  const restaurantId = route.params?.id;

  // State để lưu dữ liệu từ API
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // State để kiểm soát quá trình tải dữ liệu
  const [dataReady, setDataReady] = useState({
    restaurant: false,
    categories: false,
    dishes: false
  });
  
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (restaurantId) {
      fetchRestaurantData();
    } else {
      setErrorMessage('Không có ID nhà hàng được cung cấp');
      setLoading(false);
    }
  }, [restaurantId]);

  const fetchRestaurantData = async () => {
    setLoading(true);
    setErrorMessage(null);
    
    try {
      // Fetch restaurant details
      const restaurantResponse = await restaurantAPI.getRestaurantById(restaurantId);
      console.log('Restaurant data:', restaurantResponse);

      if (restaurantResponse.success) {
        setRestaurant(restaurantResponse.data);
        setDataReady(prev => ({ ...prev, restaurant: true }));
        
        // Proceed to fetch categories only after restaurant data is received
        await fetchCategoriesForRestaurant(restaurantId);
      } else {
        throw new Error(restaurantResponse.message || 'Không thể lấy thông tin nhà hàng');
      }
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      setErrorMessage('Không thể tải thông tin nhà hàng: ' + (error.message || 'Lỗi không xác định'));
      setLoading(false);
    }
  };

  const fetchCategoriesForRestaurant = async (id) => {
    try {
      const categoriesResponse = await categoryAPI.getCategoriesByRestaurant(id);
      console.log('Categories data:', categoriesResponse);

      if (categoriesResponse.success && categoriesResponse.data?.length > 0) {
        const validCategories = categoriesResponse.data.filter(cat => cat && cat.id);
        
        if (validCategories.length > 0) {
          setCategories(validCategories);
          setSelectedCategory(validCategories[0].id);
          setDataReady(prev => ({ ...prev, categories: true }));
          
          // Proceed to fetch dishes only after categories are received
          await fetchDishesByCategory(validCategories[0].id);
        } else {
          // No valid categories, fall back to all categories
          await fetchAllCategories();
        }
      } else {
        // If no categories available for this restaurant, fetch all categories
        await fetchAllCategories();
      }
    } catch (error) {
      console.error('Error fetching restaurant categories:', error);
      // If categories failed, try to get all categories
      await fetchAllCategories();
    }
  };

  const fetchAllCategories = async () => {
    try {
      const allCategoriesResponse = await categoryAPI.getAllCategories();
      console.log('All categories data:', allCategoriesResponse);
      
      if (allCategoriesResponse.success && allCategoriesResponse.data?.length > 0) {
        const validCategories = allCategoriesResponse.data.filter(cat => cat && cat.id);
        
        if (validCategories.length > 0) {
          setCategories(validCategories);
          setSelectedCategory(validCategories[0].id);
          setDataReady(prev => ({ ...prev, categories: true }));
          
          // Fetch dishes for the first category
          await fetchDishesByCategory(validCategories[0].id);
        } else {
          // Handle case with no valid categories
          setCategories([]);
          setDataReady(prev => ({ ...prev, categories: true }));
          setLoading(false);
        }
      } else {
        // Handle case with no categories
        setCategories([]);
        setDataReady(prev => ({ ...prev, categories: true }));
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching all categories:', error);
      setCategories([]);
      setDataReady(prev => ({ ...prev, categories: true }));
      setLoading(false);
    }
  };

  const fetchDishesByCategory = async (categoryId) => {
    if (!categoryId) {
      console.log('No category ID provided for fetching dishes');
      setDishes([]);
      setDataReady(prev => ({ ...prev, dishes: true }));
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const response = await dishAPI.getPublicDishByCategory(categoryId);
      console.log(`Dishes for category ${categoryId}:`, response);

      if (response.success) {
        // Filter dishes by restaurant ID if needed
        let dishesData = response.data.content || [];
        
        if (restaurantId) {
          dishesData = dishesData.filter(
            dish => !dish.restaurantId || dish.restaurantId === parseInt(restaurantId)
          );
        }
        
        setDishes(dishesData);
      } else {
        setDishes([]);
      }
      
      setDataReady(prev => ({ ...prev, dishes: true }));
    } catch (error) {
      console.error('Error fetching dishes by category:', error);
      setDishes([]);
      setDataReady(prev => ({ ...prev, dishes: true }));
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (categoryId) => {
    if (categoryId === selectedCategory) return;
    
    setSelectedCategory(categoryId);
    setDataReady(prev => ({ ...prev, dishes: false }));
    fetchDishesByCategory(categoryId);
  };

  const onFoodPress = (food) => {
    navigation.navigate('FoodDetails', { id: food.id });
  };

  // Add this function to handle add-to-cart
  const handleAddToCart = async (dish) => {
    try {
      const res = await cartAPI.addToCart(dish.id, 1);
      if (res.success) {
        Alert.alert('Thành công', 'Đã thêm vào giỏ hàng!');
        // Optionally: trigger cart badge update here if you have a context or callback
      } else {
        Alert.alert('Lỗi', res.message || 'Thêm vào giỏ hàng thất bại!');
      }
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể thêm vào giỏ hàng!');
    }
  };

  // New render condition to ensure all necessary data is available
  const isDataReady = dataReady.restaurant && dataReady.categories;
  
  if (loading && !isDataReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FB6D3A" />
        <Text style={styles.loadingText}>Đang tải thông tin nhà hàng...</Text>
      </View>
    );
  }
  
  if (errorMessage) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorMessage}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchRestaurantData}
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

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 24}}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Image source={iconBack} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.title}>{restaurant?.name || 'Thông tin nhà hàng'}</Text>
          <View style={{width: 45}} />
        </View>
        
        {/* Restaurant Image */}
        <View style={styles.restaurantImgWrapper}>
          {restaurant?.image_url ? (
            <Image 
              source={{ uri: restaurant.image_url }} 
              style={styles.restaurantImg}
              defaultSource={require('../../../assets/icon.png')}
            />
          ) : (
            <View style={styles.restaurantImg} />
          )}
        </View>
        
        {/* Restaurant Info */}
        <View style={styles.infoWrapper}>
          <Text style={styles.restaurantName}>{restaurant?.name || 'Tên nhà hàng'}</Text>
          <Text style={styles.restaurantDesc}>
            {restaurant?.description || restaurant?.address || 'Không có mô tả'}
          </Text>
          
          {/* Categories */}
          {!dataReady.categories || categories.length === 0 ? (
            <ActivityIndicator style={styles.categoryLoader} size="small" color="#FB6D3A" />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
              {categories.map((category) => (
                <TouchableOpacity 
                  key={`cat-${category.id}`} 
                  style={[
                    styles.categoryBtn, 
                    selectedCategory === category.id && styles.categoryBtnActive
                  ]}
                  onPress={() => handleCategoryPress(category.id)}
                  disabled={loading}
                >
                  <Text 
                    style={[
                      styles.categoryText, 
                      selectedCategory === category.id && styles.categoryTextActive
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
        
        {/* Food List */}
        <Text style={styles.foodListTitle}>
          {selectedCategory && categories.length > 0
            ? `${categories.find(c => c.id === selectedCategory)?.name || 'Món ăn'} (${dishes.length})`
            : `Món ăn (${dishes.length})`
          }
        </Text>
        
        {!dataReady.dishes || loading ? (
          <ActivityIndicator style={styles.dishesLoader} size="large" color="#FB6D3A" />
        ) : dishes.length === 0 ? (
          <View style={styles.noContentContainer}>
            <Text style={styles.noContentText}>Không có món ăn nào trong danh mục này</Text>
          </View>
        ) : (
          <View style={styles.foodList}>
            {dishes.map((dish) => (
              <TouchableOpacity 
                key={`dish-${dish.id}`} 
                style={styles.foodCard} 
                onPress={() => onFoodPress(dish)}
              >
                <View style={{flex: 1, justifyContent: 'flex-start'}}>
                  <Image 
                    source={{ uri: dish.thumbnail || 'https://via.placeholder.com/150' }} 
                    style={styles.foodImg}
                    defaultSource={require('../../../assets/icon.png')}
                  />
                  <Text style={styles.foodName} numberOfLines={2}>{dish.name}</Text>
                  <Text style={styles.foodRestaurant} numberOfLines={1}>
                    {restaurant?.name || dish.restaurant?.name || 'Nhà hàng'}
                  </Text>
                </View>
                <View style={styles.foodBottomRow}>
                  <Text style={styles.foodPrice}>
                    {dish.price ? `${new Intl.NumberFormat('vi-VN').format(dish.price)} đ` : ''}
                  </Text>
                  <TouchableOpacity style={styles.foodAddBtn} onPress={() => handleAddToCart(dish)}>
                    <Text style={styles.foodAddBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 10,
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
  categoryLoader: {
    marginVertical: 15,
  },
  dishesLoader: {
    marginVertical: 50,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    height: 45,
  },
  backBtn: {
    backgroundColor: '#ecf0f4',
    borderRadius: 22.5,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 14,
    height: 14,
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
  restaurantImgWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  restaurantImg: {
    width: 327,
    height: 160,
    borderRadius: 32,
    backgroundColor: '#bfc5d2',
    resizeMode: 'cover',
  },
  infoWrapper: {
    marginBottom: 16,
  },
  restaurantName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#181c2e',
    fontFamily: 'Sen-Bold',
    marginBottom: 8,
  },
  restaurantDesc: {
    fontSize: 14,
    color: '#5B5B5E',
    lineHeight: 21,
    marginBottom: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  categoryBtn: {
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e5e6eb',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 8,
  },
  categoryBtnActive: {
    backgroundColor: '#ff7621',
    borderColor: '#ff7621',
  },
  categoryText: {
    fontSize: 16,
    color: '#181c2e',
    fontFamily: 'Sen-Regular',
  },
  categoryTextActive: {
    color: '#fff',
  },
  foodListTitle: {
    fontSize: 20,
    color: '#181c2e',
    fontFamily: 'Sen-Regular',
    marginBottom: 16,
  },
  foodList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  foodCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
    height: 230,
    justifyContent: 'space-between',
  },
  foodImg: {
    width: 100,
    height: 84,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#bfc5d2',
    alignSelf: 'center',
  },
  foodName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#31343d',
    fontFamily: 'Sen-Bold',
    marginBottom: 2,
    textAlign: 'center',
    lineHeight: 18,
  },
  foodRestaurant: {
    fontSize: 13,
    color: '#646982',
    fontFamily: 'Sen-Regular',
    textAlign: 'center',
    lineHeight: 16,
  },
  foodBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  foodPrice: {
    fontSize: 16,
    color: '#181c2e',
    fontFamily: 'Sen-Bold',
  },
  foodAddBtn: {
    backgroundColor: '#ff7621',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodAddBtnText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 24,
    textAlign: 'center',
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
  noContentContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noContentText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default RestaurantViewScreen;