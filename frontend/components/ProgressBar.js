import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, SIZES } from '../constants/colors';

const ProgressBar = ({ step, totalSteps, label }) => {
  const widthAnim = useRef(new Animated.Value(0)).current;
  const progress = (step / totalSteps) * 100;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: progress,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [step]);

  const animatedWidth = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.stepLabel}>
          {label || `Step ${step} of ${totalSteps}`}
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width: animatedWidth }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
    marginTop: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepLabel: {
    fontSize: SIZES.fontMicro,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  track: {
    height: 2,
    backgroundColor: COLORS.border,
    borderRadius: 1,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: COLORS.text,
    borderRadius: 1,
  },
});

export default ProgressBar;
