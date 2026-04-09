import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/colors';
import { CATEGORIES } from '../constants/mockData';
import Button from '../components/Button';
import FadeInView from '../components/FadeInView';

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
            contentContainerStyle={styles.chipContainer}
            showsVerticalScrollIndicator={false}
          >
            {CATEGORIES.map((cat) => {
              const isSelected = selected.includes(cat.id);
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.chip, isSelected && styles.chipActive]}
                  onPress={() => toggleCategory(cat.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.chipIcon}>{cat.icon}</Text>
                  <Text
                    style={[
                      styles.chipText,
                      isSelected && styles.chipTextActive,
                    ]}
                  >
                    {cat.name}
                  </Text>
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
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  chipActive: {
    backgroundColor: COLORS.text,
    borderColor: COLORS.text,
  },
  chipIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  chipText: {
    fontSize: SIZES.fontRegular,
    color: COLORS.text,
    fontWeight: '500',
  },
  chipTextActive: {
    color: COLORS.white,
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
