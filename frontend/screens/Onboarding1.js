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

const LOCAL_CATEGORIES = [
  { id: '1', name: 'Bathroom', image: require('../assets/Images/Categories/Bathroom.png') },
  { id: '2', name: 'Bedroom', image: require('../assets/Images/Categories/Bedroom.png') },
  { id: '3', name: 'Crockery', image: require('../assets/Images/Categories/Crockery.png') },
  { id: '4', name: 'Decor', image: require('../assets/Images/Categories/Decor.png') },
  { id: '5', name: 'Electronics', image: require('../assets/Images/Categories/Electronics.png') },
  { id: '6', name: 'Furniture', image: require('../assets/Images/Categories/Furniture.png') },
  { id: '7', name: 'Kitchen', image: require('../assets/Images/Categories/Kitchen.png') },
  { id: '8', name: 'Lighting', image: require('../assets/Images/Categories/Lighting.png') },
];

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SIZES.padding * 2 - 16) / 2;

const Onboarding1 = ({ navigation }) => {
  const [selected, setSelected] = useState([]);

  const toggleCategory = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Step indicator */}
        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, styles.stepDotActive]} />
          <View style={styles.stepLine} />
          <View style={styles.stepDot} />
          <View style={styles.stepLine} />
          <View style={styles.stepDot} />
        </View>

        <FadeInView delay={100}>
          <Text style={styles.eyebrow}>PERSONALIZE</Text>
          <Text style={styles.title}>What do you{'\n'}need?</Text>
          <Text style={styles.subtitle}>
            Select categories and we'll curate items just for you
          </Text>
        </FadeInView>

        <FadeInView delay={300} style={styles.chipSection}>
          <ScrollView
            contentContainerStyle={styles.gridContainer}
            showsVerticalScrollIndicator={false}
          >
            {LOCAL_CATEGORIES.map((cat) => {
              const isSelected = selected.includes(cat.id);
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.card, isSelected && styles.cardActive]}
                  onPress={() => toggleCategory(cat.id)}
                  activeOpacity={0.8}
                >
                  <Image source={cat.image} style={styles.cardImage} resizeMode="cover" />
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
                      {cat.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </FadeInView>

        {/* Selection count */}
        {selected.length > 0 && (
          <FadeInView translateY={10}>
            <Text style={styles.selectionCount}>
              {selected.length} {selected.length === 1 ? 'category' : 'categories'} selected
            </Text>
          </FadeInView>
        )}

        <FadeInView delay={500} style={styles.footer}>
          <Button
            title="Continue"
            onPress={() =>
              navigation.navigate('Onboarding2', {
                selectedCategories: selected,
                selectedCategoryObjects: LOCAL_CATEGORIES.filter(c => selected.includes(c.id)),
              })
            }
            disabled={selected.length === 0}
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

export default Onboarding1;
