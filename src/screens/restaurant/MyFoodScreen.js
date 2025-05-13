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
  ScrollView,
  Modal
} from 'react-native';
import { useNavigation, useIsFocused, CommonActions } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { restaurantAPI } from '../../services'; // Import API service

const FoodItem = ({ item, onEditPress }) => {
  return (
    <View style={styles.foodItem}>
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
          <TouchableOpacity 
            style={styles.moreIcon} 
            onPress={() => onEditPress(item)}
          >
            <Feather name="more-vertical" size={20} color="#333" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category || 'Không phân loại'}</Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.price}>{item.price ? new Intl.NumberFormat('vi-VN').format(item.price) + 'đ' : 'Chưa có giá'}</Text>
        </View>
      </View>
    </View>
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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  
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
      
      const response = await restaurantAPI.getDishes(0, 100);
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

  const handleEditPress = (foodItem) => {
    // Set the selected dish and show modal
    setSelectedDish(foodItem);
    setModalVisible(true);
  };
  
  const handleEditDish = () => {
    setModalVisible(false);
    
    // Log chi tiết để debug
    console.log('Editing dish:', selectedDish?.id, selectedDish?.name);
    
    if (selectedDish) {
      // Sử dụng navigation.navigate thay vì reset
      navigation.navigate('EditFoodScreen', { foodItem: selectedDish });
    } else {
      console.error('No dish selected for editing');
      Alert.alert('Lỗi', 'Không thể sửa món ăn, vui lòng thử lại');
    }
  };
  
  const handleDeleteDish = () => {
    setModalVisible(false);
    
    // Show confirmation dialog
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa món "${selectedDish?.name}" không?`,
      [
        {
          text: 'Hủy',
          style: 'cancel'
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: confirmDeleteDish
        }
      ]
    );
  };
  
  const confirmDeleteDish = async () => {
    if (!selectedDish || !selectedDish.id) return;
    
    try {
      setLoading(true);
      
      // Call API to delete dish
      const response = await restaurantAPI.deleteDish(selectedDish.id);
      
      if (response.success) {
        // Remove dish from state
        const updatedDishes = dishes.filter(dish => dish.id !== selectedDish.id);
        setDishes(updatedDishes);
        Alert.alert('Thành công', 'Đã xóa món ăn thành công');
      } else {
        // Handle error
        Alert.alert('Lỗi', response.message || 'Không thể xóa món ăn');
      }
    } catch (error) {
      console.error('Error deleting dish:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi xóa món ăn');
    } finally {
      setLoading(false);
    }
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
          <ActivityIndicator size="large" color="#3498db" />
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
          renderItem={({ item }) => (
            <FoodItem 
              item={item} 
              onEditPress={handleEditPress}
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#3498db"]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Không có món ăn nào trong danh mục này</Text>
            </View>
          }
        />
      )}
      
      {/* Options Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity 
                style={styles.modalOption}
                onPress={handleEditDish}
              >
                <Feather name="edit-2" size={18} color="#333" />
                <Text style={styles.modalOptionText}>Sửa sản phẩm</Text>
              </TouchableOpacity>
              
              <View style={styles.modalDivider} />
              
              <TouchableOpacity 
                style={styles.modalOption}
                onPress={handleDeleteDish}
              >
                <Feather name="trash-2" size={18} color="#FF3B30" />
                <Text style={[styles.modalOptionText, styles.deleteText]}>Xóa sản phẩm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      
      {/* Floating Action Button to add new items */}
      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => navigation.navigate('AddNewItems')}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
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
    backgroundColor: '#3498db',
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
    marginTop: 10,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
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
    fontSize: 18,
    color: '#181C2E',
    marginLeft: 16,
    fontWeight: '500',
  },
  categoryContainer: {
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F6F8FA',
    position: 'relative',
  },
  categoryScrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 6,
  },
  categoryTab: {
    marginRight: 40,
    paddingBottom: 6,
    position: 'relative',
  },
  categoryTitle: {
    fontSize: 14,
    color: '#32343E',
    fontWeight: '400',
  },
  selectedCategoryTitle: {
    color: '#3498db',
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#3498db',
    width: 47,
    marginLeft: -10,
  },
  itemCount: {
    fontSize: 14,
    color: '#9B9BA5',
    marginTop: 12,
    marginLeft: 24,
    marginBottom: 8,
  },
  listContainer: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    paddingBottom: 120, // Extra space for bottom tab
  },
  foodItem: {
    flexDirection: 'row',
    marginBottom: 16,
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
    backgroundColor: 'rgba(52, 152, 219, 0.2)',
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 11,
    color: '#3498db',
  },
  priceRow: {
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#32343E',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  modalOptionText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  deleteText: {
    color: '#FF3B30',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  fabButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default MyFoodScreen;