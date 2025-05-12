import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { AsyncStorage } from '../services/api';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Import screens
import SplashScreen from '../screens/onboarding/SplashScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';

import AuthNavigator from '../screens/auth/AuthNavigator';

// Import main screens
import HomeScreen from '../screens/home/HomeScreen';
import ProfileScreen from '../screens/home/ProfileScreen';
import PersonalInfoScreen from '../screens/info/PersonalInfoScreen';
import MenuScreen from '../screens/home/MenuScreen';

// Import restaurant screens
import SellerDashboard from '../screens/chef/SellerDashboard';
import MyFoodScreen from '../screens/chef/MyFoodScreen';
import AddNewItemsScreen from '../screens/chef/AddNewItemsScreen';
import NotificationScreen from '../screens/chef/NotificationScreen';
import ChefProfileScreen from '../screens/chef/ProfileScreen';

import EditCart from '../components/cart/EditCart.js'; // Đảm bảo bạn có file EditCart.js đúng chuẩn React Native hoặc React

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
        
        // Check user type
        const type = await AsyncStorage.getItem('userType');
        setUserType(type);
        console.log('User type from storage:', type);
        
        // Check if first launch
        const firstLaunch = await AsyncStorage.getItem('firstLaunch');
        if (firstLaunch !== null) {
          setIsFirstLaunch(false);
        } else {
          await AsyncStorage.setItem('firstLaunch', 'false');
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
    if (isFirstLaunch) {
      return 'Onboarding';
    } else if (userToken) {
      // Trả về trang phù hợp với loại người dùng
      console.log('Determining initial route based on user type:', userType);
      return userType === 'restaurant' ? 'RestaurantTabs' : 'Home';
    } else {
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
        
        {/* Customer screens */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        
        {/* Restaurant screens */}
        <Stack.Screen name="RestaurantTabs" component={RestaurantTabNavigator} />
        <Stack.Screen name="EditCart" component={EditCart} />
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
        tabBarActiveTintColor: '#FB6D3A',
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
        name="AddNewItems" 
        component={AddNewItemsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={{
              width: 48,
              height: 48,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#FFF1F1',
              borderWidth: 1.5,
              borderColor: '#FF7621',
              borderRadius: 24, 
              marginBottom: 5,
              position: 'relative',
              top: -15,
            }}>
              <Ionicons name="add" size={26} color="#FF7621" />
            </View>
          ),
          tabBarLabel: ({ color }) => (
            <Text style={{ 
              color: color, 
              fontSize: 12, 
              marginTop: -8 
            }}>
              Add
            </Text>
          ),
        }}
      />
      
      <Tab.Screen 
        name="Notifications" 
        component={NotificationScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'notifications' : 'notifications-outline'} size={22} color={color} />
          ),
          tabBarLabel: 'Alert',
        }}
      />
      
      <Tab.Screen 
        name="Profile" 
        component={ChefProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={color} />
          ),
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;