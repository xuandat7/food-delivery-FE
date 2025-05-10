import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TextInput,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { COLORS, RESTAURANT_COLORS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../../services/api';

const { height, width } = Dimensions.get('window');

const VerificationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const email = route.params?.email || "example@gmail.com";
  const fromForgotPassword = route.params?.fromForgotPassword || false;
  const isRestaurant = route.params?.isRestaurant || false;
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(50);
  const [isResendActive, setIsResendActive] = useState(false);
  const inputRefs = useRef([]);
  
  // Use the appropriate theme based on isRestaurant prop
  const theme = isRestaurant ? RESTAURANT_COLORS : COLORS;

  // Timer for resend code
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendActive(true);
    }
  }, [timeLeft]);

  // Handle OTP input
  const handleOtpChange = (value, index) => {
    if (value.length > 1) {
      value = value.charAt(value.length - 1);
    }
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Move focus to next input if current input is filled
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle keyboard backspace
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent && e.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1].focus();
    }
  };

  // Verify OTP
  const handleVerify = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ mã xác nhận');
      return;
    }
    
    try {
      // Call the verify OTP API
      const response = await api.auth.verifyOTP(email, otpValue);
      
      if (response.success) {
        // Show success message
        Alert.alert(
          "Xác Minh Thành Công",
          fromForgotPassword 
            ? "Bạn có thể đặt lại mật khẩu của mình."
            : "Tài khoản của bạn đã được xác minh thành công.",
          [
            { 
              text: 'OK', 
              onPress: () => {
                // Navigate to next screen on success
                if (fromForgotPassword) {
                  // Pass the OTP to the NewPassword screen
                  const otpValue = otp.join('');
                  navigation.navigate('NewPassword', { 
                    email, 
                    otp: otpValue, 
                    isRestaurant 
                  });
                } else {
                  navigation.navigate('Login');
                }
              } 
            }
          ]
        );
      } else {
        // Show error message
        Alert.alert("Xác Minh Thất Bại", response.message || "Mã xác nhận không hợp lệ, vui lòng thử lại.");
      }
    } catch (error) {
      Alert.alert("Lỗi", error.message || "Đã xảy ra lỗi khi xác minh mã OTP");
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (isResendActive) {
      try {
        // Call the forgot password API again to resend OTP
        const response = await api.auth.forgotPassword(email);
        
        if (response.success) {
          // Reset timer and OTP fields
          setTimeLeft(50);
          setIsResendActive(false);
          setOtp(['', '', '', '', '', '']);
          
          // Show success message
          Alert.alert('Thành Công', 'Mã xác nhận mới đã được gửi');
        } else {
          // Show error message
          Alert.alert("Thất Bại", response.message || "Không thể gửi lại mã xác nhận, vui lòng thử lại sau.");
        }
      } catch (error) {
        Alert.alert("Lỗi", error.message || "Đã xảy ra lỗi khi gửi lại mã xác nhận");
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
            <View style={styles.topSection}>
              <Text style={[styles.title, { color: theme.background }]}>
                {isRestaurant ? 'Xác Minh Nhà Hàng' : 'Xác Minh'}
              </Text>
              <Text style={styles.subtitle}>Chúng tôi đã gửi một mã đến email của bạn</Text>
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
                contentContainerStyle={{ paddingBottom: 80 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {/* OTP Input section */}
                <View style={styles.otpSection}>
                  <View style={styles.otpLabelRow}>
                    <Text style={[styles.otpLabel, { color: theme.text }]}>MÃ XÁC NHẬN</Text>
                    <TouchableOpacity 
                      onPress={handleResend}
                      disabled={!isResendActive}
                    >
                      <Text style={[
                        styles.resendText,
                        {color: isResendActive ? theme.primaryButton : theme.textSecondary}
                      ]}>
                        Gửi lại {!isResendActive ? `sau ${timeLeft}s` : ''}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* OTP Input Fields */}
                  <View style={styles.otpInputContainer}>
                    {otp.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={ref => inputRefs.current[index] = ref}
                        style={[styles.otpInput, {
                          backgroundColor: theme.inputBackground,
                          borderColor: theme.inputBorder,
                          color: theme.text
                        }]}
                        keyboardType="numeric"
                        maxLength={1}
                        value={digit}
                        onChangeText={(value) => handleOtpChange(value, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                      />
                    ))}
                  </View>
                </View>
                
                {/* Verify Button */}
                <TouchableOpacity 
                  style={[styles.verifyButton, { backgroundColor: theme.primaryButton }]} 
                  onPress={handleVerify}
                >
                  <Text style={[styles.verifyButtonText, { color: theme.background }]}>XÁC MINH</Text>
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
  otpSection: {
    marginBottom: 30,
  },
  otpLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  otpLabel: {
    fontSize: SIZES.small,
    fontWeight: '400',
  },
  resendText: {
    fontSize: SIZES.small,
    fontWeight: '400',
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  otpInput: {
    width: 48,
    height: 62,
    borderRadius: 12,
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  verifyButton: {
    borderRadius: SIZES.buttonRadius,
    height: SIZES.inputHeight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  verifyButtonText: {
    fontSize: SIZES.medium,
    fontWeight: '700',
  },
});

export default VerificationScreen; 