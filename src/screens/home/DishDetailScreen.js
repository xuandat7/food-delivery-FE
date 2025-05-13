import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

const DishDetailScreen = ({ route, navigation }) => {
  const { dish } = route.params;

  const handleAddToCart = async () => {
    try {
      // Gọi API thêm vào giỏ hàng
      const res = await fetch(`http://localhost:3001/cart/${dish.id}?quantity=1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok) {
        alert('Đã thêm vào giỏ hàng!');
        console.log('Thêm vào giỏ hàng thành công:', data);
        // Có thể cập nhật lại badge cart ở Home nếu muốn

      } else {
        alert(data.message || 'Thêm vào giỏ hàng thất bại!');
      }
    } catch (error) {
      alert('Lỗi khi thêm vào giỏ hàng!');
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Dish Image */}
        <Image 
          source={dish.thumbnail ? { uri: dish.thumbnail } : require('../../../assets/icon.png')}
          style={styles.dishImage}
          resizeMode="cover"
        />

        {/* Dish Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.dishName}>{dish.name}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{dish.price?.toLocaleString('vi-VN')} ₫</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mô tả</Text>
            <Text style={styles.description}>{dish.description || 'Không có mô tả chi tiết cho món ăn này.'}</Text>
          </View>

          {/* Add to Cart Button */}
          <TouchableOpacity 
            style={styles.addToCartButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dishImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
  },
  infoContainer: {
    padding: 16,
  },
  dishName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  priceContainer: {
    marginBottom: 16,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FB6D3A',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  addToCartButton: {
    backgroundColor: '#FB6D3A',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DishDetailScreen;