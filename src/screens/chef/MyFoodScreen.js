import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  FlatList,
  Image,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView
} from 'react-native';
import { useNavigation, useIsFocused, CommonActions } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import api from '../../services/api'; // Import API service

const FoodItem = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.foodItem} onPress={() => onPress(item)}>
      {item.thumbnail ? (
        <Image 
          source={{ uri: item.thumbnail }}
          style={styles.foodImage}
          defaultSource={require('../../../assets/icon.png')}
        />
      ) : (
        <View style={styles.foodImage} />
      )}
      <View style={styles.foodInfo}>
        <View style={styles.foodHeader}>
          <Text style={styles.foodName}>{item.name}</Text>
          <TouchableOpacity style={styles.moreIcon}>
            <Feather name="more-vertical" size={20} color="#333" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category || 'Không phân loại'}</Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.price}>{item.price ? new Intl.NumberFormat('vi-VN').format(item.price) + 'đ' : 'Chưa có giá'}</Text>
        </View>
        
        <View style={styles.reviewRow}>
          <FontAwesome name="star" size={14} color="#FB6D3A" />
          <Text style={styles.rating}>{item.rating || '5.0'}</Text>
          <Text style={styles.reviewCount}>({item.reviews || '0'} Review)</Text>
          <Text style={styles.pickupText}>Pick Up</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const MyFoodScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dishes, setDishes] = useState([]);
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  // Get unique categories from dishes
  const getCategories = () => {
    const uniqueCategories = new Set(dishes.map(dish => dish.category));
    return ['All', ...Array.from(uniqueCategories).filter(Boolean)];
  };
  
  // Load dishes from API
  const loadDishes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.restaurant.getDishes(0, 100);
      console.log("API Response:", response);
      
      if (response.success) {
        setDishes(response.data);
        setFilteredDishes(response.data);
      } else {
        setError(response.message || 'Không thể tải danh sách món ăn');
      }
    } catch (error) {
      console.error('Error loading dishes:', error);
      setError('Đã xảy ra lỗi khi tải danh sách món ăn');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Filter dishes by category
  const filterDishes = (category) => {
    if (category === 'All') {
      setFilteredDishes(dishes);
    } else {
      setFilteredDishes(dishes.filter(dish => dish.category === category));
    }
  };
  
  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    loadDishes();
  };
  
  // Load dishes on initial render and when coming back to screen
  useEffect(() => {
    if (isFocused) {
      loadDishes();
    }
  }, [isFocused]);
  
  // Filter dishes when category changes
  useEffect(() => {
    filterDishes(selectedCategory);
  }, [selectedCategory, dishes]);
  
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };
  
  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleFoodItemPress = (foodItem) => {
    navigation.navigate('ChefFoodDetails', { foodItem });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <Ionicons name="chevron-back" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Danh sách món ăn</Text>
      </View>
      
      {/* Category Tabs */}
      <View style={styles.categoryContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoryScrollContent}
        >
          {getCategories().map((category) => (
            <TouchableOpacity 
              key={category}
              onPress={() => handleCategorySelect(category)}
              style={styles.categoryTab}
            >
              <Text 
                style={[
                  styles.categoryTitle,
                  selectedCategory === category && styles.selectedCategoryTitle
                ]}
              >
                {category}
              </Text>
              {selectedCategory === category && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* Item Count */}
      <Text style={styles.itemCount}>Tổng số: {filteredDishes.length} món ăn</Text>
      
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FB6D3A" />
          <Text style={styles.loadingText}>Đang tải danh sách món ăn...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadDishes}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredDishes}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={({ item }) => <FoodItem item={item} onPress={handleFoodItemPress} />}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#FB6D3A"]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Không có món ăn nào trong danh mục này</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#FB6D3A',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 50,
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#ECF0F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 17,
    color: '#181C2E',
    marginLeft: 16,
    fontWeight: '400',
  },
  categoryContainer: {
    marginTop: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#F6F8FA',
    position: 'relative',
  },
  categoryScrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 10,
  },
  categoryTab: {
    marginRight: 40,
    paddingBottom: 10,
    position: 'relative',
  },
  categoryTitle: {
    fontSize: 14,
    color: '#32343E',
    fontWeight: '400',
  },
  selectedCategoryTitle: {
    color: '#FB6D3A',
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#FB6D3A',
    width: 47,
    marginLeft: -10,
  },
  itemCount: {
    fontSize: 14,
    color: '#9B9BA5',
    marginTop: 24,
    marginLeft: 24,
    marginBottom: 12,
  },
  listContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    paddingBottom: 120, // Extra space for bottom tab
  },
  foodItem: {
    flexDirection: 'row',
    marginBottom: 20,
    height: 102,
  },
  foodImage: {
    width: 102,
    height: 102,
    borderRadius: 20,
    backgroundColor: '#98A8B8',
  },
  foodInfo: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  foodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#32343E',
  },
  moreIcon: {
    padding: 4,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 118, 33, 0.2)',
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 11,
    color: '#FB6D3A',
  },
  priceRow: {
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#32343E',
  },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    fontSize: 12,
    color: '#32343E',
    marginLeft: 4,
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 11,
    color: '#9B9BA5',
  },
  pickupText: {
    fontSize: 11,
    color: '#FB6D3A',
    marginLeft: 'auto',
  }
});

export default MyFoodScreen;