import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { COLORS, SIZES, SHADOWS, ANIMATION } from '../constants/colors';
import Button from '../components/Button';
import FadeInView from '../components/FadeInView';
import InputField from '../components/InputField';

const IntentInputScreen = ({ navigation, route }) => {
  const [intentText, setIntentText] = useState('');

  // Params forwarded from Onboarding3
  const selectedCategoryNames = route?.params?.selectedCategoryNames || [];
  const category_budget       = route?.params?.category_budget       || {};
  const theme                 = route?.params?.theme                 || 'modern';

  // Screen-level fade in
  const screenFade = useRef(new Animated.Value(0)).current;

  // Button press feedback
  const skipOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(screenFade, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Build the full JSON payload and navigate to LoadingScreen
  const buildPayloadAndNavigate = (extra) => {
    const payload = {
      category:        selectedCategoryNames,
      category_budget: category_budget,
      theme:           theme,
      extra:           extra,
    };
    navigation.navigate('LoadingScreen', { payload });
  };

  const handleRefine = () => {
    buildPayloadAndNavigate(intentText.trim());
  };

  const handleSkip = () => {
    // Subtle press feedback
    Animated.sequence([
      Animated.timing(skipOpacity, {
        toValue: 0.4,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(skipOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      buildPayloadAndNavigate('');
    });
  };



  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <Animated.View style={[styles.content, { opacity: screenFade }]}>
          <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {/* Step indicator — all done */}
              <FadeInView delay={80} translateY={8}>
                <View style={styles.stepIndicator}>
                  <View style={styles.stepDotDone} />
                  <View style={[styles.stepLine, styles.stepLineDone]} />
                  <View style={styles.stepDotDone} />
                  <View style={[styles.stepLine, styles.stepLineDone]} />
                  <View style={styles.stepDotDone} />
                  <View style={[styles.stepLine, styles.stepLineDone]} />
                  <View style={[styles.stepDot, styles.stepDotActive]} />
                </View>
              </FadeInView>

              {/* Heading */}
              <FadeInView delay={150} translateY={14}>
                <Text style={styles.eyebrow}>PERSONALIZE</Text>
                <Text style={styles.title}>
                  Anything specific{'\n'}you're looking for?
                </Text>
                <Text style={styles.subtitle}>
                  Tell us if you have something particular in mind.{'\n'}
                  We'll refine your registry accordingly.
                </Text>
              </FadeInView>

              {/* Text Input */}
              <FadeInView delay={350} translateY={18}>
                <InputField
                  placeholder={'e.g. modern dinnerware, coffee machine,\nminimal decor, ratings above 4 stars...'}
                  value={intentText}
                  onChangeText={setIntentText}
                  multiline={true}
                  returnKeyType="default"
                  blurOnSubmit={false}
                />

                {/* Helpful hint */}
                <Text style={styles.hint}>
                  ✦ &nbsp;You can mention brands, price ranges, review ratings, or any preference
                </Text>
              </FadeInView>
            </ScrollView>

            {/* Footer CTAs */}
            <FadeInView delay={550} style={styles.footer}>
              <Button
                title="Refine my registry"
                onPress={handleRefine}
              />

              <Animated.View style={{ opacity: skipOpacity }}>
                <TouchableOpacity
                  onPress={handleSkip}
                  activeOpacity={0.6}
                  style={styles.skipButton}
                >
                  <Text style={styles.skipText}>Skip for now</Text>
                </TouchableOpacity>
              </Animated.View>
            </FadeInView>
          </Animated.View>
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 8,
  },

  /* ── Step Indicator ── */
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 36,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  stepDotDone: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  stepDotActive: {
    backgroundColor: COLORS.text,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stepLine: {
    width: 24,
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 6,
  },
  stepLineDone: {
    backgroundColor: COLORS.success,
  },

  /* ── Typography ── */
  eyebrow: {
    fontSize: SIZES.fontMicro,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 10,
  },
  title: {
    fontSize: SIZES.fontLarge,
    fontWeight: '200',
    color: COLORS.text,
    marginBottom: 12,
    letterSpacing: -0.3,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: SIZES.fontRegular,
    color: COLORS.textSecondary,
    fontWeight: '400',
    lineHeight: 24,
    marginBottom: 28,
  },



  /* ── Hint ── */
  hint: {
    fontSize: SIZES.fontCaption,
    color: COLORS.textTertiary,
    fontWeight: '400',
    marginTop: 14,
    lineHeight: 18,
    paddingHorizontal: 4,
  },

  /* ── Footer ── */
  footer: {
    paddingBottom: 24,
    paddingTop: 12,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  skipText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
});

export default IntentInputScreen;
