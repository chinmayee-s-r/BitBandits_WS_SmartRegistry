import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Platform,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/colors';
import { PRODUCTS } from '../constants/mockData';
import ProductCard from '../components/ProductCard';
import AIPopup from '../components/AIPopup';
import FadeInView from '../components/FadeInView';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

const BASE_URL = 'http://127.0.0.1:5000';

const SORT_OPTIONS = [
  { key: 'rating',     label: 'Top Rated'   },
  { key: 'price_asc',  label: 'Price ↑'     },
  { key: 'price_desc', label: 'Price ↓'     },
];

const ALL_CATEGORIES = [
  'Bathroom','Bedroom','Crockery','Decor',
  'Electronics','Furniture','Kitchen','Lighting',
];

// Map a backend product → shape expected by ProductCard
const mapProduct = (p) => ({
  id:       String(p.product_id ?? p.id ?? Math.random()),
  name:     p.name          || 'Untitled',
  price:    p.price         ?? 0,
  rating:   p.rating        ?? 0,
  reviews:  p.reviews_count ?? p.reviews ?? 0,
  category: p.category      || '',
  color:    p.color         || '',
  image:    p.image_url     || p.image || null,
  section:  p.section       || 'Essentials',
  status:   p.status        || 'available',
  tags:     p.tags          || [],
});

// ─── AI TAB ────────────────────────────────────────────
const AISuggestedTab = ({ items, onSelect }) => {
  const sections = ['Essentials', 'Nice to Have', 'Premium Picks'];

  const grouped = sections.reduce((acc, section) => {
    const sectionItems = items.filter((p) => p.section === section);
    if (sectionItems.length > 0) acc[section] = sectionItems;
    return acc;
  }, {});

  if (items.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>✦</Text>
        <Text style={styles.emptyTitle}>No AI suggestions yet</Text>
        <Text style={styles.emptyText}>Complete the onboarding to get your curated list.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.catalogContainer}>
        {Object.entries(grouped).map(([section, products]) => (
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
                  onPress={() => onSelect(product)}
                />
              ))}
            </View>
          </View>
        ))}
        <RegistryFooter />
      </View>
    </ScrollView>
  );
};

