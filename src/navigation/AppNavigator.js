import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { AsyncStorage } from '../services';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

// Import screens
import SplashScreen from '../screens/onboarding/SplashScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';

import AuthNavigator from '../screens/auth/AuthNavigator';

// Import main screens
import HomeScreen from '../screens/home/HomeScreen';
// import ProfileScreen from '../screens/home/ProfileScreen'; // This file doesn't exist
import PersonalInfoScreen from '../screens/info/PersonalInfoScreen';
import EditProfileScreen from '../screens/info/EditProfileScreen';
import MenuScreen from '../screens/home/MenuScreen';
import MyOrdersScreen from '../screens/order/MyOrdersScreen.js';

// Import screens from nhánh Linh
import SearchScreen from '../screens/home/SearchScreen';
import RestaurantViewScreen from '../screens/home/RestaurantViewScreen';
import FoodSearchScreen from '../screens/home/FoodSearchScreen';
import FoodDetailsScreen from '../screens/food/FoodDetailsScreen';

// Import category screens
import AllTypeRestaurantScreen from '../screens/home/AllTypeRestaurantScreen';
// import CategoryDetailScreen from '../screens/home/CategoryDetailScreen';

// Import restaurant screens
import SellerDashboard from '../screens/restaurant/SellerDashboard';
import MyFoodScreen from '../screens/restaurant/MyFoodScreen';
import AddNewFoodScreen from '../screens/food/AddNewFoodScreen';
import EditFoodScreen from '../screens/food/EditFoodScreen';
import NotificationScreen from '../screens/restaurant/NotificationScreen';
import ChefProfileScreen from '../screens/restaurant/ProfileScreen';
import RestaurantInfoScreen from '../screens/restaurant/RestaurantInfoScreen';
import EditRestaurantScreen from '../screens/restaurant/EditRestaurantScreen';
import PendingOrdersScreen from '../screens/restaurant/PendingOrdersScreen';

import EditCart from '../components/cart/EditCart.js'; // Đảm bảo bạn có file EditCart.js đúng chuẩn React Native hoặc React
import PaymentMethodScreen from '../components/payment/PaymentMethodScreen.js';
import PaymentSuccessScreen from '../components/payment/PaymentSuccessScreen';

// Import Type Restaurants Screen
import TypeRestaurantsScreen from '../screens/home/TypeRestaurantsScreen';

import OrderDetailScreen from '../screens/order/OrderDetailScreen';

