import React, { useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Dimensions, Platform } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/colors';

const { width: screenWidth } = Dimensions.get('window');

const ProductCard = ({ product, onPress, index = 0 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;

  const nd = Platform.OS !== 'web';

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: nd,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        delay: index * 100,
        useNativeDriver: nd,
      }),
    ]).start();
  }, []);

  const getStatusColor = () => {
    switch (product.status) {
      case 'available':
        return COLORS.success;
      case 'viewing':
        return COLORS.warning;
      case 'purchased':
        return COLORS.danger;
      default:
        return COLORS.success;
    }
  };

  const getStatusLabel = () => {
    switch (product.status) {
      case 'available':
        return 'Available';
      case 'viewing':
        return `${product.viewers || 2} viewing`;
      case 'purchased':
        return 'Gifted';
      default:
        return '';
    }
  };

  // Responsive card width
  const isTablet = screenWidth >= 768;
  const isDesktop = screenWidth >= 1024;
  const numCols = isDesktop ? 3 : isTablet ? 2 : 1;
  const gap = SIZES.xl;
  const containerPadding = SIZES.padding * 2;
  const maxWidth = 720;
  const availableWidth = Math.min(screenWidth, maxWidth) - containerPadding;
  const cardWidth = numCols === 1
    ? availableWidth
    : (availableWidth - gap * (numCols - 1)) / numCols;

  return (
    <Animated.View
      style={[
        { opacity: fadeAnim, transform: [{ translateY }] },
        { width: numCols === 1 ? '100%' : cardWidth, marginBottom: gap },
      ]}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.92}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
          {product.status === 'viewing' && (
            <View style={styles.viewingBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.viewingText}>{product.viewers || 2} viewing</Text>
            </View>
          )}
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.topRow}>
            <Text style={styles.name} numberOfLines={1}>
              {product.name}
            </Text>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price}</Text>
            {product.rating > 0 && (
              <View style={styles.ratingContainer}>
                <Text style={styles.starIcon}>★</Text>
                <Text style={styles.ratingText}>
                  {product.rating} <Text style={styles.reviewsText}>({product.reviews || product.reviews_count || 0})</Text>
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F8F8FA',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  viewingBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: SIZES.radiusFull,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.warning,
    marginRight: 6,
  },
  viewingText: {
    fontSize: SIZES.fontMicro,
    color: COLORS.text,
    fontWeight: '500',
  },
  infoContainer: {
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: SIZES.fontSmall,
    color: COLORS.text,
    fontWeight: '400',
    flex: 1,
    paddingRight: 8,
    letterSpacing: 0.1,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: SIZES.fontRegular,
    fontWeight: '600',
    color: COLORS.text,
    letterSpacing: 0.2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    color: '#FFD700', // Gold color for star
    fontSize: SIZES.fontSmall,
    marginRight: 4,
  },
  ratingText: {
    fontSize: SIZES.fontCaption,
    color: COLORS.text,
    fontWeight: '500',
  },
  reviewsText: {
    color: COLORS.textTertiary,
    fontWeight: '400',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default ProductCard;
