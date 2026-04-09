import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated, Easing } from 'react-native';
import { COLORS } from '../constants/colors';

const LoadingScreen = ({ navigation }) => {
  const rotation = new Animated.Value(0);
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0.5, duration: 1000, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 1000, useNativeDriver: true })
    ]).start();

    // Simulate AI loading
    const timer = setTimeout(() => {
      navigation.replace('RegistryScreen');
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.loader, { transform: [{ rotate: spin }] }]} />
        <Animated.Text style={[styles.text, { opacity }]}>
          Understanding your style...
        </Animated.Text>
        <Text style={styles.subtext}>
          Curating your registry...
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loader: { width: 44, height: 44, borderRadius: 22, borderTopWidth: 2, borderRightWidth: 2, borderColor: COLORS.accent, marginBottom: 40 },
  text: { fontSize: 20, color: COLORS.text, fontWeight: '400', marginBottom: 12, fontFamily: 'System' },
  subtext: { fontSize: 16, color: COLORS.textSecondary },
});

export default LoadingScreen;
