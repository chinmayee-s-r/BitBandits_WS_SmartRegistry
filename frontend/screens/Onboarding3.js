import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/colors';
import Button from '../components/Button';
import FadeInView from '../components/FadeInView';

const THEMES = [
  { id: 'v1', name: 'Aesthetic', image: require('../assets/Images/Themes/Aesthetic.png') },
  { id: 'v2', name: 'Budget', image: require('../assets/Images/Themes/Budget.png') },
  { id: 'v3', name: 'Classic', image: require('../assets/Images/Themes/Classic.png') },
  { id: 'v4', name: 'Cozy', image: require('../assets/Images/Themes/Cozy.png') },
  { id: 'v5', name: 'Luxury', image: require('../assets/Images/Themes/Luxury.png') },
  { id: 'v6', name: 'Minimalist', image: require('../assets/Images/Themes/Minimalist.png') },
  { id: 'v7', name: 'Modern', image: require('../assets/Images/Themes/Modern.png') },
  { id: 'v8', name: 'Premium', image: require('../assets/Images/Themes/Premium.png') },
];

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SIZES.padding * 2 - 16) / 2;

const Onboarding3 = ({ navigation }) => {
  const [selectedTheme, setSelectedTheme] = useState(null);

  const toggleTheme = (id) => {
    if (selectedTheme === id) {
      setSelectedTheme(null);
    } else {
      setSelectedTheme(id);
    }
  };

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

        <FadeInView delay={300} style={styles.chipSection}>
          <ScrollView
            contentContainerStyle={styles.gridContainer}
            showsVerticalScrollIndicator={false}
          >
            {THEMES.map((theme) => {
              const isSelected = selectedTheme === theme.id;
              return (
                <TouchableOpacity
                  key={theme.id}
                  style={[styles.card, isSelected && styles.cardActive]}
                  onPress={() => toggleTheme(theme.id)}
                  activeOpacity={0.8}
                >
                  <Image source={theme.image} style={styles.cardImage} resizeMode="cover" />
                  {isSelected && (
                    <View style={styles.selectedOverlay}>
                      <View style={styles.checkmarkCircle}>
                        <Text style={styles.checkmark}>✓</Text>
                      </View>
                    </View>
                  )}
                  <View style={styles.cardLabelContainer}>
                    <Text
                      style={[
                        styles.cardText,
                        isSelected && styles.cardTextActive,
                      ]}
                    >
                      {theme.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </FadeInView>

        {/* Selected display */}
        {selectedTheme && (
          <FadeInView translateY={10}>
            <Text style={styles.selectionCount}>
              {THEMES.find((t) => t.id === selectedTheme)?.name} — selected
            </Text>
          </FadeInView>
        )}

        <FadeInView delay={500} style={styles.footer}>
          <Button
            title="Curate My Registry"
            onPress={() => navigation.navigate('IntentInput')}
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
    marginBottom: 36,
    fontWeight: '400',
    lineHeight: 24,
  },
  chipSection: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.1,
    marginBottom: 16,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardActive: {
    borderColor: COLORS.text,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.text,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardLabelContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  cardText: {
    fontSize: SIZES.fontRegular,
    color: COLORS.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  cardTextActive: {
    color: COLORS.text,
  },
  selectionCount: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '400',
  },
  footer: {
    paddingBottom: 24,
    paddingTop: 8,
  },
});

export default Onboarding3;
