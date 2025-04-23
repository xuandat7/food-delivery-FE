import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';

/**
 * Reusable Button component
 * @param {Object} props - Component props
 * @param {string} props.title - Button text
 * @param {Function} props.onPress - Button press handler
 * @param {Object} props.style - Additional styles for the button
 * @param {Object} props.textStyle - Additional styles for the button text
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {boolean} props.loading - Whether to show loading indicator
 * @param {string} props.variant - Button variant (primary, secondary, outline)
 * @returns {JSX.Element} - Rendered component
 */
const Button = ({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  disabled = false, 
  loading = false,
  variant = 'primary'
}) => {
  // Determine button styles based on variant
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      case 'primary':
      default:
        return styles.primaryButton;
    }
  };
  
  // Determine text styles based on variant
  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      case 'primary':
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        disabled && styles.disabledButton,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? COLORS.primaryButton : COLORS.background} 
          size="small" 
        />
      ) : (
        <Text style={[getTextStyle(), disabled && styles.disabledText, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: SIZES.inputHeight,
    borderRadius: SIZES.buttonRadius,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
  },
  primaryButton: {
    backgroundColor: COLORS.primaryButton,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primaryButton,
  },
  disabledButton: {
    backgroundColor: COLORS.lightGray,
    borderColor: COLORS.lightGray,
  },
  primaryText: {
    color: COLORS.background,
    fontSize: SIZES.medium,
    fontWeight: '700',
  },
  secondaryText: {
    color: COLORS.background,
    fontSize: SIZES.medium,
    fontWeight: '700',
  },
  outlineText: {
    color: COLORS.primaryButton,
    fontSize: SIZES.medium,
    fontWeight: '700',
  },
  disabledText: {
    color: COLORS.darkGray,
  },
});

export default Button; 