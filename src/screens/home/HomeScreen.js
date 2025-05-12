import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search } from "../../components/home/Search";
import { Top } from "../../components/home/Top";
import { AllCategories } from "../../components/home/AllCategories";
import { HeyHalalGood } from "../../components/home/HeyHalalGood";
import { Restaurant } from "../../components/home/Restaurant";
import { RestaurantWrapper } from "../../components/home/RestaurantWrapper";
import { FontAwesome, Ionicons, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator } from "react-native"; // Thêm ActivityIndicator vào import
import AsyncStorage from '@react-native-async-storage/async-storage';
const HomeScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra token khi component được mount
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('Token from storage:', token);
        
        if (!token) {
          console.log('No token found, redirecting to Login');
          navigation.reset({
            index: 0,
            routes: [{ name: 'Auth' }],
          });
        } else {
          // Token is valid, continue to Home
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking token:', error);
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#1976D2" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header with Delivery Location and Cart */}
        <View className="px-4 mt-2 flex-row justify-between items-center">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
              <Ionicons name="menu-outline" size={24} color="#000" />
            </TouchableOpacity>
            <View className="ml-3">
              <Text className="text-[#FF6B00] font-medium text-sm">DELIVER TO</Text>
              <View className="flex-row items-center">
                <Text className="text-gray-700 font-medium">Halal Lab office</Text>
                <Entypo name="chevron-down" size={16} color="black" style={{ marginLeft: 4 }} />
              </View>
            </View>
          </View>
          <TouchableOpacity className="relative">
            <View className="bg-[#0D182E] rounded-full w-11 h-11 items-center justify-center">
              <Ionicons name="cart-outline" size={24} color="white" />
            </View>
            <View className="absolute top-0 right-0 bg-[#FF6B00] rounded-full w-5 h-5 items-center justify-center">
              <Text className="text-white text-xs font-bold">2</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Greeting */}
        <View className="px-4 mt-4 mb-3">
          <Text className="text-xl font-medium">Hey Halal, <Text className="font-bold">Good Afternoon!</Text></Text>
        </View>

        <View className="px-4">
          <Search />

          {/* Categories Section */}
          <View className="mt-0">
            <AllCategories />
          </View>
          
          {/* Open Restaurants Section */}
          <View className="mt-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl text-[#31343d] font-semibold">
                Open Restaurants
              </Text>
              <TouchableOpacity className="flex-row items-center">
                <Text className="text-base text-[#333333] mr-2">See All</Text>
                <Entypo name="chevron-right" size={16} color="#333333" />
              </TouchableOpacity>
            </View>
            <Restaurant />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    backgroundColor: "#fff",
  },
});
export default HomeScreen; 