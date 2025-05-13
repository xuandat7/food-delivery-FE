import React, { useState } from 'react';
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
  Dimensions
} from 'react-native';
import { COLORS, RESTAURANT_COLORS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { authAPI } from '../../services';

const { height, width } = Dimensions.get('window');

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isRestaurant = route.params?.isRestaurant || false;
  
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  
  // Use the appropriate theme based on isRestaurant param
  const theme = isRestaurant ? RESTAURANT_COLORS : COLORS;

  // Validate email
  const validateEmail = (text) => {
    setEmail(text);
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!text.trim()) {
      setEmailError('Email là bắt buộc');
    } else if (!emailRegex.test(text)) {
      setEmailError('Vui lòng nhập địa chỉ email hợp lệ');
    } else {
      setEmailError('');
    }
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!email.trim()) {
      setEmailError('Email là bắt buộc');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Vui lòng nhập địa chỉ email hợp lệ');
      return;
    }
    
    try {
      // Call the forgot password API
      const response = await authAPI.forgotPassword(email);
      
      if (response.success) {
        // Show success message and proceed to verification screen
        Alert.alert(
          "Thành Công",
          "Mã xác nhận đã được gửi đến email của bạn",
          [
            { 
              text: 'OK', 
              onPress: () => {
                // Navigate to verification screen
                navigation.navigate('Verification', { 
                  email, 
                  isRestaurant,
                  fromForgotPassword: true 
                });
              }
            }
          ]
        );
      } else {
        // Show error message
        Alert.alert("Thất Bại", response.message || "Không thể gửi mã xác nhận, vui lòng thử lại sau.");
      }
    } catch (error) {
      Alert.alert("Lỗi", error.message || "Đã xảy ra lỗi khi gửi mã xác nhận");
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
                {isRestaurant ? 'Quên Mật Khẩu Nhà Hàng?' : 'Quên Mật Khẩu?'}
              </Text>
              <Text style={styles.subtitle}>
                Nhập email của bạn và chúng tôi sẽ gửi bạn một liên kết để đặt lại mật khẩu
              </Text>
            </View>
            
            {/* White background container that extends to bottom of screen */}
            <View style={[
              styles.whiteContainer, 
              { 
                backgroundColor: theme.background,
                minHeight: height - 220, // Adjust based on top section height
              }
            ]}>
              <ScrollView 
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {/* Email input */}
                <View style={styles.inputSection}>
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
                      autoCapitalize="none"
                      value={email}
                      onChangeText={validateEmail}
                    />
                  </View>
                  {emailError ? (
                    <Text style={styles.errorText}>{emailError}</Text>
                  ) : null}
                </View>
                
                {/* Submit button */}
                <TouchableOpacity 
                  style={[styles.submitButton, { backgroundColor: theme.primaryButton }]} 
                  onPress={handleSubmit}
                >
                  <Text style={[styles.submitButtonText, { color: theme.background }]}>GỬI LIÊN KẾT ĐẶT LẠI</Text>
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
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: SIZES.small,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    height: SIZES.inputHeight,
    borderRadius: SIZES.buttonRadius,
    borderWidth: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  input: {
    height: SIZES.inputHeight,
    fontSize: SIZES.medium,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  submitButton: {
    borderRadius: SIZES.buttonRadius,
    height: SIZES.inputHeight,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: SIZES.medium,
    fontWeight: '700',
  },
});

export default ForgotPasswordScreen; 