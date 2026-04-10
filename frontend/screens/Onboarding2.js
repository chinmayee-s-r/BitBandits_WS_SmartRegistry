import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Keyboard,
  Animated,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/colors';
import Button from '../components/Button';
import FadeInView from '../components/FadeInView';
import InputField from '../components/InputField';

const CATEGORIES = [
  { id: '1', name: 'Bathroom', hint: 'Typical: $40–$200 per item' },
  { id: '2', name: 'Bedroom', hint: 'Typical: $50–$300 per item' },
  { id: '3', name: 'Crockery', hint: 'Typical: $30–$150 per set' },
  { id: '4', name: 'Decor', hint: 'Typical: $20–$150 per item' },
  { id: '5', name: 'Electronics', hint: 'Typical: $100–$800 per item' },
  { id: '6', name: 'Furniture', hint: 'Typical: $200–$1500 per piece' },
  { id: '7', name: 'Kitchen', hint: 'Typical: $50–$400 per item' },
  { id: '8', name: 'Lighting', hint: 'Typical: $40–$300 per fixture' },
];

const CategoryPriceRow = ({ category, value, onValueChange, index }) => {
  const enterAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(enterAnim, {
      toValue: 1,
      duration: 500,
      delay: index * 100, // Stagger rows
      useNativeDriver: true,
    }).start();
  }, [enterAnim, index]);

  return (
    <Animated.View
      style={[
        styles.rowCard,
        {
          opacity: enterAnim,
          transform: [
            {
              translateY: enterAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName} numberOfLines={1}>{category.name}</Text>
        <Text style={styles.categoryHint}>{category.hint}</Text>
      </View>

      <View style={styles.rangeContainer}>
        <InputField
          containerStyle={{ flex: 1, marginBottom: 0, width: 'auto' }}
          prefix="$"
          placeholder="Min"
          value={String(value?.min || '')}
          onChangeText={(t) => onValueChange(category.id, 'min', t.replace(/[^0-9]/g, ''))}
          keyboardType="numeric"
          returnKeyType="done"
          maxLength={5}
        />

        <Text style={styles.toText}>to</Text>

        <InputField
          containerStyle={{ flex: 1, marginBottom: 0, width: 'auto' }}
          prefix="$"
          placeholder="Max"
          value={String(value?.max || '')}
          onChangeText={(t) => onValueChange(category.id, 'max', t.replace(/[^0-9]/g, ''))}
          keyboardType="numeric"
          returnKeyType="done"
          maxLength={5}
        />
      </View>
    </Animated.View>
  );
};

const Onboarding2 = ({ navigation, route }) => {
  // Category IDs selected in Onboarding1
  const selectedCategories = route?.params?.selectedCategories || ['1', '4', '7'];
  // Category names (e.g. ["Kitchen", "Bedroom"]) – used as the API payload keys
  const selectedCategoryNames = route?.params?.selectedCategoryNames ||
    CATEGORIES.filter(c => selectedCategories.includes(c.id)).map(c => c.name);

  const activeCats = CATEGORIES.filter((c) => selectedCategories.includes(c.id));

  // prices is keyed by category NAME for direct use in API payload
  const [prices, setPrices] = useState(() =>
    activeCats.reduce((acc, cat) => {
      let defMin = '50', defMax = '300';
      if (cat.hint) {
        const matches = cat.hint.match(/\d+/g);
        if (matches && matches.length >= 2) {
          defMin = matches[0];
          defMax = matches[1];
        }
      }
      acc[cat.name] = { min: defMin, max: defMax };
      return acc;
    }, {})
  );

  const handleValueChange = useCallback((catId, type, newValue) => {
    // Find the category name from the ID
    const cat = CATEGORIES.find(c => c.id === catId);
    if (!cat) return;
    setPrices((prev) => ({
      ...prev,
      [cat.name]: { ...prev[cat.name], [type]: newValue }
    }));
  }, []);

  const handleSkip = () => {
    navigation.navigate('Onboarding3', {
      selectedCategoryNames,
      category_budget: {},
    });
  };

  const handleContinue = () => {
    // Convert string values to numbers
    const category_budget = {};
    Object.entries(prices).forEach(([name, range]) => {
      category_budget[name] = {
        min: parseInt(range.min, 10) || 0,
        max: parseInt(range.max, 10) || 0,
      };
    });
    navigation.navigate('Onboarding3', {
      selectedCategoryNames,
      category_budget,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <View style={styles.stepIndicator}>
            <View style={styles.stepDotDone} />
            <View style={[styles.stepLine, styles.stepLineDone]} />
            <View style={[styles.stepDot, styles.stepDotActive]} />
            <View style={styles.stepLine} />
            <View style={styles.stepDot} />
          </View>

          <FadeInView delay={100} style={styles.header}>
            <Text style={styles.title}>Set your price preferences</Text>
            <Text style={styles.subtitle}>
              Choose a comfortable range for each category
            </Text>
          </FadeInView>

          <View style={styles.listSection}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
              keyboardShouldPersistTaps="handled"
            >
              {activeCats.map((cat, idx) => (
                <CategoryPriceRow
                  key={cat.id}
                  category={cat}
                  value={prices[cat.name]}
                  onValueChange={handleValueChange}
                  index={idx}
                />
              ))}
            </ScrollView>
          </View>

          <FadeInView delay={600} style={styles.footer}>
            <Button title="Continue" onPress={handleContinue} />

            <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
              <Text style={styles.skipBtnText}>Skip for now</Text>
            </TouchableOpacity>
          </FadeInView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
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
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.border },
  stepDotDone: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.text },
  stepDotActive: { backgroundColor: COLORS.text, width: 10, height: 10, borderRadius: 5 },
  stepLine: { width: 32, height: 1, backgroundColor: COLORS.border, marginHorizontal: 8 },
  stepLineDone: { backgroundColor: COLORS.text },

  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: '#1C1C1E',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '400',
    lineHeight: 24,
  },

  listSection: {
    flex: 1,
  },
  listContainer: {
    gap: 16,
    paddingBottom: 24,
  },

  rowCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14, // Rounded (10-12)
    paddingVertical: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  categoryInfo: {
    marginBottom: 16,
  },
  categoryName: {
    fontSize: 19,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  categoryHint: {
    fontSize: 14,
    color: '#B0B0B5',
    fontWeight: '400',
  },

  rangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toText: {
    fontSize: 14,
    color: '#A1A1A6',
    fontWeight: '400',
    marginHorizontal: 8,
  },

  footer: {
    paddingBottom: 16,
    paddingTop: 8,
    alignItems: 'center',
    width: '100%',
  },
  skipBtn: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  skipBtnText: {
    fontSize: 15,
    color: '#A1A1A6',
    fontWeight: '500',
  },
});

export default Onboarding2;
