import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

const CategoryDetailScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurantsByCategory();
  }, []);

  const fetchRestaurantsByCategory = async () => {
    try {
      setLoading(true);
      // Giả định API trả về nhà hàng theo danh mục
      // Trong thực tế, cần thêm endpoint API để lấy nhà hàng theo category_id
      
      // TODO: Thay thế bằng API thực tế khi có sẵn
      // const response = await api.restaurant.getByCategory(category.id);
      
      // Sử dụng dữ liệu mẫu tạm thời
      setTimeout(() => {
        const mockRestaurants = [
          {
            id: 1,
            name: 'Nhà hàng 1',
            thumbnail: 'https://picsum.photos/200',
            rating: 4.5,
            totalReviews: 120,
            category: category.name,
            deliveryTime: '30-45 phút',
            minOrder: '50.000đ',
          },
          {
            id: 2,
            name: 'Nhà hàng 2',
            thumbnail: 'https://picsum.photos/201',
            rating: 4.2,
            totalReviews: 95,
            category: category.name,
            deliveryTime: '25-40 phút',
            minOrder: '45.000đ',
          },
          {
            id: 3,
            name: 'Nhà hàng 3',
            thumbnail: 'https://picsum.photos/202',
            rating: 4.7,
            totalReviews: 150,
            category: category.name,
            deliveryTime: '35-50 phút',
            minOrder: '60.000đ',
          },
          {
            id: 4,
            name: 'Nhà hàng 4',
            thumbnail: 'https://picsum.photos/203',
            rating: 4.0,
            totalReviews: 85,
            category: category.name,
            deliveryTime: '20-35 phút',
            minOrder: '40.000đ',
          },
          {
            id: 5,
            name: 'Nhà hàng 5',
            thumbnail: 'https://picsum.photos/204',
            rating: 4.3,
            totalReviews: 110,
            category: category.name,
            deliveryTime: '30-45 phút',
            minOrder: '55.000đ',
          },
        ];
        
        setRestaurants(mockRestaurants);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Lỗi khi lấy nhà hàng theo danh mục:", error);
      setLoading(false);
    }
  };

  const handleRestaurantPress = (restaurant) => {
    // Điều hướng đến trang chi tiết nhà hàng
    navigation.navigate('RestaurantView', { id: restaurant.id });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.restaurantItem}
      onPress={() => handleRestaurantPress(item)}
    >
      <Image 
        source={{ uri: item.thumbnail }} 
        style={styles.thumbnail}
        defaultSource={require('../../../assets/icon.png')}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.totalReviews}>({item.totalReviews})</Text>
        </View>
        <Text style={styles.category}>{item.category}</Text>
        <View style={styles.deliveryInfoContainer}>
          <Text style={styles.deliveryInfo}>
            <Ionicons name="time-outline" size={14} color="#666" /> {item.deliveryTime}
          </Text>
          <Text style={styles.deliveryInfo}>
            <Ionicons name="cash-outline" size={14} color="#666" /> Min {item.minOrder}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{category.name}</Text>
        <View style={{ width: 24 }} /> {/* Để giữ header căn giữa */}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FB6D3A" style={styles.loader} />
      ) : (
        <FlatList
          data={restaurants}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#31343d',
  },
  loader: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  restaurantItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnail: {
    width: 100,
    height: 100,
  },
  infoContainer: {
    flex: 1,
    padding: 10,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#31343d',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#31343d',
  },
  totalReviews: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  category: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  deliveryInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deliveryInfo: {
    fontSize: 12,
    color: '#666',
  },
});

export default CategoryDetailScreen; 