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
import { CATEGORIES, BUDGET_RANGES } from '../constants/mockData';
import Button from '../components/Button';
import FadeInView from '../components/FadeInView';

const Onboarding2 = ({ navigation, route }) => {
  const selectedCategories = route?.params?.selectedCategories || ['1', '2', '3'];
  const activeCats = CATEGORIES.filter((c) =>
    selectedCategories.includes(c.id)
  );

  // Budget per category
  const [budgets, setBudgets] = useState(
    activeCats.reduce((acc, cat) => {
      acc[cat.id] = 2; // default index
      return acc;
    }, {})
  );

  const [activeTab, setActiveTab] = useState(activeCats[0]?.id || '1');

  const updateBudget = (catId, index) => {
    setBudgets((prev) => ({ ...prev, [catId]: index }));
  };

  const currentBudgetIndex = budgets[activeTab] ?? 2;
  const currentBudget = BUDGET_RANGES[currentBudgetIndex];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Step indicator */}
        <View style={styles.stepIndicator}>
          <View style={styles.stepDotDone} />
          <View style={[styles.stepLine, styles.stepLineDone]} />
          <View style={[styles.stepDot, styles.stepDotActive]} />
          <View style={styles.stepLine} />
          <View style={styles.stepDot} />
        </View>

        <FadeInView delay={100}>
          <Text style={styles.eyebrow}>BUDGET</Text>
          <Text style={styles.title}>Set your{'\n'}budget</Text>
          <Text style={styles.subtitle}>
            Define spending ranges for each category
          </Text>
        </FadeInView>

        {/* Category Tabs */}
        <FadeInView delay={250}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabScroll}
            contentContainerStyle={styles.tabContainer}
          >
            {activeCats.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.tab,
                  activeTab === cat.id && styles.tabActive,
                ]}
                onPress={() => setActiveTab(cat.id)}
              >
                <Text style={styles.tabIcon}>{cat.icon}</Text>
                <Text
                  style={[
                    styles.tabText,
                    activeTab === cat.id && styles.tabTextActive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </FadeInView>

        {/* Budget Display */}
        <FadeInView delay={400} style={styles.budgetSection}>
          <View style={styles.budgetDisplay}>
            <Text style={styles.budgetValue}>{currentBudget?.label}</Text>
            <Text style={styles.budgetFor}>
              for {activeCats.find((c) => c.id === activeTab)?.name}
            </Text>
          </View>

          {/* Budget options */}
          <View style={styles.optionsList}>
            {BUDGET_RANGES.map((range, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.optionRow,
                  currentBudgetIndex === i && styles.optionRowActive,
                ]}
                onPress={() => updateBudget(activeTab, i)}
                activeOpacity={0.7}
              >
                <View style={styles.optionLeft}>
                  <View
                    style={[
                      styles.radioOuter,
                      currentBudgetIndex === i && styles.radioOuterActive,
                    ]}
                  >
                    {currentBudgetIndex === i && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.optionText,
                      currentBudgetIndex === i && styles.optionTextActive,
                    ]}
                  >
                    {range.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </FadeInView>

        <FadeInView delay={600} style={styles.footer}>
          <Button
            title="Continue"
            onPress={() => navigation.navigate('Onboarding3')}
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
  tabScroll: {
    marginBottom: 32,
    flexGrow: 0,
  },
  tabContainer: {
    gap: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  tabActive: {
    backgroundColor: COLORS.text,
    borderColor: COLORS.text,
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  tabText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.text,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.white,
  },
  budgetSection: {
    flex: 1,
  },
  budgetDisplay: {
    alignItems: 'center',
    marginBottom: 36,
  },
  budgetValue: {
    fontSize: 36,
    fontWeight: '200',
    color: COLORS.text,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  budgetFor: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
  optionsList: {
    gap: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  optionRowActive: {
    borderColor: COLORS.text,
    backgroundColor: COLORS.white,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  radioOuterActive: {
    borderColor: COLORS.text,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.text,
  },
  optionText: {
    fontSize: SIZES.fontRegular,
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
  optionTextActive: {
    color: COLORS.text,
    fontWeight: '600',
  },
  footer: {
    paddingBottom: 24,
    paddingTop: 8,
  },
});

export default Onboarding2;
