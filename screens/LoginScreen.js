import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { COLORS, SIZES } from './styles';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ onComplete, onForgotPassword, onSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = () => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLogin = () => {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (isEmailValid && isPasswordValid) {
      // Perform login operation
      onComplete();
    }
  };
  
  const handleForgotPassword = () => {
    // Navigate to forgot password screen
    if (onForgotPassword) {
      onForgotPassword();
    }
  };

  const handleSocialLogin = (platform) => {
    Alert.alert(`${platform} Login`, `${platform} login will be implemented soon`);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Background elements */}
        <View style={styles.backgroundContainer}>
          <View style={styles.circle} />
          <View style={styles.rightLine} />
        </View>
        
        {/* Top section */}
        <View style={styles.topSection}>
          <Text style={styles.title}>Log In</Text>
          <Text style={styles.subtitle}>Please sign in to your existing account</Text>
        </View>
        
        {/* White background container */}
        <View style={styles.whiteContainer}>
          {/* Email input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>EMAIL</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="example@gmail.com"
                placeholderTextColor={COLORS.placeholderText}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                onBlur={validateEmail}
              />
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>
          </View>
          
          {/* Password input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>PASSWORD</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="**********"
                placeholderTextColor={COLORS.placeholderText}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                onBlur={validatePassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color={COLORS.placeholderText}
                />
              </TouchableOpacity>
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>
          </View>
          
          {/* Remember me and Forgot password */}
          <View style={styles.rememberForgotContainer}>
            <TouchableOpacity
              style={styles.rememberContainer}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={styles.checkbox}>
                {rememberMe && <View style={styles.checkboxInner} />}
              </View>
              <Text style={styles.rememberText}>Remember me</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotText}>Forgot Password</Text>
            </TouchableOpacity>
          </View>
          
          {/* Login button */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>LOG IN</Text>
          </TouchableOpacity>
          
          {/* Don't have account */}
          <View style={styles.noAccountContainer}>
            <Text style={styles.noAccountText}>Don't have an account?</Text>
            <TouchableOpacity onPress={onSignUp}>
              <Text style={styles.signUpText}>SIGN UP</Text>
            </TouchableOpacity>
          </View>
          
          {/* Or */}
          <Text style={styles.orText}>Or</Text>
          
          {/* Social login */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin('Facebook')}>
              <View style={[styles.socialIconBg, styles.fbBg]}>
                <Ionicons name="logo-facebook" size={24} color="white" />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin('Twitter')}>
              <View style={[styles.socialIconBg, styles.twitterBg]}>
                <Ionicons name="logo-twitter" size={24} color="white" />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin('Apple')}>
              <View style={[styles.socialIconBg, styles.appleBg]}>
                <Ionicons name="logo-apple" size={24} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.loginBackground,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  backgroundContainer: {
    position: 'absolute',
    width: '100%',
    height: 450,
  },
  circle: {
    width: 271,
    height: 271,
    borderRadius: 135.5,
    borderWidth: 5,
    borderColor: COLORS.loginDarkElements,
    borderStyle: 'dashed',
    position: 'absolute',
    top: -47,
    left: -47,
  },
  rightLine: {
    position: 'absolute',
    right: 0,
    top: 94,
    width: 89,
    height: 356,
    backgroundColor: 'transparent',
    borderLeftWidth: 1,
    borderColor: COLORS.loginDarkElements,
  },
  topSection: {
    marginTop: 120,
    marginBottom: 40,
    paddingHorizontal: SIZES.padding,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.background,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: SIZES.large,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 26,
  },
  whiteContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 50,
    flex: 1,
    minHeight: 580,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: SIZES.small,
    color: COLORS.text,
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: SIZES.buttonRadius,
    height: SIZES.inputHeight,
    justifyContent: 'center',
    backgroundColor: COLORS.inputBackground,
  },
  input: {
    paddingHorizontal: 19,
    fontSize: SIZES.medium,
    color: COLORS.text,
    height: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: 19,
    top: 19,
  },
  rememberForgotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: COLORS.checkboxBorder,
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: COLORS.primaryButton,
    borderRadius: 2,
  },
  rememberText: {
    fontSize: SIZES.small,
    color: COLORS.rememberMeText,
  },
  forgotText: {
    fontSize: SIZES.medium,
    color: COLORS.primaryButton,
  },
  loginButton: {
    backgroundColor: COLORS.primaryButton,
    borderRadius: SIZES.buttonRadius,
    height: SIZES.inputHeight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  loginButtonText: {
    color: COLORS.background,
    fontSize: SIZES.medium,
    fontWeight: '700',
  },
  noAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  noAccountText: {
    fontSize: SIZES.large,
    color: COLORS.textSecondary,
    marginRight: 5,
  },
  signUpText: {
    fontSize: SIZES.medium,
    fontWeight: '700',
    color: COLORS.primaryButton,
  },
  orText: {
    textAlign: 'center',
    fontSize: SIZES.large,
    color: COLORS.textSecondary,
    marginBottom: 15,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  socialButton: {
    marginHorizontal: 15,
  },
  socialIconBg: {
    width: 62,
    height: 62,
    borderRadius: 31,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fbBg: {
    backgroundColor: COLORS.facebookBlue,
  },
  twitterBg: {
    backgroundColor: COLORS.twitterBlue,
  },
  appleBg: {
    backgroundColor: COLORS.appleBlack,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
});

export default LoginScreen; 