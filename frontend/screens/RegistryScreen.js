import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/colors';
import { PRODUCTS } from '../constants/mockData';
import ProductCard from '../components/ProductCard';
import AIPopup from '../components/AIPopup';
import FadeInView from '../components/FadeInView';

const { width: screenWidth } = Dimensions.get('window');

const RegistryScreen = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const headerFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerFade, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const sections = ['Essentials', 'Nice to Have', 'Premium Picks'];
  const filters = ['All', ...sections];

  const getFilteredProducts = () => {
    if (activeFilter === 'All') return PRODUCTS;
    return PRODUCTS.filter((p) => p.section === activeFilter);
  };

  const filteredProducts = getFilteredProducts();
  const groupedBySection =
    activeFilter === 'All'
      ? sections.reduce((acc, section) => {
          const items = PRODUCTS.filter((p) => p.section === section);
          if (items.length > 0) acc[section] = items;
          return acc;
        }, {})
      : { [activeFilter]: filteredProducts };

  // Count stats
  const totalItems = PRODUCTS.length;
  const purchasedItems = PRODUCTS.filter((p) => p.status === 'purchased').length;
  const viewingItems = PRODUCTS.filter((p) => p.status === 'viewing').length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: headerFade }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Your Registry</Text>
            <Text style={styles.headerSubtitle}>
              {totalItems} items · {purchasedItems} gifted
            </Text>
          </View>
          <TouchableOpacity style={styles.manageBtn}>
            <Text style={styles.manageBtnText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Live activity bar */}
        {viewingItems > 0 && (
          <View style={styles.liveBar}>
            <View style={styles.livePulse} />
            <Text style={styles.liveText}>
              {viewingItems} {viewingItems === 1 ? 'item is' : 'items are'} being viewed right now
            </Text>
          </View>
        )}

        {/* Filter tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContainer}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterTab,
                activeFilter === filter && styles.filterTabActive,
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter && styles.filterTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Product catalog */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.catalogContainer}>
          {Object.entries(groupedBySection).map(([section, products]) => (
            <View key={section} style={styles.section}>
              <FadeInView delay={200}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{section}</Text>
                  <Text style={styles.sectionCount}>
                    {products.length} {products.length === 1 ? 'item' : 'items'}
                  </Text>
                </View>
              </FadeInView>

              <View style={styles.grid}>
                {products.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    onPress={() => setSelectedProduct(product)}
                  />
                ))}
              </View>
            </View>
          ))}

          {/* Footer text */}
          <View style={styles.catalogFooter}>
            <View style={styles.footerDivider} />
            <Text style={styles.footerText}>
              Curated with intelligence
            </Text>
            <Text style={styles.footerSubtext}>
              Powered by Smart Registry AI
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* AI Bottom Sheet */}
      <Modal
        visible={!!selectedProduct}
        transparent
        animationType="none"
        onRequestClose={() => setSelectedProduct(null)}
      >
        <AIPopup
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: SIZES.padding,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: SIZES.fontTitle,
    fontWeight: '300',
    color: COLORS.text,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
  manageBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  manageBtnText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.text,
    fontWeight: '500',
  },
  liveBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 10,
    marginHorizontal: SIZES.padding,
    marginBottom: 8,
    backgroundColor: COLORS.borderLight,
    borderRadius: SIZES.radius,
  },
  livePulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.warning,
    marginRight: 10,
  },
  liveText: {
    fontSize: SIZES.fontCaption,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  filterScroll: {
    flexGrow: 0,
    paddingBottom: 12,
  },
  filterContainer: {
    paddingHorizontal: SIZES.padding,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  filterTabActive: {
    backgroundColor: COLORS.text,
    borderColor: COLORS.text,
  },
  filterText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: COLORS.white,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  catalogContainer: {
    maxWidth: 720,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.xl,
  },
  section: {
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: SIZES.fontMedium,
    fontWeight: '300',
    color: COLORS.text,
    letterSpacing: 0.2,
  },
  sectionCount: {
    fontSize: SIZES.fontCaption,
    color: COLORS.textTertiary,
    fontWeight: '400',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.base,
    justifyContent: 'space-between',
  },
  catalogFooter: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  footerDivider: {
    width: 40,
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 20,
  },
  footerText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    fontWeight: '400',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: SIZES.fontCaption,
    color: COLORS.textTertiary,
    fontWeight: '400',
  },
});

export default RegistryScreen;
