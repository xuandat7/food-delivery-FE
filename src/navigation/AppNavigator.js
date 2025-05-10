import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import SplashScreen from '../screens/onboarding/SplashScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';

// Import auth screens directly
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import VerificationScreen from '../screens/auth/VerificationScreen';
import NewPasswordScreen from '../screens/auth/NewPasswordScreen';
import AuthNavigator from '../screens/auth/AuthNavigator';

// Import main screens
import HomeScreen from '../screens/home/HomeScreen';
import SearchScreen from '../screens/home/SearchScreen';
import RestaurantViewScreen from '../screens/home/RestaurantViewScreen';
import FilterScreen from '../screens/home/FilterScreen';
import FoodSearchScreen from '../screens/home/FoodSearchScreen';
import FoodDetailsScreen from '../screens/home/FoodDetailsScreen';

// Create stack navigators
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  // States for splash screen
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading process
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Splash screen duration

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="RestaurantView" component={RestaurantViewScreen} />
        <Stack.Screen name="FoodSearch" component={FoodSearchScreen} />
        <Stack.Screen name="FoodDetails" component={FoodDetailsScreen} />
        <Stack.Screen name="Filter" component={FilterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;