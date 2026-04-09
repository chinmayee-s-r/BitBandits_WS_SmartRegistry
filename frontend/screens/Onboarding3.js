import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { COLORS, SIZES } from '../constants/colors';
import { THEMES } from '../constants/mockData';
import Button from '../components/Button';

const { width } = Dimensions.get('window');
const cardSize = (width - SIZES.padding * 2 - 16) / 2;

const Onboarding3 = ({ navigation }) => {
  const [selectedTheme, setSelectedTheme] = useState(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Define your vibe</Text>
          <Text style={styles.subtitle}>Select the style that speaks to you</Text>
        </View>

        <ScrollView>
          <View style={styles.grid}>
            {THEMES.map(theme => {
              const isSelected = selectedTheme === theme.id;
              return (
                <TouchableOpacity
                  key={theme.id}
                  style={[styles.card, isSelected && styles.cardActive]}
                  onPress={() => setSelectedTheme(theme.id)}
                  activeOpacity={0.9}
                >
                  <Image source={{ uri: theme.image }} style={styles.image} />
                  <View style={styles.cardHeader}>
                    <Text style={styles.themeName}>{theme.name}</Text>
                  </View>
                  {isSelected && <View style={styles.overlay} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button 
            title="Curate My Registry" 
            onPress={() => navigation.navigate('LoadingScreen')} 
            style={{ opacity: selectedTheme ? 1 : 0.5 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, padding: SIZES.padding },
  header: { marginTop: 40, marginBottom: 30 },
  title: { fontSize: 32, fontWeight: '300', color: COLORS.text, marginBottom: 12 },
  subtitle: { fontSize: SIZES.fontRegular, color: COLORS.textSecondary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between' },
  card: { width: cardSize, aspectRatio: 0.8, borderRadius: SIZES.radius, overflow: 'hidden', backgroundColor: COLORS.white, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  cardActive: { borderWidth: 2, borderColor: COLORS.accent },
  image: { width: '100%', height: '100%' },
  cardHeader: { position: 'absolute', bottom: 0, width: '100%', padding: 12, backgroundColor: 'rgba(255,255,255,0.9)' },
  themeName: { fontSize: SIZES.fontRegular, fontWeight: '500', color: COLORS.text, textAlign: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(28,28,30,0.1)' },
  footer: { paddingTop: 20, paddingBottom: 20 },
});

export default Onboarding3;
