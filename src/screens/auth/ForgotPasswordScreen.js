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
  Alert
} from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const ForgotPasswordScreen = ({ onGoBack, onComplete }) => {
  const [email, setEmail] = useState('');
  
  const handleSendCode = () => {
    // Simple validation
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    // In a real app, you would send a code to the email
    Alert.alert(
      'Code Sent',
      `A verification code has been sent to ${email}`,
      [
        { 
          text: 'OK', 
          onPress: () => {
            // Navigate to verification screen or complete flow
            if (onComplete) onComplete(email);
          } 
        }
      ]
    );
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
        
        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
          <Ionicons name="chevron-back" size={24} color={COLORS.loginBackground} />
        </TouchableOpacity>
        
        {/* Top section */}
        <View style={styles.topSection}>
          <Text style={styles.title}>Forgot Password</Text>
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
              />
            </View>
          </View>
          
          {/* Send Code button */}
          <TouchableOpacity style={styles.sendCodeButton} onPress={handleSendCode}>
            <Text style={styles.sendCodeText}>SEND CODE</Text>
          </TouchableOpacity>
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
    borderTopLeftRadius: SIZES.cardBorderRadius,
    borderTopRightRadius: SIZES.cardBorderRadius,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 50,
    flex: 1,
    minHeight: 580,
  },
  inputGroup: {
    marginBottom: 40,
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
  sendCodeButton: {
    backgroundColor: COLORS.primaryButton,
    borderRadius: SIZES.buttonRadius,
    height: SIZES.inputHeight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  sendCodeText: {
    color: COLORS.background,
    fontSize: SIZES.medium,
    fontWeight: '700',
  },
});

export default ForgotPasswordScreen; 