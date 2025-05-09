import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const RestaurantWrapper = () => {
  return (
    <TouchableOpacity className="bg-white rounded-xl shadow-sm">
      <Image
        source={require("../../../assets/adaptive-icon.png")}
        className="w-full h-40 rounded-t-xl"
      />
      <View className="p-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-semibold text-[#31343d]">
            Pizza Hut
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text className="ml-1 text-sm text-gray-600">4.2</Text>
          </View>
        </View>
        <Text className="text-sm text-gray-500 mt-1">
          Pizza • Italian • Fast Food
        </Text>
        <View className="flex-row items-center mt-2">
          <Ionicons name="location" size={16} color="#666" />
          <Text className="ml-1 text-sm text-gray-600">3.0 km away</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}; 