import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/colors';
import { THEMES } from '../constants/mockData';
import Button from '../components/Button';
import FadeInView from '../components/FadeInView';

const { width: screenWidth } = Dimensions.get('window');
const cardPadding = SIZES.padding * 2;
const cardGap = 16;
const cardWidth = (screenWidth - cardPadding - cardGap) / 2;

const VibeCard = ({ theme, isSelected, onSelect, index }) => {
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        damping: 18,
        stiffness: 160,
        delay: index * 120,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 120,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isSelected ? 0.97 : 1,
      damping: 15,
      stiffness: 200,
      useNativeDriver: true,
    }).start();
  }, [isSelected]);

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.card, isSelected && styles.cardActive]}
        onPress={onSelect}
        activeOpacity={0.92}
      >
        <Image source={{ uri: theme.image }} style={styles.cardImage} />
        <View style={styles.cardOverlay} />

        {/* Selection indicator */}
        {isSelected && (
          <View style={styles.selectedBadge}>
            <Text style={styles.selectedCheck}>✓</Text>
          </View>
        )}

        <View style={styles.cardContent}>
          <Text style={styles.cardName}>{theme.name}</Text>
          <Text style={styles.cardDescription}>{theme.description}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const Onboarding3 = ({ navigation }) => {
  const [selectedTheme, setSelectedTheme] = useState(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Step indicator */}
        <View style={styles.stepIndicator}>
          <View style={styles.stepDotDone} />
          <View style={[styles.stepLine, styles.stepLineDone]} />
          <View style={styles.stepDotDone} />
          <View style={[styles.stepLine, styles.stepLineDone]} />
          <View style={[styles.stepDot, styles.stepDotActive]} />
        </View>

        <FadeInView delay={100}>
          <Text style={styles.eyebrow}>STYLE</Text>
          <Text style={styles.title}>Define your{'\n'}vibe</Text>
          <Text style={styles.subtitle}>
            Choose the aesthetic that resonates with you
          </Text>
        </FadeInView>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContainer}
        >
          <View style={styles.grid}>
            {THEMES.map((theme, index) => (
              <VibeCard
                key={theme.id}
                theme={theme}
                isSelected={selectedTheme === theme.id}
                onSelect={() => setSelectedTheme(theme.id)}
                index={index}
              />
            ))}
          </View>
        </ScrollView>

        {/* Selected display */}
        {selectedTheme && (
          <FadeInView translateY={10} duration={300}>
            <Text style={styles.selectedLabel}>
              {THEMES.find((t) => t.id === selectedTheme)?.name} — selected
            </Text>
          </FadeInView>
        )}

        <FadeInView delay={600} style={styles.footer}>
          <Button
            title="Curate My Registry"
            onPress={() => navigation.navigate('LoadingScreen')}
            disabled={!selectedTheme}
          />
        </FadeInView>
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
    padding: SIZES.padding,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 40,
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
    width: 32,
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 8,
  },
  stepLineDone: {
    backgroundColor: COLORS.success,
  },
  eyebrow: {
    fontSize: SIZES.fontMicro,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 12,
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
    marginBottom: 24,
  },
  gridContainer: {
    paddingBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: cardGap,
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: cardWidth,
    marginBottom: 0,
  },
  card: {
    width: '100%',
    aspectRatio: 0.72,
    borderRadius: SIZES.radiusLg,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    ...SHADOWS.medium,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardActive: {
    borderColor: COLORS.text,
    ...SHADOWS.large,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCheck: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
  },
  cardName: {
    fontSize: SIZES.fontRegular,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: SIZES.fontCaption,
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
  selectedLabel: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontWeight: '400',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  footer: {
    paddingBottom: 24,
    paddingTop: 8,
  },
});

export default Onboarding3;
