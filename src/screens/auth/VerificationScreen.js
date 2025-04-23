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
  TextInput
} from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const VerificationScreen = ({ onGoBack, onComplete, email = "example@gmail.com", fromForgotPassword = false }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(50);
  const [isResendActive, setIsResendActive] = useState(false);
  const inputRefs = useRef([]);

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
    if (e.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1].focus();
    }
  };

  // Verify OTP
  const handleVerify = () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      Alert.alert('Error', 'Please enter the complete verification code');
      return;
    }
    
    // In a real app, you would validate the OTP with your backend
    console.log('Verifying OTP:', otpValue);
    
    // Show success message
    Alert.alert(
      "Verification Successful",
      fromForgotPassword 
        ? "You can now reset your password."
        : "Your account has been verified successfully.",
      [
        { 
          text: 'OK', 
          onPress: () => {
            // Navigate to next screen on success
            if (onComplete) onComplete(fromForgotPassword);
          } 
        }
      ]
    );
  };

  // Resend OTP
  const handleResend = () => {
    if (isResendActive) {
      // In a real app, you would call API to resend OTP
      console.log('Resending OTP to:', email);
      setTimeLeft(50);
      setIsResendActive(false);
      
      // Clear OTP fields
      setOtp(['', '', '', '', '', '']);
      
      // Show message
      Alert.alert('Success', 'A new verification code has been sent');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.loginBackground }}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Background elements */}
          <View style={styles.backgroundContainer}>
            <View style={styles.circle} />
            <View style={styles.rightLine} />
          </View>
          
          {/* Back button */}
          <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
            <Ionicons name="chevron-back" size={24} color={COLORS.loginBackground} />
          </TouchableOpacity>
          
          {/* Top section */}
          <View style={styles.topSection}>
            <Text style={styles.title}>Verification</Text>
            <Text style={styles.subtitle}>We have sent a code to your email</Text>
            <Text style={styles.email}>{email}</Text>
          </View>
          
          {/* White background container */}
          <View style={styles.whiteContainer}>
            {/* OTP Input section */}
            <View style={styles.otpSection}>
              <View style={styles.otpLabelRow}>
                <Text style={styles.otpLabel}>CODE</Text>
                <TouchableOpacity 
                  onPress={handleResend}
                  disabled={!isResendActive}
                >
                  <Text style={[
                    styles.resendText,
                    {color: isResendActive ? COLORS.primaryButton : COLORS.textSecondary}
                  ]}>
                    Resend {!isResendActive ? `in.${timeLeft}sec` : ''}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* OTP Input Fields */}
              <View style={styles.otpInputContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={ref => inputRefs.current[index] = ref}
                    style={styles.otpInput}
                    value={digit}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    keyboardType="numeric"
                    maxLength={1}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    selectTextOnFocus
                  />
                ))}
              </View>
            </View>
            
            {/* Verify button */}
            <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
              <Text style={styles.verifyButtonText}>VERIFY</Text>
            </TouchableOpacity>
            
            {/* Add bottom padding for better appearance */}
            <View style={styles.bottomPadding} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.loginBackground,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
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
    borderColor: 'rgba(255, 255, 255, 0.05)',
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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 24,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: COLORS.background,
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
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.background,
    marginBottom: 10,
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
    color: COLORS.background,
    marginTop: 5,
  },
  whiteContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: SIZES.cardBorderRadius,
    borderTopRightRadius: SIZES.cardBorderRadius,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 20,
    flex: 1,
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
    color: COLORS.text,
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
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  verifyButton: {
    backgroundColor: COLORS.primaryButton,
    borderRadius: SIZES.buttonRadius,
    height: SIZES.inputHeight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  verifyButtonText: {
    color: COLORS.background,
    fontSize: SIZES.medium,
    fontWeight: '700',
  },
  bottomPadding: {
    height: 100,
  }
});

export default VerificationScreen; 