// ─── ALL PRODUCTS TAB ──────────────────────────────────
const AllProductsTab = ({ payload, onSelect }) => {
  // Pre-populate filters from onboarding payload
  const initCategories = payload?.category || [];
  const initBudget     = payload?.category_budget || {};

  const globalMin = initBudget && Object.keys(initBudget).length > 0
    ? Math.min(...Object.values(initBudget).map(v => (typeof v === 'object' ? v.min : 0)))
    : 0;
  const globalMax = initBudget && Object.keys(initBudget).length > 0
    ? Math.max(...Object.values(initBudget).map(v => (typeof v === 'object' ? v.max : 99999)))
    : 99999;

  const [selectedCats, setSelectedCats] = useState(initCategories);
  const [minPrice,     setMinPrice]     = useState(String(globalMin));
  const [maxPrice,     setMaxPrice]     = useState(String(globalMax === 99999 ? '' : globalMax));
  const [colorQuery,   setColorQuery]   = useState('');
  const [sortBy,       setSortBy]       = useState('rating');

  const [loading,  setLoading]  = useState(false);
  const [products, setProducts] = useState([]);
  const [count,    setCount]    = useState(0);
  const [error,    setError]    = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const body = {
        category:        selectedCats,
        category_budget: initBudget,
        color:           colorQuery.trim(),
        min_price:       parseInt(minPrice, 10)  || 0,
        max_price:       parseInt(maxPrice,  10) || 99999,
        sort_by:         sortBy,
      };
      const res  = await fetch(`${BASE_URL}/all-products`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Server ${res.status}`);
      }
      const data = await res.json();
      setProducts((data.items || []).map(mapProduct));
      setCount(data.count || 0);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [selectedCats, minPrice, maxPrice, colorQuery, sortBy]);

  // Fetch on mount
  useEffect(() => { fetchAll(); }, []);

  const toggleCat = (cat) => {
    setSelectedCats(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
      {/* ── Filter Panel ── */}
      <View style={styles.filterPanel}>

        {/* Categories */}
        <Text style={styles.filterLabel}>Categories</Text>
        <View style={styles.chipRow}>
          {ALL_CATEGORIES.map((cat) => {
            const active = selectedCats.includes(cat);
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => toggleCat(cat)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Price range */}
        <Text style={styles.filterLabel}>Price Range ($)</Text>
        <View style={styles.priceRow}>
          <TextInput
            style={styles.priceInput}
            placeholder="Min"
            placeholderTextColor={COLORS.textTertiary}
            value={minPrice}
            onChangeText={t => setMinPrice(t.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
          />
          <Text style={styles.priceDash}>–</Text>
          <TextInput
            style={styles.priceInput}
            placeholder="Max"
            placeholderTextColor={COLORS.textTertiary}
            value={maxPrice}
            onChangeText={t => setMaxPrice(t.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
          />
        </View>

        {/* Color */}
        <Text style={styles.filterLabel}>Color</Text>
        <TextInput
          style={styles.colorInput}
          placeholder="e.g. white, blue, grey…"
          placeholderTextColor={COLORS.textTertiary}
          value={colorQuery}
          onChangeText={setColorQuery}
        />

        {/* Sort */}
        <Text style={styles.filterLabel}>Sort by</Text>
        <View style={styles.chipRow}>
          {SORT_OPTIONS.map((opt) => {
            const active = sortBy === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setSortBy(opt.key)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Apply */}
        <TouchableOpacity style={styles.applyBtn} onPress={fetchAll} activeOpacity={0.8}>
          <Text style={styles.applyBtnText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>

      {/* ── Results ── */}
      <View style={styles.catalogContainer}>
        {error ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>⚠</Text>
            <Text style={styles.emptyTitle}>Could not load products</Text>
            <Text style={styles.emptyText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchAll}>
              <Text style={styles.retryBtnText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.text} />
            <Text style={styles.loadingText}>Loading inventory…</Text>
          </View>
        ) : products.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptyText}>Try adjusting your filters.</Text>
          </View>
        ) : (
          <>
            <View style={styles.resultHeader}>
              <Text style={styles.resultCount}>{count} products</Text>
            </View>
            <View style={styles.grid}>
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onPress={() => onSelect(product)}
                />
              ))}
            </View>
          </>
        )}
        <RegistryFooter />
      </View>
    </ScrollView>
  );
};

// ─── SHARED FOOTER ─────────────────────────────────────
const RegistryFooter = () => (
  <View style={styles.catalogFooter}>
    <View style={styles.footerDivider} />
    <Text style={styles.footerText}>Curated with intelligence</Text>
    <Text style={styles.footerSubtext}>Powered by Smart Registry AI</Text>
  </View>
);

// ─── MAIN SCREEN ───────────────────────────────────────
const RegistryScreen = ({ route }) => {
  const navigation = useNavigation();
  const [activeTab,      setActiveTab]      = useState('ai');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const headerFade = useRef(new Animated.Value(0)).current;
  const nd = Platform.OS !== 'web';

  // AI Suggested items (from LoadingScreen → /generate-registry)
  const rawItems = route?.params?.items;
  const aiItems  = rawItems && rawItems.length > 0
    ? rawItems.map(mapProduct)
    : PRODUCTS;

  // Full payload (needed to pre-populate All Products filters)
  const payload  = route?.params?.payload || null;

  const totalItems = aiItems.length;

  useEffect(() => {
    Animated.timing(headerFade, {
      toValue: 1, duration: 600, useNativeDriver: nd,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>

      {/* ── Header ── */}
      <Animated.View style={[styles.header, { opacity: headerFade }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Your Registry</Text>
            <Text style={styles.headerSubtitle}>{totalItems} AI picks</Text>
          </View>
          <TouchableOpacity 
            style={styles.manageBtn}
            onPress={() => navigation.navigate('ManageRegistry')}
          >
            <Text style={styles.manageBtnText}>Manage</Text>
          </TouchableOpacity>
        </View>

        {/* ── Tab Switcher ── */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'ai' && styles.tabActive]}
            onPress={() => setActiveTab('ai')}
          >
            <Text style={[styles.tabText, activeTab === 'ai' && styles.tabTextActive]}>
              ✦  AI Suggested
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.tabActive]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
              All Products
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* ── Content ── */}
      {activeTab === 'ai' ? (
        <AISuggestedTab items={aiItems} onSelect={setSelectedProduct} />
      ) : (
        <AllProductsTab payload={payload} onSelect={setSelectedProduct} />
      )}

      {/* ── Product Detail Modal ── */}
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

// ─── STYLES ────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  /* Header */
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

  /* Tab row */
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    paddingBottom: 12,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.text,
    borderColor: COLORS.text,
  },
  tabText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  tabTextActive: {
    color: COLORS.white,
  },

  /* Shared scroll */
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

  /* AI tab – sections */
  section:       { marginBottom: 40 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 },
  sectionTitle:  { fontSize: SIZES.fontMedium, fontWeight: '300', color: COLORS.text, letterSpacing: 0.2 },
  sectionCount:  { fontSize: SIZES.fontCaption, color: COLORS.textTertiary, fontWeight: '400' },

  /* Grid */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.base,
    justifyContent: 'space-between',
  },

  /* Filter panel */
  filterPanel: {
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.padding,
    marginTop: SIZES.xl,
    borderRadius: 14,
    padding: 16,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  filterLabel: {
    fontSize: SIZES.fontSmall,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  chipActive: {
    backgroundColor: COLORS.text,
    borderColor: COLORS.text,
  },
  chipText: {
    fontSize: SIZES.fontCaption,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  chipTextActive: {
    color: COLORS.white,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: SIZES.fontSmall,
    color: COLORS.text,
    backgroundColor: COLORS.background,
  },
  priceDash: {
    fontSize: SIZES.fontRegular,
    color: COLORS.textTertiary,
  },
  colorInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: SIZES.fontSmall,
    color: COLORS.text,
    backgroundColor: COLORS.background,
    marginBottom: 4,
  },
  applyBtn: {
    marginTop: 16,
    backgroundColor: COLORS.text,
    borderRadius: SIZES.radiusFull,
    paddingVertical: 12,
    alignItems: 'center',
  },
  applyBtnText: {
    color: COLORS.white,
    fontSize: SIZES.fontSmall,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  /* Result header */
  resultHeader: {
    marginBottom: 16,
  },
  resultCount: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    fontWeight: '400',
  },

  /* Loading / empty / error */
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 10,
  },
  emptyIcon:  { fontSize: 28, marginBottom: 4 },
  emptyTitle: { fontSize: SIZES.fontMedium, fontWeight: '400', color: COLORS.text },
  emptyText:  { fontSize: SIZES.fontSmall,  color: COLORS.textSecondary, textAlign: 'center' },
  retryBtn: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  retryBtnText: { fontSize: SIZES.fontSmall, color: COLORS.text, fontWeight: '500' },

  /* Footer */
  catalogFooter: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  footerDivider: {
    width: 40, height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 20,
  },
  footerText:    { fontSize: SIZES.fontSmall,  color: COLORS.textSecondary, fontWeight: '400', fontStyle: 'italic', marginBottom: 4 },
  footerSubtext: { fontSize: SIZES.fontCaption, color: COLORS.textTertiary,  fontWeight: '400' },
});

export default RegistryScreen;
