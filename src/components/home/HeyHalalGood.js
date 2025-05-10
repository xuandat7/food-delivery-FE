import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

export const HeyHalalGood = () => {
  return (
    <View className="mt-6">
      <View className="bg-blue-50 rounded-xl p-4">
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-xl font-bold text-blue-800">
              Hey Halal Good
            </Text>
            <Text className="text-sm text-blue-600 mt-1">
              Get 50% off on your first order
            </Text>
            <TouchableOpacity className="bg-blue-600 rounded-full px-4 py-2 mt-3 self-start">
              <Text className="text-white font-semibold">Order Now</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={require("../../../assets/favicon.png")}
            className="w-24 h-24"
          />
        </View>
      </View>
    </View>
  );
}; 