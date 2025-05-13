import React, { useState, useRef, useEffect } from 'react';
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
  SafeAreaView,
  Keyboard,
  UIManager,
  findNodeHandle
} from 'react-native';
import { COLORS, RESTAURANT_COLORS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { authAPI } from '../../services';

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
  
  // Keyboard states
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  
  // Input refs
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const scrollViewRef = useRef(null);
  
  // Keyboard listeners to adjust scroll
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
      (e) => {
        setKeyboardVisible(true);
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      () => {
        setKeyboardVisible(false);
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  
  // Handle focused input to ensure it's visible
  const handleInputFocus = (fieldRef) => {
    if (!fieldRef?.current) return;
    
    // Đảm bảo mã này chỉ chạy sau khi component đã render
    setTimeout(() => {
      const nodeHandle = findNodeHandle(fieldRef.current);
      if (!nodeHandle) return;
      
      // Tính toán vị trí của ô nhập
      UIManager.measure(nodeHandle, (x, y, width, height, pageX, pageY) => {
        // Tính toán vị trí của đáy ô nhập
        const inputBottom = pageY + height;
        
        // Tính toán vị trí đỉnh của bàn phím
        const screenHeight = Dimensions.get('window').height;
        const keyboardTop = screenHeight - keyboardHeight;
        
        // Thêm khoảng cách để dễ nhìn
        const paddingForVisibility = 20;
        
        // Chỉ cuộn nếu ô nhập bị che bởi bàn phím
        if (inputBottom + paddingForVisibility > keyboardTop) {
          // Tính toán vị trí cần cuộn để hiển thị ô đang nhập
          // Cuộn chính xác đến vị trí của ô nhập liệu, không phải cuộn phần còn thiếu
          scrollViewRef.current?.scrollTo({ 
            y: pageY - 100, // Cuộn ô nhập lên vị trí cách đỉnh màn hình 100px
            animated: true 
          });
        }
      });
    }, 100);
  };
  
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
    } else if (text.length < 8) {
      setPasswordError('Mật khẩu phải có ít nhất 8 ký tự');
      return false;
    } else if (!/[A-Z]/.test(text)) {
      setPasswordError('Mật khẩu phải chứa ít nhất một chữ cái viết hoa');
      return false;
    } else if (!/[a-z]/.test(text)) {
      setPasswordError('Mật khẩu phải chứa ít nhất một chữ cái viết thường');
      return false;
    } else if (!/[0-9]/.test(text)) {
      setPasswordError('Mật khẩu phải chứa ít nhất một chữ số');
      return false;
    } else if (!/[!@#$%^&*]/.test(text)) {
      setPasswordError('Mật khẩu phải chứa ít nhất một ký tự đặc biệt (!@#$%^&*)');
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

  const handleSignUp = async () => {
    // Validate all fields
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    
    if (isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
      try {
        // Create user data object
        const userData = {
          name: name,
          email: email,
          password: password,
          // Add other fields if needed by your API
        };
        
        console.log('Attempting registration with:', userData);
        
        // Call the registration API
        const response = await authAPI.register(userData, isRestaurant);
        
        console.log('Registration response:', response);
        
        if (response.success) {
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
                  // Navigate to login screen after successful registration
                  navigation.navigate('Login', { isRestaurant });
                } 
              }
            ]
          );
        } else {
          // Show error message
          Alert.alert("Đăng Ký Thất Bại", response.message || "Không thể đăng ký tài khoản, vui lòng thử lại sau.");
        }
      } catch (error) {
        Alert.alert("Lỗi", error.message || "Đã xảy ra lỗi khi đăng ký tài khoản");
      }
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
          enabled={Platform.OS === 'ios'}
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
            <View style={[styles.topSection, keyboardVisible && styles.topSectionSmaller]}>
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
                minHeight: height - 180, // Adjust based on reduced top section height
              }
            ]}>
              <ScrollView 
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: keyboardVisible ? 200 : 80 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="interactive"
                ref={scrollViewRef}
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
                      ref={nameRef}
                      returnKeyType="next"
                      onSubmitEditing={() => emailRef.current?.focus()}
                      onFocus={() => handleInputFocus(nameRef)}
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
                      ref={emailRef}
                      returnKeyType="next"
                      onSubmitEditing={() => passwordRef.current?.focus()}
                      onFocus={() => handleInputFocus(emailRef)}
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
                      autoCapitalize="none"
                      ref={passwordRef}
                      returnKeyType="next"
                      onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                      onFocus={() => handleInputFocus(passwordRef)}
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
                  
                  {/* Password requirements */}
                  <View style={styles.passwordRequirements}>
                    <Text style={[styles.requirementText, { color: theme.textSecondary }]}>
                      Mật khẩu phải có:
                    </Text>
                    <View style={styles.requirementItem}>
                      <View style={[styles.bullet, { backgroundColor: theme.textSecondary }]} />
                      <Text style={[styles.requirementItemText, { color: theme.textSecondary }]}>
                        Ít nhất 8 ký tự
                      </Text>
                    </View>
                    <View style={styles.requirementItem}>
                      <View style={[styles.bullet, { backgroundColor: theme.textSecondary }]} />
                      <Text style={[styles.requirementItemText, { color: theme.textSecondary }]}>
                        Ít nhất một chữ cái viết hoa
                      </Text>
                    </View>
                    <View style={styles.requirementItem}>
                      <View style={[styles.bullet, { backgroundColor: theme.textSecondary }]} />
                      <Text style={[styles.requirementItemText, { color: theme.textSecondary }]}>
                        Ít nhất một chữ cái viết thường
                      </Text>
                    </View>
                    <View style={styles.requirementItem}>
                      <View style={[styles.bullet, { backgroundColor: theme.textSecondary }]} />
                      <Text style={[styles.requirementItemText, { color: theme.textSecondary }]}>
                        Ít nhất một chữ số
                      </Text>
                    </View>
                    <View style={styles.requirementItem}>
                      <View style={[styles.bullet, { backgroundColor: theme.textSecondary }]} />
                      <Text style={[styles.requirementItemText, { color: theme.textSecondary }]}>
                        Ít nhất một ký tự đặc biệt (!@#$%^&*)
                      </Text>
                    </View>
                  </View>
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
                      autoCapitalize="none"
                      ref={confirmPasswordRef}
                      returnKeyType="done"
                      onSubmitEditing={handleSignUp}
                      onFocus={() => handleInputFocus(confirmPasswordRef)}
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
    top: 30,
    left: 24,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  topSection: {
    marginTop: 80,
    marginBottom: 10,
    paddingHorizontal: SIZES.padding,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  topSectionSmaller: {
    marginTop: 50,
    marginBottom: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 20,
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
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  passwordRequirements: {
    marginTop: 10,
    marginBottom: 10,
  },
  requirementText: {
    fontSize: SIZES.small,
    fontWeight: '500',
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 8,
  },
  requirementItemText: {
    fontSize: 12,
  },
});

export default SignUpScreen; 