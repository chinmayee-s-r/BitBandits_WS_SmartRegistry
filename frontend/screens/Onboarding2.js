import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { COLORS, SIZES } from '../constants/colors';
import Button from '../components/Button';

// Pseudo-slider using simple touchable areas since Expo doesn't have a built-in slider without adding `@react-native-community/slider`
const Onboarding2 = ({ navigation }) => {
  const [budgetIndex, setBudgetIndex] = useState(2);
  const budgets = ['$0 - $500', '$500 - $1,000', '$1,000 - $5,000', '$5,000+'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Set your budget</Text>
          <Text style={styles.subtitle}>Help us recommend items in your range</Text>
        </View>

        <View style={styles.sliderContainer}>
          <Text style={styles.budgetValue}>{budgets[budgetIndex]}</Text>
          
          <View style={styles.optionsList}>
            {budgets.map((b, i) => (
              <View key={i} style={styles.optRow}>
                <View style={[styles.dot, budgetIndex === i && styles.dotActive]} />
                <Text 
                  style={[styles.optText, budgetIndex === i && styles.optTextActive]}
                  onPress={() => setBudgetIndex(i)}
                >
                  {b}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Button title="Next Step" onPress={() => navigation.navigate('Onboarding3')} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, padding: SIZES.padding },
  header: { marginTop: 40, marginBottom: 40 },
  title: { fontSize: 32, fontWeight: '300', color: COLORS.text, marginBottom: 12 },
  subtitle: { fontSize: SIZES.fontRegular, color: COLORS.textSecondary },
  sliderContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  budgetValue: { fontSize: 48, fontWeight: '300', color: COLORS.text, marginBottom: 60, fontFamily: 'System' },
  optionsList: { width: '100%', alignItems: 'center' },
  optRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, width: 200 },
  dot: { width: 12, height: 12, borderRadius: 6, borderWidth: 1, borderColor: COLORS.border, marginRight: 16 },
  dotActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  optText: { fontSize: SIZES.fontMedium, color: COLORS.textSecondary },
  optTextActive: { color: COLORS.text, fontWeight: '600' },
  footer: { paddingBottom: 20 },
});

export default Onboarding2;