// Create stack navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  // States for app initialization
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [userType, setUserType] = useState(null);
  
  useEffect(() => {
    // Initialize app - check authentication and first launch status
    const initialize = async () => {
      try {
        // Check if token exists
        const token = await AsyncStorage.getItem('token');
        console.log('Initial token check:', token);
        setUserToken(token);
        
        // Nếu không có token, xóa firstLaunch để hiển thị onboarding
        if (!token) {
          await AsyncStorage.removeItem('firstLaunch');
          console.log('Không có token, xóa firstLaunch để hiển thị onboarding');
        }
        
        // Check user type
        const type = await AsyncStorage.getItem('userType');
        setUserType(type);
        console.log('User type from storage:', type);
        
        // Check if first launch
        const firstLaunch = await AsyncStorage.getItem('firstLaunch');
        console.log('First launch value from storage:', firstLaunch);
        
        if (firstLaunch !== null) {
          console.log('Not first launch, setting isFirstLaunch to false');
          setIsFirstLaunch(false);
        } else {
          console.log('First launch detected, will show onboarding');
          // Để giá trị firstLaunch trong storage là null để hiển thị onboarding
          // và chỉ lưu giá trị này sau khi người dùng hoàn thành onboarding
          setIsFirstLaunch(true);
        }
      } catch (e) {
        console.log('Initialization error:', e);
      } finally {
        // Delay to show splash screen
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    };

    initialize();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }
  
  const getInitialRouteName = () => {
    console.log('Getting initial route. isFirstLaunch:', isFirstLaunch, 'userToken:', userToken, 'userType:', userType);
    
    // Nếu có token, luôn đi thẳng vào màn hình chính, bỏ qua onboarding
    if (userToken) {
      console.log('Token found, going to main screen');
      return userType === 'restaurant' ? 'RestaurantTabs' : 'Home';
    } else if (isFirstLaunch) {
      console.log('Showing Onboarding screen');
      return 'Onboarding';
    } else {
      console.log('No token found, showing Auth screen');
      return 'Auth';
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={getInitialRouteName()}
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Auth" component={AuthNavigator} />
        
        {/* Screens từ nhánh Linh */}
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="RestaurantView" component={RestaurantViewScreen} />
        <Stack.Screen name="FoodSearch" component={FoodSearchScreen} />
        <Stack.Screen name="FoodDetails" component={FoodDetailsScreen} />
        <Stack.Screen name="TypeRestaurants" component={TypeRestaurantsScreen} />
        
        {/* Category screens */}
        <Stack.Screen name="AllTypeRestaurant" component={AllTypeRestaurantScreen} />

        
        {/* Customer screens */}
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
        <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="MyOrdersScreen" component={MyOrdersScreen} />
        <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ headerShown: false }} />
        
        {/* Restaurant screens */}
        <Stack.Screen name="RestaurantTabs" component={RestaurantTabNavigator} />
        <Stack.Screen name="AddNewItems" component={AddNewFoodScreen} options={{ headerShown: false }} />
        <Stack.Screen 
          name="EditFoodScreen" 
          component={EditFoodScreen}
          options={{
            headerShown: false,
            presentation: 'card'
          }}
        />
        <Stack.Screen name="EditCart" component={EditCart} />
        <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
        <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
        <Stack.Screen name="RestaurantInfo" component={RestaurantInfoScreen} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen name="EditRestaurantScreen" component={EditRestaurantScreen} />
        <Stack.Screen name="PendingOrdersScreen" component={PendingOrdersScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Restaurant Tab Navigator
const RestaurantTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 85,
          paddingTop: 15,
          paddingBottom: 15,
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 10,
          position: 'absolute',
        },
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: '#616167',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 5,
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={SellerDashboard}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
          ),
          tabBarLabel: 'Home',
        }}
      />
      
      <Tab.Screen 
        name="MyFood" 
        component={MyFoodScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? 'food' : 'food-outline'} size={22} color={color} />
          ),
          tabBarLabel: 'Menu',
        }}
      />
      
      <Tab.Screen 
        name="AddTab" 
        component={EmptyScreen}
        options={{
          tabBarIcon: ({ color }) => {
            const navigation = useNavigation();
            return (
              <TouchableOpacity
                onPress={() => navigation.navigate('AddNewItems')}
              >
                <View style={{
                  width: 48,
                  height: 48,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#E6F7FF',
                  borderWidth: 1.5,
                  borderColor: '#3498db',
                  borderRadius: 24, 
                  marginBottom: 5,
                  position: 'relative',
                  top: -15,
                }}>
                  <Ionicons name="add" size={26} color="#3498db" />
                </View>
              </TouchableOpacity>
            );
          },
          tabBarLabel: ({ color }) => (
            <Text style={{ 
              color: color, 
              fontSize: 12, 
              marginTop: -8 
            }}>
              Thêm
            </Text>
          ),
        }}
      />
      
      <Tab.Screen 
        name="Đơn hàng" 
        component={PendingOrdersScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'notifications' : 'notifications-outline'} size={22} color={color} />
          ),
          tabBarLabel: 'Đơn hàng',
        }}
      />
      
      <Tab.Screen 
        name="Profile" 
        component={ChefProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={color} />
          ),
          tabBarLabel: 'Cá nhân',
        }}
      />
    </Tab.Navigator>
  );
};

// Empty screen for the Add tab (will be replaced with navigation)
const EmptyScreen = () => {
  const navigation = useNavigation();
  
  React.useEffect(() => {
    const openAddScreen = () => {
      navigation.navigate('AddNewItems');
    };
    
    // We use a timeout to avoid navigation during render
    const timer = setTimeout(openAddScreen, 0);
    return () => clearTimeout(timer);
  }, [navigation]);
  
  return <View />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;