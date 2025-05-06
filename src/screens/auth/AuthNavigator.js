import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import Auth Screens
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import VerificationScreen from './VerificationScreen';
import NewPasswordScreen from './NewPasswordScreen';

const AuthStack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <AuthStack.Screen name="Verification" component={VerificationScreen} />
      <AuthStack.Screen name="NewPassword" component={NewPasswordScreen} />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator; 