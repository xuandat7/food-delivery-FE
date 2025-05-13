import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

export const TypeRestaurant = () => {
  const navigation = useNavigation();
  
  // Define the 5 restaurant types
  const restaurantTypes = [
    { id: 1, name: "Nhà hàng Âu", icon: "restaurant-menu", type: "Nhà hàng Âu" },
    { id: 2, name: "Nhà hàng Á", icon: "rice-bowl", type: "Nhà hàng Á" },
    { id: 3, name: "Đồ ngọt", icon: "ice-cream", type: "Đồ ngọt" },
    { id: 4, name: "Món Việt", icon: "restaurant", type: "Món Việt" },
    { id: 5, name: "Đồ ăn nhanh", icon: "fastfood", type: "Đồ ăn nhanh" }
  ];
  
  const handleTypePress = (type) => {
    // Navigate to a screen showing restaurants of this type
    navigation.navigate("TypeRestaurants", { type: type.type });
  };
  
  // Get icon for restaurant type
  const getTypeIcon = (iconName) => {
    const iconSize = 18;
    const iconColor = "#FB6D3A";

    switch(iconName) {
      case "restaurant-menu":
        return <MaterialIcons name="restaurant-menu" size={iconSize} color={iconColor} />;
      case "rice-bowl":
        return <MaterialCommunityIcons name="rice" size={iconSize} color={iconColor} />;
      case "ice-cream":
        return <MaterialCommunityIcons name="ice-cream" size={iconSize} color={iconColor} />;
      case "restaurant":
        return <MaterialIcons name="restaurant" size={iconSize} color={iconColor} />;
      case "fastfood":
        return <FontAwesome5 name="hamburger" size={iconSize} color={iconColor} />;
      default:
        return <MaterialIcons name="restaurant" size={iconSize} color={iconColor} />;
    }
  };

  return (
    <View className="mt-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text style={styles.categoryTitle}>Loại nhà hàng</Text>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {restaurantTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            className="mr-3 items-center"
            onPress={() => handleTypePress(type)}
          >
            <View className="flex-row items-center px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
              {getTypeIcon(type.icon)}
              <Text className="ml-2 text-sm font-medium text-gray-700">{type.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#31343d',
    letterSpacing: 0.5,
  }
}); 