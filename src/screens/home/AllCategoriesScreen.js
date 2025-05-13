import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

const AllCategoriesScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.category.getAllCategories();
      if (response.success) {
        // Thêm "Tất cả" vào đầu danh sách nếu không có sẵn
        const allExists = response.data.some(cat => cat.name === "Tất cả");
        
        let processedData = response.data;
        if (!allExists) {
          processedData = [{ id: 0, name: "Tất cả" }, ...response.data];
        }
        
        setCategories(processedData);
      } else {
        console.error("Không thể lấy danh mục:", response.message);
        // Sử dụng dữ liệu mẫu nếu API fails
        setCategories([
          { id: 0, name: "Tất cả" },
          { id: 1, name: "Burger" },
          { id: 2, name: "Pizza" },
          { id: 3, name: "Đồ uống" },
          { id: 4, name: "Món chính" },
          { id: 5, name: "Tráng miệng" },
          { id: 6, name: "Món ăn nhẹ" },
          { id: 7, name: "Salad" },
        ]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);
      // Sử dụng dữ liệu mẫu nếu có lỗi
      setCategories([
        { id: 0, name: "Tất cả" },
        { id: 1, name: "Burger" },
        { id: 2, name: "Pizza" },
        { id: 3, name: "Đồ uống" },
        { id: 4, name: "Món chính" },
        { id: 5, name: "Tráng miệng" },
        { id: 6, name: "Món ăn nhẹ" },
        { id: 7, name: "Salad" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (category) => {
    if (category.name === "Tất cả") {
      // Nếu chọn "Tất cả", trở về màn hình chính
      navigation.navigate("Home");
    } else {
      // Chuyển hướng đến màn hình phù hợp với category đã chọn
      navigation.navigate("CategoryDetail", { category });
    }
  };

  // Icons default cho mỗi danh mục
  const getCategoryIcon = (categoryName) => {
    const icons = {
      "Tất cả": require("../../../assets/icon.png"),
      "Burger": require("../../../assets/splash-icon.png"),
      "Pizza": require("../../../assets/adaptive-icon.png"),
      "Đồ uống": require("../../../assets/favicon.png"),
      // Thêm các icons khác nếu cần
    };
    
    // Trả về icon mặc định nếu không tìm thấy
    return icons[categoryName] || require("../../../assets/icon.png");
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => handleCategoryPress(item)}
    >
      <View style={styles.iconContainer}>
        <Image source={getCategoryIcon(item.name)} style={styles.icon} />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Tất cả danh mục</Text>
        <View style={{ width: 24 }} /> {/* Để giữ header căn giữa */}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FB6D3A" style={styles.loader} />
      ) : (
        <FlatList
          data={categories}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
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
  categoryItem: {
    alignItems: 'center',
    width: '33.33%',
    marginBottom: 24,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  categoryName: {
    fontSize: 14,
    color: '#31343d',
    textAlign: 'center',
  },
});

export default AllCategoriesScreen; 