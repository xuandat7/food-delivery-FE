import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AllType } from "../../components/home/AllType";
import { Search } from "../../components/home/Search";
import { Restaurant } from "../../components/home/Restaurant";
import { userAPI, cartAPI, AsyncStorage } from '../../services';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState(""); 
  const [greeting, setGreeting] = useState(""); 
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Kiểm tra token khi component được mount
    const checkTokenAndUserInfo = async () => {
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
          // Lấy tên người dùng
          await fetchUserInfo();
          
          // Xác định lời chào dựa vào thời gian
          const hour = new Date().getHours();
          if (hour < 12) {
            setGreeting("buổi sáng");
          } else if (hour < 18) {
            setGreeting("buổi chiều");
          } else {
            setGreeting("buổi tối");
          }
          
          // Token is valid, continue to Home
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking token:', error);
        setIsLoading(false);
      }
    };

    checkTokenAndUserInfo();
  }, []);

  // Fetch cart count
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const res = await cartAPI.getCart();
        if (res.success && res.data && Array.isArray(res.data.items)) {
          setCartCount(res.data.totalItems || 0);
        } else {
          setCartCount(0);
        }
      } catch (e) {
        setCartCount(0);
      }
    };
    fetchCartCount();
  }, []);

  // Fetch cart count mỗi khi HomeScreen được focus
  useFocusEffect(
    React.useCallback(() => {
      const fetchCartCount = async () => {
        try {
          const res = await cartAPI.getCart();
          if (res.success && res.data && Array.isArray(res.data.items)) {
            setCartCount(res.data.totalItems || 0);
          } else {
            setCartCount(0);
          }
        } catch (e) {
          setCartCount(0);
        }
      };
      fetchCartCount();
      // If resetCart param is set, refetch cart count
      if (navigation && navigation.getState) {
        const state = navigation.getState();
        const currentRoute = state.routes[state.index];
        if (currentRoute && currentRoute.params && currentRoute.params.resetCart) {
          fetchCartCount();
        }
      }
    }, [navigation])
  );

  // Hàm lấy thông tin người dùng
  const fetchUserInfo = async () => {
    try {
      // Đầu tiên kiểm tra xem có thông tin người dùng đã lưu trong AsyncStorage không
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        if (user.fullName || user.full_name) {
          setUserName(user.fullName || user.full_name);
          return;
        }
      }
      
      // Nếu không có thông tin trong AsyncStorage, gọi API để lấy
      const response = await userAPI.getProfile();
      console.log('User profile response:', response);
      
      if (response.success && response.data) {
        // Lưu thông tin người dùng vào AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(response.data));
        
        // Lấy tên từ các trường có thể có
        const name = response.data.fullName || response.data.full_name || response.data.name;
        if (name) {
          setUserName(name);
          
          // Lưu tên riêng để sử dụng sau này
          await AsyncStorage.setItem('userName', name);
        } else {
          setUserName("bạn");
        }
      } else {
        setUserName("bạn");
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      setUserName("bạn");
    }
  };

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
          </View>
          <TouchableOpacity className="relative" onPress={() => navigation.navigate('EditCart')}>
            <View className="bg-[#0D182E] rounded-full w-11 h-11 items-center justify-center">
              <Ionicons name="cart-outline" size={24} color="white" />
            </View>
            <View className="absolute top-0 right-0 bg-[#FF6B00] rounded-full w-5 h-5 items-center justify-center">
              <Text className="text-white text-xs font-bold">{cartCount}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Greeting */}
        <View className="px-4 mt-4 mb-3">
          <Text className="text-xl font-medium">Xin chào <Text className="font-bold">{userName}</Text>, {greeting}!</Text>
        </View>

        <View className="px-4">
          <Search />

          {/* Categories Section */}
          <View className="mt-0">
            <AllType />
          </View>
          
          {/* Open Restaurants Section */}
          <View className="mt-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text style={styles.sectionTitle}>
                Nhà hàng nổi bật
              </Text>
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#31343d',
    letterSpacing: 0.5,
  }
});
export default HomeScreen;