import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { useNavigation } from '@react-navigation/native';
import api from "../../services/api";
import { MaterialIcons, MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

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
        // Lọc bỏ danh mục "Tất cả" nếu có
        let processedData = response.data.filter(cat => cat.name !== "Tất cả");
        
        // Hiển thị tối đa 8 danh mục
        const limitedCategories = processedData.slice(0, 8);
        setCategories(limitedCategories);
      } else {
        console.error("Không thể lấy danh mục:", response.message);
        // Sử dụng dữ liệu mẫu nếu API fails
        setCategories([
          { id: 1, name: "Burger" },
          { id: 2, name: "Pizza" },
          { id: 3, name: "Đồ uống" },
          { id: 4, name: "Món chính" },
          { id: 5, name: "Tráng miệng" },
          { id: 6, name: "Món ăn nhẹ" },
          { id: 7, name: "Salad" },
          { id: 8, name: "Đặc sản" },
        ]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);
      // Sử dụng dữ liệu mẫu nếu có lỗi
      setCategories([
        { id: 1, name: "Burger" },
        { id: 2, name: "Pizza" },
        { id: 3, name: "Đồ uống" },
        { id: 4, name: "Món chính" },
        { id: 5, name: "Tráng miệng" },
        { id: 6, name: "Món ăn nhẹ" },
        { id: 7, name: "Salad" },
        { id: 8, name: "Đặc sản" },
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCategoryPress = (category) => {
    // Chuyển hướng đến màn hình phù hợp với category đã chọn
    navigation.navigate("CategoryDetail", { category });
  };
  
  // Icon cho mỗi danh mục sử dụng các icon từ thư viện
  const getCategoryIcon = (categoryName) => {
    const iconSize = 18;
    const iconColor = "#FB6D3A";

    // Mapping tên danh mục với icon thích hợp
    switch(categoryName.toLowerCase()) {
      case "burger":
        return <FontAwesome5 name="hamburger" size={iconSize} color={iconColor} />;
      case "pizza":
        return <FontAwesome5 name="pizza-slice" size={iconSize} color={iconColor} />;
      case "đồ uống":
        return <Ionicons name="cafe" size={iconSize} color={iconColor} />;
      case "món chính":
        return <MaterialCommunityIcons name="food-variant" size={iconSize} color={iconColor} />;
      case "tráng miệng":
        return <MaterialCommunityIcons name="ice-cream" size={iconSize} color={iconColor} />;
      case "món ăn nhẹ":
        return <MaterialCommunityIcons name="food-apple" size={iconSize} color={iconColor} />;
      case "salad":
        return <MaterialCommunityIcons name="food-apple-outline" size={iconSize} color={iconColor} />;
      case "đặc sản":
        return <MaterialIcons name="restaurant" size={iconSize} color={iconColor} />;
      case "bánh mì":
        return <MaterialCommunityIcons name="food" size={iconSize} color={iconColor} />;
      case "cơm":
        return <MaterialCommunityIcons name="rice" size={iconSize} color={iconColor} />;
      case "lẩu":
        return <MaterialCommunityIcons name="pot-steam" size={iconSize} color={iconColor} />;
      case "nướng":
        return <FontAwesome5 name="fire" size={iconSize} color={iconColor} />;
      default:
        return <MaterialIcons name="restaurant-menu" size={iconSize} color={iconColor} />;
    }
  };

  return (
    <View className="mt-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl text-[#31343d]">Danh mục</Text>
      </View>
      
      {loading ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              className="mr-3 items-center"
              onPress={() => handleCategoryPress(category)}
            >
              <View className="flex-row items-center px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                {getCategoryIcon(category.name)}
                <Text className="ml-2 text-sm font-medium text-gray-700">{category.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}; 