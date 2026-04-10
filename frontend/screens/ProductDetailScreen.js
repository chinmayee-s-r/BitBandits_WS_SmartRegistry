import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, SIZES, SHADOWS } from '../constants/colors';
import Button from '../components/Button';
import { useRegistry } from '../context/RegistryContext';

const ProductDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const product = route.params?.product;
  
  const { addItemToRegistry } = useRegistry();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ textAlign: 'center', marginTop: 50 }}>Product not found.</Text>
      </SafeAreaView>
    );
  }

  const handleAdd = () => {
    // Determine category based on price or hardcode for mock
    let category = 'Essentials';
    if (product.price > 200) category = 'Premium Picks';
    else if (product.price < 50) category = 'Nice to Have';

    addItemToRegistry({
      ...product,
      quantity,
      section: category,
      status: 'available', // initial status
      contributors: 0
    });
    navigation.goBack();
  };

  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => Math.max(1, q - 1));

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
        </View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>${product.price}</Text>

          <Text style={styles.description}>
            {product.description || "A beautifully crafted item perfect for your home. Made with premium materials to ensure lasting quality and timeless design."}
          </Text>

          {/* AI Insight */}
          <View style={styles.aiCard}>
             <View style={styles.aiHeader}>
                <Text style={styles.aiIcon}>✦</Text>
                <Text style={styles.aiLabel}>AI Stylist Insight</Text>
             </View>
             <Text style={styles.aiMessage}>
               {product.aiMessage || "This item pairs perfectly with your selected theme. It offers great durability and a neutral tone that matches any aesthetic."}
             </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        <View style={styles.quantitySelector}>
          <TouchableOpacity onPress={decrement} style={styles.qBtn}>
            <Text style={styles.qBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qText}>{quantity}</Text>
          <TouchableOpacity onPress={increment} style={styles.qBtn}>
            <Text style={styles.qBtnText}>+</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.btnWrapper}>
          <Button 
            title="Add to Registry" 
            onPress={handleAdd} 
            style={{ marginBottom: 0 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  backBtn: {
    paddingVertical: 4,
  },
  backBtnText: {
    fontSize: SIZES.fontRegular,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F8F8FA',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: SIZES.padding,
  },
  productName: {
    fontSize: SIZES.fontTitle,
    fontWeight: '300',
    color: COLORS.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  productPrice: {
    fontSize: SIZES.fontMedium,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 24,
  },
  description: {
    fontSize: SIZES.fontRegular,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginBottom: 32,
  },
  aiCard: {
    backgroundColor: COLORS.borderLight,
    padding: SIZES.xl,
    borderRadius: SIZES.radiusLg,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiIcon: {
    fontSize: 16,
    color: COLORS.text,
    marginRight: 6,
  },
  aiLabel: {
    fontSize: SIZES.fontCaption,
    fontWeight: '600',
    color: COLORS.text,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  aiMessage: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 24,
    ...SHADOWS.sheet,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.borderLight,
    borderRadius: SIZES.radius,
    marginRight: 16,
    paddingHorizontal: 4,
  },
  qBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qBtnText: {
    fontSize: 20,
    color: COLORS.text,
    fontWeight: '600',
  },
  qText: {
    fontSize: SIZES.fontRegular,
    fontWeight: '500',
    color: COLORS.text,
    minWidth: 20,
    textAlign: 'center',
  },
  btnWrapper: {
    flex: 1,
  }
});

export default ProductDetailScreen;
