import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { COLORS } from './constants/theme';

/**
 * Main App component that serves as the entry point for the application
 * @returns {JSX.Element} - Rendered component
 */
const App = () => {
  return (
    <>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={COLORS.loginBackground} 
      />
      <AppNavigator />
    </>
  );
};

export default App; 