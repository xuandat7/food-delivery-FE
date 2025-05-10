import React, { useState, useEffect } from 'react';
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
import { getGoogleAuthRequest } from '../../services/googleAuth';

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
  
  // Google Auth Session
  const { request, response, promptAsync } = getGoogleAuthRequest();

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      if (id_token) {
        handleGoogleLogin(id_token);
      }
    }
  }, [response]);

  const handleGoogleLogin = async (idToken) => {
    try {
      const res = await api.auth.loginWithGoogle(idToken);
      if (res.success) {
        Alert.alert('Đăng nhập thành công', 'Bạn đã đăng nhập thành công với Google');
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      } else {
        throw new Error(res.message || 'Đăng nhập với Google thất bại');
      }
    } catch (error) {
      Alert.alert('Đăng nhập thất bại', error.message || 'Đã xảy ra lỗi khi đăng nhập với Google');
    }
  };

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
          // Store token in AsyncStorage
          if (response.data.access_token) {
            await AsyncStorage.setItem('token', response.data.access_token);
            console.log('Token stored in AsyncStorage:', response.data.access_token);
            
            // Store user info if available
            if (response.data.user) {
              await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
              console.log('User data stored in AsyncStorage');
            }
          } else {
            console.error('No access_token found in login response', response.data);
          }
          
          // Navigate to home screen
          console.log('Navigating to Home screen');
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
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

  const handleSocialLogin = async (platform) => {
    if (platform === 'Google') {
      // Thực hiện đăng nhập Google khi bấm vào icon
      try {
        console.log('Starting Google sign in flow...');
        
        // Gọi hàm đăng nhập với Google - sẽ hiển thị giao diện chọn tài khoản Google
        const googleResult = await signInWithGoogle();
        
        if (!googleResult.success) {
          throw new Error(googleResult.error || 'Không thể đăng nhập với Google');
        }
        
        console.log('Got Google ID token, sending to backend...');
        
        // Gửi ID token đến backend để xác thực
        const response = await api.auth.loginWithGoogle(googleResult.idToken);
        
        console.log('Backend login response:', response);
        
        if (response.success) {
          Alert.alert('Đăng nhập thành công', 'Bạn đã đăng nhập thành công với Google');
          
          // Chuyển hướng đến màn hình chính
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        } else {
          throw new Error(response.message || 'Đăng nhập với Google thất bại');
        }
      } catch (error) {
        console.error('Google sign in error:', error);
        Alert.alert('Đăng nhập thất bại', error.message || 'Đã xảy ra lỗi khi đăng nhập với Google');
      }
      return;
    }
    Alert.alert(`Đăng nhập ${platform}`, `Đăng nhập ${platform} sẽ được triển khai sớm`);
  };

  const handleGoogleLoginSuccess = (response) => {
    console.log('Google login successful:', response);
    Alert.alert('Đăng nhập thành công', 'Bạn đã đăng nhập thành công với Google');
  };
  
  const handleGoogleLoginError = (errorMessage) => {
    console.error('Google login error:', errorMessage);
    Alert.alert('Đăng nhập thất bại', errorMessage || 'Đã xảy ra lỗi khi đăng nhập với Google');
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
          
          {/* Or */}
          <Text style={[styles.orText, { color: theme.textSecondary }]}>Hoặc</Text>
          
          {/* Social login */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin('Facebook')}>
              <View style={[styles.socialIconBg, styles.fbBg]}>
                <Ionicons name="logo-facebook" size={24} color="white" />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.socialButton} onPress={() => promptAsync()} disabled={!request}>
              <View style={[styles.socialIconBg, styles.googleBg]}>
                <Ionicons name="logo-google" size={24} color="white" />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin('Apple')}>
              <View style={[styles.socialIconBg, styles.appleBg]}>
                <Ionicons name="logo-apple" size={24} color="white" />
              </View>
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
  orText: {
    textAlign: 'center',
    fontSize: SIZES.large,
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
  googleBg: {
    backgroundColor: '#DB4437', // Google red color
  },
  appleBg: {
    backgroundColor: COLORS.appleBlack,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  }
});

export default LoginScreen; 