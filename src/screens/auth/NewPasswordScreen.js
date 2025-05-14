import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Dimensions,
  Keyboard,
  UIManager,
  findNodeHandle
} from 'react-native';
import { COLORS, RESTAURANT_COLORS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { authAPI } from '../../services';

const { height, width } = Dimensions.get('window');

const NewPasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const email = route.params?.email || "example@gmail.com";
  const otp = route.params?.otp || "";
  const isRestaurant = route.params?.isRestaurant || false;
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  
  // Input refs
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const scrollViewRef = useRef(null);
  
  // Use the appropriate theme based on isRestaurant prop
  const theme = isRestaurant ? RESTAURANT_COLORS : COLORS;

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

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Validate password
  const validatePassword = (value) => {
    setPassword(value);
    
    if (value.length < 8) {
      setPasswordError('Mật khẩu phải có ít nhất 8 ký tự');
    } else if (!/[A-Z]/.test(value)) {
      setPasswordError('Mật khẩu phải chứa ít nhất một chữ cái viết hoa');
    } else if (!/[a-z]/.test(value)) {
      setPasswordError('Mật khẩu phải chứa ít nhất một chữ cái viết thường');
    } else if (!/[0-9]/.test(value)) {
      setPasswordError('Mật khẩu phải chứa ít nhất một chữ số');
    } else if (!/[!@#$%^&*]/.test(value)) {
      setPasswordError('Mật khẩu phải chứa ít nhất một ký tự đặc biệt (!@#$%^&*)');
    } else {
      setPasswordError('');
    }
    
    // Also check if confirm password matches
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError('Mật khẩu không khớp');
    } else if (confirmPassword) {
      setConfirmPasswordError('');
    }
  };

  // Validate confirm password
  const validateConfirmPassword = (value) => {
    setConfirmPassword(value);
    
    if (value !== password) {
      setConfirmPasswordError('Mật khẩu không khớp');
    } else {
      setConfirmPasswordError('');
    }
  };

  // Handle reset password
  const handleResetPassword = async () => {
    // Validate all fields
    if (!password) {
      setPasswordError('Mật khẩu là bắt buộc');
      return;
    }
    
    if (!confirmPassword) {
      setConfirmPasswordError('Vui lòng xác nhận mật khẩu của bạn');
      return;
    }
    
    if (passwordError || confirmPasswordError) {
      return;
    }
    
    try {
      console.log('Attempting to reset password for:', email);
      console.log('Using OTP:', otp);
      
      // Call the reset password API with email, otp, and newPassword
      const response = await authAPI.resetPassword(email, otp, password);
      
      console.log('Reset password response:', response);
      
      if (response.success) {
        // Show success message
        Alert.alert(
          "Thành Công",
          "Mật khẩu của bạn đã được đặt lại thành công.",
          [
            { 
              text: 'OK', 
              onPress: () => {
                navigation.navigate('Login', { isRestaurant });
              } 
            }
          ]
        );
      } else {
        // Show error message
        Alert.alert("Thất Bại", response.message || "Không thể đặt lại mật khẩu, vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error('Reset password error:', error);
      Alert.alert("Lỗi", error.message || "Đã xảy ra lỗi khi đặt lại mật khẩu");
    }
  };

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
          // Cuộn chính xác đến vị trí của ô nhập liệu
          scrollViewRef.current?.scrollTo({ 
            y: pageY - 100, // Cuộn ô nhập lên vị trí cách đỉnh màn hình 100px
            animated: true 
          });
        }
      });
    }, 100);
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
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
          enabled={Platform.OS === 'ios'}
        >
          {/* Content container */}
          <View style={{ flex: 1 }}>
            {/* Background elements */}
            <View style={styles.backgroundContainer}>
              <View style={[styles.circle, { borderColor: theme.loginDarkElements }]} />
              <View style={[styles.rightLine, { borderColor: theme.loginDarkElements }]} />
            </View>
            
            {/* Back button */}
            <TouchableOpacity style={[styles.backButton, { backgroundColor: theme.background }]} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color={theme.loginBackground} />
            </TouchableOpacity>
            
            {/* Top section */}
            <View style={[styles.topSection, keyboardVisible && styles.topSectionSmaller]}>
              <Text style={[styles.title, { color: theme.background }]}>
                {isRestaurant ? 'Đặt Lại Mật Khẩu Nhà Hàng' : 'Đặt Lại Mật Khẩu'}
              </Text>
              <Text style={styles.subtitle}>Tạo mật khẩu mới cho</Text>
              <Text style={[styles.email, { color: theme.background }]}>{email}</Text>
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
                contentContainerStyle={{ paddingBottom: keyboardVisible ? 200 : 120 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="interactive"
                ref={scrollViewRef}
              >
                {/* Password section */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.text }]}>MẬT KHẨU MỚI</Text>
                  <View style={[styles.inputContainer, { 
                    borderColor: passwordError ? 'red' : theme.inputBorder,
                    backgroundColor: theme.inputBackground
                  }]}>
                    <TextInput
                      style={[styles.input, { color: theme.text, letterSpacing: password ? 0 : -0.5 }]}
                      placeholder="Nhập mật khẩu mới"
                      placeholderTextColor={theme.placeholderText}
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={validatePassword}
                      autoCapitalize="none"
                      textContentType="newPassword"
                      returnKeyType="next"
                      ref={passwordRef}
                      onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                      onFocus={() => handleInputFocus(passwordRef)}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={togglePasswordVisibility}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={22}
                        color={theme.placeholderText}
                      />
                    </TouchableOpacity>
                  </View>
                  {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                  
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
                
                {/* Confirm Password section */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.text }]}>XÁC NHẬN MẬT KHẨU</Text>
                  <View style={[styles.inputContainer, { 
                    borderColor: confirmPasswordError ? 'red' : theme.inputBorder,
                    backgroundColor: theme.inputBackground
                  }]}>
                    <TextInput
                      style={[styles.input, { color: theme.text, letterSpacing: confirmPassword ? 0 : -0.5 }]}
                      placeholder="Nhập lại mật khẩu mới"
                      placeholderTextColor={theme.placeholderText}
                      secureTextEntry={!showConfirmPassword}
                      value={confirmPassword}
                      onChangeText={validateConfirmPassword}
                      autoCapitalize="none"
                      textContentType="newPassword"
                      returnKeyType="done"
                      onSubmitEditing={handleResetPassword}
                      ref={confirmPasswordRef}
                      onFocus={() => handleInputFocus(confirmPasswordRef)}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={toggleConfirmPasswordVisibility}
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
                
                {/* Reset Password Button */}
                <TouchableOpacity 
                  style={[styles.loginButton, { backgroundColor: theme.primaryButton }]} 
                  onPress={handleResetPassword}
                >
                  <Text style={[styles.loginButtonText, { color: theme.background }]}>
                    ĐẶT LẠI MẬT KHẨU
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
  topSectionSmaller: {
    marginTop: 80,
    marginBottom: 15,
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
  email: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginTop: 5,
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
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: SIZES.small,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: SIZES.buttonRadius,
    height: SIZES.inputHeight,
    justifyContent: 'center',
    position: 'relative',
  },
  input: {
    flex: 1,
    paddingHorizontal: 20,
    fontSize: SIZES.medium,
    height: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: 19,
    top: 19,
  },
  errorText: {
    marginTop: 5,
    fontSize: SIZES.small,
    color: 'red',
  },
  passwordRequirements: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.5)',
    marginTop: 8,
    lineHeight: 18,
  },
  requirementText: {
    fontSize: SIZES.small,
    fontWeight: '500',
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  requirementItemText: {
    marginLeft: 8,
  },
  loginButton: {
    borderRadius: SIZES.buttonRadius,
    height: SIZES.inputHeight,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  loginButtonText: {
    fontSize: SIZES.medium,
    fontWeight: '700',
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 8,
  },
});

export default NewPasswordScreen; 