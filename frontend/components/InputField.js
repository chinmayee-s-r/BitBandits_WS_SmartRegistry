import React, { useState, useRef } from 'react';
import { View, TextInput, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, SIZES } from '../constants/colors';

const InputField = ({
  label,
  placeholder,
  secureTextEntry,
  value,
  onChangeText,
  keyboardType = 'default',
  autoCapitalize = 'none',
  multiline = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.border, COLORS.text],
  });

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Animated.View style={[styles.inputWrapper, { borderColor }]}>
        <TextInput
          style={[styles.input, multiline && styles.multiline]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textTertiary}
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline={multiline}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    width: '100%',
  },
  label: {
    fontSize: SIZES.fontCaption,
    color: COLORS.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  inputWrapper: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderRadius: SIZES.radius,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: SIZES.fontRegular,
    color: COLORS.text,
    fontWeight: '400',
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
});

export default InputField;
