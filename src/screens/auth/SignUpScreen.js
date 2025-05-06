import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { COLORS, RESTAURANT_COLORS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');

const SignUpScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isRestaurant = route.params?.isRestaurant || false;
  
  // Use the appropriate theme based on user type
  const theme = isRestaurant ? RESTAURANT_COLORS : COLORS;
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Error states
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  // Validation functions
  const validateName = (text) => {
    setName(text);
    
    if (!text.trim()) {
      setNameError(isRestaurant ? 'Tên nhà hàng là bắt buộc' : 'Tên là bắt buộc');
      return false;
    }
    setNameError('');
    return true;
  };
  
  const validateEmail = (text) => {
    setEmail(text);
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!text.trim()) {
      setEmailError('Email là bắt buộc');
      return false;
    } else if (!emailRegex.test(text)) {
      setEmailError('Vui lòng nhập địa chỉ email hợp lệ');
      return false;
    }
    setEmailError('');
    return true;
  };
  
  const validatePassword = (text) => {
    setPassword(text);
    
    if (!text.trim()) {
      setPasswordError('Mật khẩu là bắt buộc');
      return false;
    } else if (text.length < 6) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }
    
    // Also validate confirm password if it's already entered
    if (confirmPassword) {
      validateConfirmPassword(confirmPassword);
    }
    
    setPasswordError('');
    return true;
  };
  
  const validateConfirmPassword = (text) => {
    setConfirmPassword(text);
    
    if (!text.trim()) {
      setConfirmPasswordError('Vui lòng xác nhận mật khẩu của bạn');
      return false;
    } else if (text !== password) {
      setConfirmPasswordError('Mật khẩu không khớp');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleSignUp = () => {
    // Validate all fields
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    
    if (isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
      // In a real app, you would register the user/restaurant with your backend
      console.log('Sign up pressed with:', { name, email, password, isRestaurant });
      
      // Show success message
      Alert.alert(
        "Đăng Ký Thành Công",
        isRestaurant
          ? "Tài khoản nhà hàng của bạn đã được tạo thành công."
          : "Tài khoản của bạn đã được tạo thành công.",
        [
          { 
            text: 'OK', 
            onPress: () => {
              // Navigate to verification screen
              navigation.navigate('Verification', { email, isRestaurant });
            } 
          }
        ]
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Background color extends full screen */}
      <View style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: theme.loginBackground 
      }} />
      
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
        >
          {/* Content container */}
          <View style={{ flex: 1 }}>
            {/* Background elements */}
            <View style={styles.backgroundContainer}>
              <View style={[styles.circle, {borderColor: theme.loginDarkElements}]} />
              <View style={[styles.rightLine, {borderColor: theme.loginDarkElements}]} />
            </View>
            
            {/* Back button */}
            <TouchableOpacity 
              style={[styles.backButton, {backgroundColor: theme.background}]} 
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} color={theme.loginBackground} />
            </TouchableOpacity>
            
            {/* Top section */}
            <View style={styles.topSection}>
              <Text style={[styles.title, {color: theme.background}]}>
                {isRestaurant ? 'Đăng Ký Nhà Hàng' : 'Đăng Ký'}
              </Text>
              <Text style={styles.subtitle}>
                {isRestaurant ? 'Tạo tài khoản nhà hàng' : 'Vui lòng đăng ký để bắt đầu'}
              </Text>
            </View>
            
            {/* White background container that extends to bottom of screen */}
            <View style={[
              styles.whiteContainer, 
              { 
                backgroundColor: theme.background,
                minHeight: height - 240, // Adjust based on top section height
              }
            ]}>
              <ScrollView 
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 80 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {/* Name input */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, {color: theme.text}]}>
                    {isRestaurant ? 'TÊN NHÀ HÀNG' : 'HỌ TÊN'}
                  </Text>
                  <View style={[styles.inputContainer, {
                    backgroundColor: theme.inputBackground, 
                    borderColor: nameError ? 'red' : theme.inputBorder
                  }]}>
                    <TextInput
                      style={[styles.input, {color: theme.text, letterSpacing: name ? 0 : -0.5}]}
                      placeholder={isRestaurant ? "Tên nhà hàng" : "Nguyễn Văn A"}
                      placeholderTextColor={theme.placeholderText}
                      value={name}
                      onChangeText={validateName}
                    />
                  </View>
                  {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
                </View>
                
                {/* Email input */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, {color: theme.text}]}>EMAIL</Text>
                  <View style={[styles.inputContainer, {
                    backgroundColor: theme.inputBackground, 
                    borderColor: emailError ? 'red' : theme.inputBorder
                  }]}>
                    <TextInput
                      style={[styles.input, {color: theme.text, letterSpacing: email ? 0 : -0.5}]}
                      placeholder="example@gmail.com"
                      placeholderTextColor={theme.placeholderText}
                      keyboardType="email-address"
                      value={email}
                      onChangeText={validateEmail}
                      autoCapitalize="none"
                    />
                  </View>
                  {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                </View>
                
                {/* Password input */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, {color: theme.text}]}>MẬT KHẨU</Text>
                  <View style={[styles.inputContainer, {
                    backgroundColor: theme.inputBackground, 
                    borderColor: passwordError ? 'red' : theme.inputBorder
                  }]}>
                    <TextInput
                      style={[styles.inputSecure, {color: theme.text, letterSpacing: password ? 0 : -0.5}]}
                      placeholder="**********"
                      placeholderTextColor={theme.placeholderText}
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={validatePassword}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={22}
                        color={theme.placeholderText}
                      />
                    </TouchableOpacity>
                  </View>
                  {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                </View>
                
                {/* Confirm Password input */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, {color: theme.text}]}>NHẬP LẠI MẬT KHẨU</Text>
                  <View style={[styles.inputContainer, {
                    backgroundColor: theme.inputBackground, 
                    borderColor: confirmPasswordError ? 'red' : theme.inputBorder
                  }]}>
                    <TextInput
                      style={[styles.inputSecure, {color: theme.text, letterSpacing: confirmPassword ? 0 : -0.5}]}
                      placeholder="**********"
                      placeholderTextColor={theme.placeholderText}
                      secureTextEntry={!showConfirmPassword}
                      value={confirmPassword}
                      onChangeText={validateConfirmPassword}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <Ionicons
                        name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={22}
                        color={theme.placeholderText}
                      />
                    </TouchableOpacity>
                  </View>
                  {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
                </View>
                
                {/* Sign Up button */}
                <TouchableOpacity 
                  style={[styles.signUpButton, {backgroundColor: theme.primaryButton}]} 
                  onPress={handleSignUp}
                >
                  <Text style={[styles.signUpButtonText, {color: theme.background}]}>ĐĂNG KÝ</Text>
                </TouchableOpacity>
                
                {/* Already have account */}
                <View style={styles.haveAccountContainer}>
                  <Text style={[styles.haveAccountText, {color: theme.textSecondary}]}>
                    Đã có tài khoản?
                  </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Login', { isRestaurant })}>
                    <Text style={[styles.loginText, {color: theme.primaryButton}]}>ĐĂNG NHẬP</Text>
                  </TouchableOpacity>
                </View>
                
                {/* Switch user type option */}
                <TouchableOpacity 
                  style={styles.switchUserType} 
                  onPress={() => navigation.navigate('SignUp', { isRestaurant: !isRestaurant })}
                >
                  <Text style={[styles.switchText, {color: theme.primaryButton}]}>
                    {isRestaurant 
                      ? 'Đăng ký với tư cách Khách hàng' 
                      : 'Đăng ký với tư cách Nhà hàng'}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    position: 'absolute',
    width: '100%',
    height: 450,
    zIndex: 0,
  },
  circle: {
    width: 271,
    height: 271,
    borderRadius: 135.5,
    borderWidth: 5,
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
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 24,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  topSection: {
    marginTop: 120,
    marginBottom: 20,
    paddingHorizontal: SIZES.padding,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: SIZES.large,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 26,
  },
  whiteContainer: {
    borderTopLeftRadius: SIZES.cardBorderRadius,
    borderTopRightRadius: SIZES.cardBorderRadius,
    paddingHorizontal: 24,
    paddingTop: 30,
    flex: 1,
    zIndex: 2,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: SIZES.small,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: SIZES.buttonRadius,
    height: SIZES.inputHeight,
    justifyContent: 'center',
    paddingRight: 50,
  },
  input: {
    paddingHorizontal: 20,
    fontSize: SIZES.medium,
    height: '100%',
  },
  inputSecure: {
    paddingHorizontal: 20,
    fontSize: SIZES.medium,
    height: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  signUpButton: {
    borderRadius: SIZES.buttonRadius,
    height: SIZES.inputHeight,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  signUpButtonText: {
    fontSize: SIZES.medium,
    fontWeight: '700',
  },
  haveAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  haveAccountText: {
    fontSize: SIZES.small,
  },
  loginText: {
    fontSize: SIZES.medium,
    fontWeight: '700',
    marginLeft: 10,
  },
  switchUserType: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  switchText: {
    fontSize: SIZES.medium,
    fontWeight: '700',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  }
});

export default SignUpScreen; 