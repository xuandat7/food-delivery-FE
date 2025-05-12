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
import { COLORS, RESTAURANT_COLORS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../../services/api';
import { AsyncStorage } from '../../services/api';

const LoginScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isRestaurant = route.params?.isRestaurant || false;
  
  // Use the appropriate theme based on user type
  const theme = isRestaurant ? RESTAURANT_COLORS : COLORS;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (text) => {
    setEmail(text);
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!text.trim()) {
      setEmailError('Email là bắt buộc');
      return false;
    } else if (!emailRegex.test(text)) {
      setEmailError('Định dạng email không hợp lệ');
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
    }
    setPasswordError('');
    return true;
  };

  const handleLogin = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (isEmailValid && isPasswordValid) {
      try {
        // Show loading indicator or disable button here
        
        console.log('Attempting login with:', { email, password, isRestaurant });
        
        // Call login API
        const response = await api.auth.login(email, password, isRestaurant);
        
        console.log('Login response:', response);
        
        if (response.success) {
          // Lấy token từ nhiều trường khác nhau
          const token = response.data.access_token || response.data.token || response.data.jwt;
          if (token) {
            await AsyncStorage.setItem('token', token);
            console.log('Token stored in AsyncStorage:', token);
            
            // Store user info if available
            if (response.data.user) {
              await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
              console.log('User data stored in AsyncStorage');
            }
            
            // Store user type for future reference
            await AsyncStorage.setItem('userType', isRestaurant ? 'restaurant' : 'customer');
            console.log('User type stored:', isRestaurant ? 'restaurant' : 'customer');
          } else {
            console.error('Không tìm thấy token trong phản hồi đăng nhập', response.data);
            Alert.alert('Lỗi', 'Không tìm thấy token trong phản hồi đăng nhập. Vui lòng thử lại hoặc liên hệ hỗ trợ.');
            return;
          }
          
          // Navigate to appropriate screen based on user type
          if (isRestaurant) {
            console.log('Navigating to restaurant dashboard...');
            navigation.reset({
              index: 0,
              routes: [{ name: 'SellerDashboard' }],
            });
          } else {
            console.log('Navigating to customer home...');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
          }
        } else {
          // Show error message
          console.error('Login failed:', response.message);
          Alert.alert('Đăng nhập thất bại', response.message || 'Vui lòng kiểm tra lại email và mật khẩu');
        }
      } catch (error) {
        console.error('Login error:', error);
        Alert.alert('Lỗi', error.message || 'Đã xảy ra lỗi khi đăng nhập');
      }
    }
  };
  
  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword', { isRestaurant });
  };

  const handleSwitchUserType = () => {
    navigation.navigate('Login', { isRestaurant: !isRestaurant });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.loginBackground }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Background elements */}
        <View style={styles.backgroundContainer}>
          <View style={[styles.circle, { borderColor: theme.loginDarkElements }]} />
          <View style={[styles.rightLine, { borderColor: theme.loginDarkElements }]} />
        </View>
        
        {/* Top section */}
        <View style={styles.topSection}>
          <Text style={[styles.title, { color: theme.background }]}>
            {isRestaurant ? 'Đăng Nhập Nhà Hàng' : 'Đăng Nhập'}
          </Text>
          <Text style={styles.subtitle}>
            {isRestaurant 
              ? 'Vui lòng đăng nhập vào tài khoản nhà hàng của bạn' 
              : 'Vui lòng đăng nhập vào tài khoản của bạn'}
          </Text>
        </View>
        
        {/* White background container */}
        <View style={[styles.whiteContainer, { backgroundColor: theme.background }]}>
          {/* Email input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>EMAIL</Text>
            <View style={[styles.inputContainer, { 
              borderColor: emailError ? 'red' : theme.inputBorder,
              backgroundColor: theme.inputBackground
            }]}>
              <TextInput
                style={[styles.input, { color: theme.text, letterSpacing: email ? 0 : -0.5 }]}
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
            <Text style={[styles.inputLabel, { color: theme.text }]}>MẬT KHẨU</Text>
            <View style={[styles.inputContainer, {
              borderColor: passwordError ? 'red' : theme.inputBorder,
              backgroundColor: theme.inputBackground
            }]}>
              <TextInput
                style={[styles.input, { color: theme.text, letterSpacing: password ? 0 : -0.5 }]}
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
          
          {/* Remember me and Forgot password */}
          <View style={styles.rememberForgotContainer}>
            <TouchableOpacity
              style={styles.rememberContainer}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={[styles.checkbox, { borderColor: theme.checkboxBorder }]}>
                {rememberMe && <View style={[styles.checkboxInner, { backgroundColor: theme.primaryButton }]} />}
              </View>
              <Text style={[styles.rememberText, { color: theme.rememberMeText }]}>Ghi nhớ đăng nhập</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={[styles.forgotText, { color: theme.primaryButton }]}>Quên Mật Khẩu</Text>
            </TouchableOpacity>
          </View>
          
          {/* Login button */}
          <TouchableOpacity 
            style={[styles.loginButton, { backgroundColor: theme.primaryButton }]} 
            onPress={handleLogin}
          >
            <Text style={[styles.loginButtonText, { color: theme.background }]}>ĐĂNG NHẬP</Text>
          </TouchableOpacity>
          
          {/* Don't have account */}
          <View style={styles.noAccountContainer}>
            <Text style={[styles.noAccountText, { color: theme.textSecondary }]}>Chưa có tài khoản?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp', { isRestaurant })}>
              <Text style={[styles.signUpText, { color: theme.primaryButton }]}>ĐĂNG KÝ</Text>
            </TouchableOpacity>
          </View>
          
          {/* Switch to other user type */}
          <TouchableOpacity 
            style={styles.switchUserType} 
            onPress={handleSwitchUserType}
          >
            <Text style={[styles.switchText, { color: theme.primaryButton }]}>
              {isRestaurant 
                ? 'Đăng nhập với tư cách Khách hàng' 
                : 'Đăng nhập với tư cách Nhà hàng'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: SIZES.large,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 26,
  },
  whiteContainer: {
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
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: SIZES.buttonRadius,
    height: SIZES.inputHeight,
    justifyContent: 'center',
  },
  input: {
    paddingHorizontal: 20,
    fontSize: SIZES.medium,
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
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  rememberText: {
    fontSize: SIZES.small,
  },
  forgotText: {
    fontSize: SIZES.medium,
  },
  loginButton: {
    borderRadius: SIZES.buttonRadius,
    height: SIZES.inputHeight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    fontSize: SIZES.medium,
    fontWeight: '700',
  },
  switchUserType: {
    alignItems: 'center',
    marginTop: 20,
  },
  switchText: {
    fontSize: SIZES.medium,
    fontWeight: '500',
  },
  noAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  noAccountText: {
    fontSize: SIZES.large,
    marginRight: 5,
  },
  signUpText: {
    fontSize: SIZES.medium,
    fontWeight: '700',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  }
});

export default LoginScreen;