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

const NewPasswordScreen = ({ onGoBack, onComplete, email }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handleResetPassword = () => {
    // Simple validation
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your new password');
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
    
    // In a real app, you would call an API to update the password
    Alert.alert(
      'Success',
      'Your password has been reset successfully',
      [
        { 
          text: 'OK', 
          onPress: () => {
            if (onComplete) onComplete();
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
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>Create a new password for</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
        
        {/* White background container */}
        <View style={styles.whiteContainer}>
          {/* Password input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>NEW PASSWORD</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                placeholderTextColor={COLORS.placeholderText}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>
          
          {/* Confirm Password input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>CONFIRM PASSWORD</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                placeholderTextColor={COLORS.placeholderText}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
          </View>
          
          {/* Reset Password button */}
          <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
            <Text style={styles.resetButtonText}>RESET PASSWORD</Text>
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
    paddingBottom: 50,
    flex: 1,
    minHeight: 580,
  },
  inputGroup: {
    marginBottom: 20,
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
  resetButton: {
    backgroundColor: COLORS.primaryButton,
    borderRadius: SIZES.buttonRadius,
    height: SIZES.inputHeight,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  resetButtonText: {
    color: COLORS.background,
    fontSize: SIZES.medium,
    fontWeight: '700',
  },
});

export default NewPasswordScreen; 