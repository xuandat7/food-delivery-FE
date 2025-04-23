import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';

// Import screens
import SplashScreen from '../screens/onboarding/SplashScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import VerificationScreen from '../screens/auth/VerificationScreen';
import NewPasswordScreen from '../screens/auth/NewPasswordScreen';
import HomeScreen from '../screens/home/HomeScreen';

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isFromForgotPassword, setIsFromForgotPassword] = useState(false);

  useEffect(() => {
    // Simulate loading process
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowOnboarding(true);
    }, 2000); // Splash screen duration

    return () => clearTimeout(timer);
  }, []);

  // Handler for when onboarding is complete
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setShowLogin(true);
  };

  // Handler for when login is complete
  const handleLoginComplete = () => {
    setShowLogin(false);
  };

  // Handler for navigating to forgot password screen
  const handleNavigateToForgotPassword = () => {
    setShowForgotPassword(true);
  };

  // Handler for going back from forgot password screen
  const handleBackFromForgotPassword = () => {
    setShowForgotPassword(false);
  };

  // Handler for completing forgot password flow
  const handleForgotPasswordComplete = (email) => {
    setShowForgotPassword(false);
    // Store the email for verification 
    setUserEmail(email || 'example@gmail.com');
    // Show verification screen
    setShowVerification(true);
    // Mark that verification is coming from forgot password
    setIsFromForgotPassword(true);
  };

  // Handler for navigating to sign up screen
  const handleNavigateToSignUp = () => {
    setShowLogin(false);
    setShowSignUp(true);
  };

  // Handler for going back from sign up screen to login
  const handleBackFromSignUp = () => {
    setShowSignUp(false);
    setShowLogin(true);
  };

  // Handler for completing sign up flow - now goes to verification
  const handleSignUpComplete = (email) => {
    setShowSignUp(false);
    // Store the email for verification 
    setUserEmail(email || 'example@gmail.com');
    // Show verification screen
    setShowVerification(true);
    // Mark that verification is NOT coming from forgot password
    setIsFromForgotPassword(false);
  };

  // Handler for going back from verification
  const handleBackFromVerification = () => {
    setShowVerification(false);
    if (isFromForgotPassword) {
      setShowForgotPassword(true);
    } else {
      setShowSignUp(true);
    }
  };

  // Handler for completing verification flow
  const handleVerificationComplete = (fromForgotPassword) => {
    setShowVerification(false);
    if (fromForgotPassword) {
      // If from forgot password, go to new password screen
      setShowNewPassword(true);
    } else {
      // If from sign up, go to home screen
      // Navigate directly to home screen after successful verification
    }
  };

  // Handler for going back from new password screen
  const handleBackFromNewPassword = () => {
    setShowNewPassword(false);
    setShowForgotPassword(true);
  };

  // Handler for completing new password flow
  const handleNewPasswordComplete = () => {
    setShowNewPassword(false);
    setShowLogin(true);
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  if (showForgotPassword) {
    return (
      <ForgotPasswordScreen 
        onGoBack={handleBackFromForgotPassword}
        onComplete={handleForgotPasswordComplete}
      />
    );
  }

  if (showSignUp) {
    return (
      <SignUpScreen 
        onGoBack={handleBackFromSignUp}
        onComplete={handleSignUpComplete}
      />
    );
  }

  if (showVerification) {
    return (
      <VerificationScreen 
        onGoBack={handleBackFromVerification}
        onComplete={handleVerificationComplete}
        email={userEmail}
        fromForgotPassword={isFromForgotPassword}
      />
    );
  }

  if (showNewPassword) {
    return (
      <NewPasswordScreen 
        onGoBack={handleBackFromNewPassword}
        onComplete={handleNewPasswordComplete}
        email={userEmail}
      />
    );
  }

  if (showLogin) {
    return (
      <LoginScreen 
        onComplete={handleLoginComplete} 
        onForgotPassword={handleNavigateToForgotPassword}
        onSignUp={handleNavigateToSignUp}
      />
    );
  }

  return <HomeScreen />;
};

export default AppNavigator; 