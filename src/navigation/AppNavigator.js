import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { AsyncStorage } from '../services/api';

// Import screens
import SplashScreen from '../screens/onboarding/SplashScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';

import AuthNavigator from '../screens/auth/AuthNavigator';

// Import main screens
import HomeScreen from '../screens/home/HomeScreen';
import ProfileScreen from '../screens/home/ProfileScreen';
import PersonalInfoScreen from '../screens/info/PersonalInfoScreen';

// Create stack navigators
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  // States for app initialization
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  
  useEffect(() => {
    // Initialize app - check authentication and first launch status
    const initialize = async () => {
      try {
        // Check if token exists
        const token = await AsyncStorage.getItem('token');
        console.log('Initial token check:', token);
        setUserToken(token);
        
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
      return 'Home';
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
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
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