import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/colors';

const ProductCard = ({ product, onPress }) => {
  const getStatusColor = () => {
    switch (product.status) {
      case 'available': return COLORS.success;
      case 'viewing': return COLORS.warning;
      case 'purchased': return COLORS.danger;
      default: return COLORS.success;
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
        </View>
        <Text style={styles.price}>${product.price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    marginBottom: 24,
    width: '48%', // Flexible grid layout
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    aspectRatio: 0.85,
    backgroundColor: '#F0F0F0',
  },
  infoContainer: {
    paddingVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: SIZES.fontSmall,
    color: COLORS.text,
    fontFamily: 'System',
    fontWeight: '400',
    flex: 1,
    paddingRight: 8,
    minHeight: 38,
  },
  price: {
    fontSize: SIZES.fontRegular,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  },
});

export default ProductCard;
