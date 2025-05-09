import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const Search = () => {
  return (
    <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2 mt-4">
      <Ionicons name="search" size={20} color="#666" />
      <TextInput
        className="flex-1 ml-2 text-base"
        placeholder="Search for food"
        placeholderTextColor="#666"
      />
      <TouchableOpacity>
        <Ionicons name="mic" size={20} color="#666" />
      </TouchableOpacity>
    </View>
  );
}; 