import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

export const Top = () => {
  return (
    <View className="mt-6">
      <Text className="text-2xl font-bold text-[#31343d]">
        Hey Halal Good
      </Text>
      <Text className="text-base text-gray-500 mt-1">
        What would you like to eat?
      </Text>
    </View>
  );
}; 