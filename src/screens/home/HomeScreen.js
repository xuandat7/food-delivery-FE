import React from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search } from "../../components/home/Search";
import { Top } from "../../components/home/Top";
import { AllCategories } from "../../components/home/AllCategories";
import { HeyHalalGood } from "../../components/home/HeyHalalGood";
import { Restaurant } from "../../components/home/Restaurant";
import { RestaurantWrapper } from "../../components/home/RestaurantWrapper";

const HomeScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView className="flex-1">
        <View className="px-4">
          <Search />
          <Top />
          <HeyHalalGood />
          <AllCategories />
          
          <View className="mt-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl text-[#31343d] font-normal">
                Open Restaurants
              </Text>
              <View className="flex-row items-center">
                <Text className="text-base text-[#333333] mr-2">See All</Text>
                <Image 
                  source={require("../../../assets/icon.png")}
                  className="w-[7px] h-3"
                />
              </View>
            </View>
            <Restaurant />
            <RestaurantWrapper />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen; 