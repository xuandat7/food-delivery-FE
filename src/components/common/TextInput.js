import React, { useState } from 'react';
import { 
  View, 
  TextInput as RNTextInput, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

/**
 * Reusable TextInput component
 * @param {Object} props - Component props
 * @param {string} props.label - Input label
 * @param {string} props.value - Input value
 * @param {Function} props.onChangeText - Text change handler
 * @param {Object} props.style - Additional styles for the container
 * @param {Object} props.inputStyle - Additional styles for the input
 * @param {string} props.placeholder - Input placeholder
 * @param {string} props.placeholderTextColor - Color of placeholder text
 * @param {boolean} props.secureTextEntry - Whether the input is for passwords
 * @param {string} props.keyboardType - Keyboard type
 * @param {boolean} props.error - Whether there's an error
 * @param {string} props.errorText - Error message text
 * @param {Object} props.rest - Additional TextInput props
 * @returns {JSX.Element} - Rendered component
 */
const TextInput = ({ 
  label,
  value, 
  onChangeText, 
  style, 
  inputStyle,
  placeholder,
  placeholderTextColor = COLORS.placeholderText,
  secureTextEntry,
  keyboardType,
  error,
  errorText,
  ...rest
}) => {
  const [isSecureTextVisible, setIsSecureTextVisible] = useState(false);
  
  // Toggle password visibility
  const toggleSecureEntry = () => {
    setIsSecureTextVisible(!isSecureTextVisible);
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.inputContainer, 
        error && styles.inputError
      ]}>
        <RNTextInput
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          secureTextEntry={secureTextEntry && !isSecureTextVisible}
          keyboardType={keyboardType}
          autoCapitalize="none"
          {...rest}
        />
        
        {secureTextEntry && (
          <TouchableOpacity 
            style={styles.secureTextButton} 
            onPress={toggleSecureEntry}
          >
            <Ionicons 
              name={isSecureTextVisible ? 'eye-off-outline' : 'eye-outline'} 
              size={22} 
              color={COLORS.textSecondary} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && errorText && (
        <Text style={styles.errorText}>
          {errorText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: SIZES.small,
    color: COLORS.text,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: SIZES.buttonRadius,
    height: SIZES.inputHeight,
    flexDirection: 'row',
    backgroundColor: COLORS.inputBackground,
  },
  input: {
    flex: 1,
    paddingHorizontal: 19,
    fontSize: SIZES.medium,
    color: COLORS.text,
    height: '100%',
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: SIZES.small,
    marginTop: 4,
    marginLeft: 4,
  },
  secureTextButton: {
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
});

export default TextInput; 