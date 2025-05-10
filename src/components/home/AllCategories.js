import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";

const categories = [
  { id: 1, name: "All", icon: require("../../../assets/icon.png") },
  { id: 2, name: "Burger", icon: require("../../../assets/splash-icon.png") },
  { id: 3, name: "Pizza", icon: require("../../../assets/adaptive-icon.png") },
  { id: 4, name: "Drinks", icon: require("../../../assets/favicon.png") },
];

export const AllCategories = () => {
  return (
    <View className="mt-6">
      <Text className="text-xl text-[#31343d] mb-4">All Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            className="mr-4 items-center"
          >
            <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center">
              <Image source={category.icon} className="w-8 h-8" />
            </View>
            <Text className="mt-2 text-sm text-gray-600">{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}; 