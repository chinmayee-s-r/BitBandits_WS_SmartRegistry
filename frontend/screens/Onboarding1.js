import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, SIZES } from '../constants/colors';
import { CATEGORIES } from '../constants/mockData';
import Button from '../components/Button';

const Onboarding1 = ({ navigation }) => {
  const [selected, setSelected] = useState([]);

  const toggleCategory = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(item => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>What do you need?</Text>
          <Text style={styles.subtitle}>Select categories to help AI curate your list</Text>
        </View>

        <ScrollView contentContainerStyle={styles.chipContainer}>
          {CATEGORIES.map(cat => {
            const isSelected = selected.includes(cat.id);
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.chip, isSelected && styles.chipActive]}
                onPress={() => toggleCategory(cat.id)}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.footer}>
          <Button 
            title="Next Step" 
            onPress={() => navigation.navigate('Onboarding2')} 
            style={{ opacity: selected.length > 0 ? 1 : 0.5 }}
          />
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
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  chip: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 30, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.white },
  chipActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  chipText: { fontSize: SIZES.fontRegular, color: COLORS.text, fontWeight: '500' },
  chipTextActive: { color: COLORS.white },
  footer: { paddingBottom: 20 },
});

export default Onboarding1;
