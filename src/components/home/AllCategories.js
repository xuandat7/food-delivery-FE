import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { useNavigation } from '@react-navigation/native';
import api from "../../services/api";

export const AllCategories = () => {
  const navigation = useNavigation();
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
        
        // Hiển thị tối đa 4 danh mục (bao gồm "Tất cả")
        const limitedCategories = processedData.slice(0, 4);
        setCategories(limitedCategories);
      } else {
        console.error("Không thể lấy danh mục:", response.message);
        // Sử dụng dữ liệu mẫu nếu API fails
        setCategories([
          { id: 0, name: "Tất cả" },
          { id: 1, name: "Burger" },
          { id: 2, name: "Pizza" },
          { id: 3, name: "Đồ uống" },
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
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCategoryPress = (category) => {
    if (category.name === "Tất cả") {
      navigation.navigate("AllCategories");
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

  return (
    <View className="mt-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl text-[#31343d]">Danh mục</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AllCategories")}>
          <Text className="text-sm text-blue-500">Xem tất cả</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              className="mr-4 items-center"
              onPress={() => handleCategoryPress(category)}
            >
              <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center">
                <Image source={getCategoryIcon(category.name)} className="w-8 h-8" />
              </View>
              <Text className="mt-2 text-sm text-gray-600">{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}; 