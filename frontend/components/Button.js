import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/colors';

const Button = ({ title, onPress, type = 'primary', style, disabled, loading }) => {
  const isPrimary = type === 'primary';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary ? styles.primary : styles.secondary,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? COLORS.white : COLORS.text} size="small" />
      ) : (
        <Text
          style={[
            styles.text,
            isPrimary ? styles.primaryText : styles.secondaryText,
            disabled && styles.disabledText,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 12,
    minHeight: 52,
  },
  primary: {
    backgroundColor: COLORS.text,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    fontSize: SIZES.fontRegular,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  primaryText: {
    color: COLORS.white,
  },
  secondaryText: {
    color: COLORS.text,
  },
  disabledText: {
    opacity: 0.6,
  },
});

export default Button;
