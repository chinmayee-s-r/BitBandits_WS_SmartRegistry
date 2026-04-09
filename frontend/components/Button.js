import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/colors';

const Button = ({ title, onPress, type = 'primary', style }) => {
  const isPrimary = type === 'primary';
  const bgColor = isPrimary ? COLORS.accent : COLORS.white;
  const textColor = isPrimary ? COLORS.white : COLORS.text;
  const borderWidth = isPrimary ? 0 : 1;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: bgColor, borderWidth, borderColor: COLORS.border },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 12,
  },
  text: {
    fontSize: SIZES.fontRegular,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default Button;
