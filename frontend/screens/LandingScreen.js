import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated } from 'react-native';
import { COLORS, SIZES } from '../constants/colors';
import Button from '../components/Button';

const LandingScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(30)).current;
  const subtitleFade = useRef(new Animated.Value(0)).current;
  const buttonsFade = useRef(new Animated.Value(0)).current;
  const buttonsSlide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(titleSlide, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(subtitleFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(buttonsFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(buttonsSlide, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Top decorative line */}
        <View style={styles.topAccent} />

        <View style={styles.header}>
          <Animated.Text
            style={[
              styles.title,
              {
                opacity: fadeAnim,
                transform: [{ translateY: titleSlide }],
              },
            ]}
          >
            Smart{'\n'}Registry
          </Animated.Text>

          <Animated.Text style={[styles.subtitle, { opacity: subtitleFade }]}>
            Build the perfect registry,{'\n'}effortlessly curated by AI.
          </Animated.Text>

          <Animated.View style={[styles.divider, { opacity: subtitleFade }]} />

          <Animated.Text style={[styles.tagline, { opacity: subtitleFade }]}>
            Inspired by your style. Guided by intelligence.
          </Animated.Text>
        </View>

        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: buttonsFade,
              transform: [{ translateY: buttonsSlide }],
            },
          ]}
        >
          <Button
            title="Create Registry"
            onPress={() => navigation.navigate('RegisterStep1')}
          />
          <Button
            title="Sign In"
            type="secondary"
            onPress={() => navigation.navigate('Login')}
          />
        </Animated.View>
      </View>
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
    padding: SIZES.padding,
  },
  topAccent: {
    position: 'absolute',
    top: 0,
    left: SIZES.padding,
    right: SIZES.padding,
    height: 1,
    backgroundColor: COLORS.border,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: SIZES.fontHero,
    fontWeight: '200',
    color: COLORS.text,
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 50,
    marginBottom: 24,
  },
  subtitle: {
    fontSize: SIZES.fontRegular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 24,
  },
  tagline: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textTertiary,
    textAlign: 'center',
    fontStyle: 'italic',
    letterSpacing: 0.3,
  },
  buttonContainer: {
    width: '100%',
    paddingBottom: 40,
  },
});

export default LandingScreen;
