import React, { useRef, useEffect } from 'react';
import { Animated, Platform } from 'react-native';

// useNativeDriver: true is only supported on native, not on react-native-web
const canUseNativeDriver = Platform.OS !== 'web';

const FadeInView = ({ children, delay = 0, duration = 500, style, translateY = 20 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(translateY)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: canUseNativeDriver,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: canUseNativeDriver,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default FadeInView;
