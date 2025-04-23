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
  Alert
} from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const SignUpScreen = ({ onGoBack, onComplete }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const handleSignUp = () => {
    // Simple validation
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    
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
    
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter a password');
      return;
    }
    
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    // In a real app, you would register the user with your backend
    console.log('Sign up pressed with:', { name, email, password });
    
    // Show success message
    Alert.alert(
      "Sign Up Successful",
      "Your account has been created successfully.",
      [
        { 
          text: 'OK', 
          onPress: () => {
            // Navigate to home screen on success
            if (onComplete) onComplete();
          } 
        }
      ]
    );
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
            <Text style={styles.title}>Sign Up</Text>
            <Text style={styles.subtitle}>Please sign up to get started</Text>
          </View>
          
          {/* White background container - phần dưới mở rộng tối đa có thể */}
          <View style={[styles.whiteContainer, { flexGrow: 1 }]}>
            {/* Name input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>NAME</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="John doe"
                  placeholderTextColor={COLORS.placeholderText}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>
            
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
            
            {/* Password input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>PASSWORD</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.inputSecure}
                  placeholder="**********"
                  placeholderTextColor={COLORS.placeholderText}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
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
              </View>
            </View>
            
            {/* Confirm Password input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>RE-TYPE PASSWORD</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.inputSecure}
                  placeholder="**********"
                  placeholderTextColor={COLORS.placeholderText}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color={COLORS.placeholderText}
                  />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Sign Up button */}
            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
              <Text style={styles.signUpButtonText}>SIGN UP</Text>
            </TouchableOpacity>
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
    paddingBottom: 0,
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
    paddingBottom: 100,
    flex: 1,
    minHeight: 600,
    marginTop: -20,
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
    paddingRight: 50,
  },
  input: {
    paddingHorizontal: 20,
    fontSize: SIZES.medium,
    color: COLORS.text,
    height: '100%',
  },
  inputSecure: {
    paddingHorizontal: 20,
    fontSize: SIZES.medium,
    letterSpacing: 6.65,
    color: COLORS.text,
    height: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  signUpButton: {
    backgroundColor: COLORS.primaryButton,
    borderRadius: SIZES.buttonRadius,
    height: SIZES.inputHeight,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  signUpButtonText: {
    color: COLORS.background,
    fontSize: SIZES.medium,
    fontWeight: '700',
  },
});

export default SignUpScreen; 