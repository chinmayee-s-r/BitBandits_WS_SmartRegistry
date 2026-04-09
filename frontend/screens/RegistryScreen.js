import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { COLORS, SIZES } from '../constants/colors';
import { PRODUCTS } from '../constants/mockData';
import ProductCard from '../components/ProductCard';
import AIPopup from '../components/AIPopup';

const RegistryScreen = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Group products by section
  const sections = ['Essentials', 'Nice to Have', 'Premium Picks'];

  const renderSection = (title) => {
    const sectionProducts = PRODUCTS.filter(p => p.section === title);
    if (sectionProducts.length === 0) return null;

    return (
      <View key={title} style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.grid}>
          {sectionProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onPress={() => setSelectedProduct(product)} 
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Registry</Text>
        <TouchableOpacity>
          <Text style={styles.headerAction}>Manage</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {sections.map(section => renderSection(section))}
      </ScrollView>

      {/* Using Modal to overlay but keep styling in AIPopup */}
      <Modal
        visible={!!selectedProduct}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedProduct(null)}
      >
        <AIPopup product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: SIZES.padding, 
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  headerTitle: { fontSize: 20, fontWeight: '400', color: COLORS.text, fontFamily: 'System' },
  headerAction: { fontSize: 16, color: COLORS.textSecondary },
  scrollContent: { padding: SIZES.padding, paddingBottom: 100 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 24, fontWeight: '300', color: COLORS.text, marginBottom: 20, fontFamily: 'System', letterSpacing: 0.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});

export default RegistryScreen;
