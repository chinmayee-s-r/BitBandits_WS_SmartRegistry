import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated, Easing, Alert } from 'react-native';
import { COLORS, SIZES } from '../constants/colors';
import { LOADING_MESSAGES } from '../constants/mockData';

const AnimatedDots = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createDotAnim = (dot, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            delay,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      );
    };

    createDotAnim(dot1, 0).start();
    createDotAnim(dot2, 150).start();
    createDotAnim(dot3, 300).start();
  }, []);

  return (
    <View style={styles.dotsContainer}>
      {[dot1, dot2, dot3].map((dot, i) => (
        <Animated.View
          key={i}
          style={[
            styles.dot,
            {
              opacity: dot.interpolate({
                inputRange: [0, 1],
                outputRange: [0.2, 1],
              }),
              transform: [
                {
                  scale: dot.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.2],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

// ─── Change this to your machine's local IP when testing on a physical device ───
const BASE_URL = 'http://127.0.0.1:5000';

const LoadingScreen = ({ navigation, route }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const messageFade = useRef(new Animated.Value(0)).current;

  // Payload assembled by IntentInputScreen
  const payload = route?.params?.payload || null;

  useEffect(() => {
    // Initial fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Message cycling
    const cycleMessages = () => {
      Animated.timing(messageFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    };

    cycleMessages();

    const interval = setInterval(() => {
      Animated.timing(messageFade, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
        Animated.timing(messageFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 2000);

    // ── Call the backend ──────────────────────────────────────────────
    const callBackend = async () => {
      try {
        if (!payload) {
          throw new Error('No payload provided. Please complete the onboarding steps.');
        }

        console.log('📦 Sending payload:', JSON.stringify(payload, null, 2));

        const response = await fetch(`${BASE_URL}/generate-registry`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Server error: ${response.status}`);
        }

        const data = await response.json();
        const items = data.items || [];

        clearInterval(interval);
        navigation.replace('RegistryScreen', { items, payload });

      } catch (err) {
        console.error('❌ Registry generation failed:', err.message);
        clearInterval(interval);
        Alert.alert(
          'Something went wrong',
          err.message || 'Could not generate registry. Please try again.',
          [{ text: 'Go Back', onPress: () => navigation.goBack() }]
        );
      }
    };

    callBackend();

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Subtle decorative element */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>✦</Text>
        </View>

        <Animated.Text style={[styles.message, { opacity: messageFade }]}>
          {LOADING_MESSAGES[messageIndex]}
        </Animated.Text>

        <AnimatedDots />

        <Text style={styles.subtext}>
          Personalizing your experience
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  icon: {
    fontSize: 24,
    color: COLORS.text,
  },
  message: {
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 0.2,
    lineHeight: 28,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.text,
  },
  subtext: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textTertiary,
    fontWeight: '400',
    letterSpacing: 0.3,
  },
});

export default LoadingScreen;
