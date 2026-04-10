import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, Animated } from 'react-native';

const InputField = ({
  label,
  placeholder,
  secureTextEntry,
  value,
  onChangeText,
  keyboardType = 'default',
  autoCapitalize = 'none',
  multiline = false,
  returnKeyType = 'default',
  blurOnSubmit = true,
  maxLength,
  textAlignVertical = 'center',
  prefix,
  containerStyle
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  // Animation for focus state (subtle highlight / glow)
  const focusAnim = useRef(new Animated.Value(0)).current;

  // Animation for fade-in on mount
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isFocused, focusAnim]);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  // Soft glow color for border when focused
  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0,0,0,0)', 'rgba(0, 122, 255, 0.4)'],
  });

  const shadowOpacity = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.03, 0.1],
  });

  return (
    <Animated.View style={[styles.container, containerStyle, { opacity: fadeAnim }]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Animated.View 
        style={[
          styles.inputWrapper, 
          { borderColor, shadowOpacity },
          isFocused ? styles.inputWrapperFocused : null
        ]}
      >
        {prefix && <Text style={styles.prefix}>{prefix}</Text>}
        <TextInput
          style={[styles.input, multiline && styles.multiline, { flex: 1 }]}
          placeholder={placeholder}
          placeholderTextColor="#8E8E93"
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline={multiline}
          returnKeyType={returnKeyType}
          blurOnSubmit={blurOnSubmit}
          maxLength={maxLength}
          textAlignVertical={multiline ? 'top' : textAlignVertical}
        />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    width: '100%',
  },
  label: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapperFocused: {
    backgroundColor: '#FFFFFF',
  },
  input: {
    minHeight: 44,
    fontSize: 16,
    color: '#1C1C1E',
    fontWeight: '400',
    borderWidth: 0,
    padding: 0,
    outlineStyle: 'none',
  },
  multiline: {
    minHeight: 120,
    paddingTop: 12,
  },
  prefix: {
    fontSize: 16,
    color: '#1C1C1E',
    fontWeight: '400',
    marginRight: 6,
  },
});

export default InputField;
