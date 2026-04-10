import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image, Platform, Modal, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SIZES, SHADOWS } from '../constants/colors';
import { AI_TAGS } from '../constants/mockData';

const AIPopup = ({ product, onClose }) => {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  const nd = Platform.OS !== 'web';

  useEffect(() => {
    if (product) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 22,
          stiffness: 200,
          useNativeDriver: nd,
        }),
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: nd,
        }),
      ]).start();
    }
  }, [product]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: nd,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: nd,
      }),
    ]).start(() => onClose());
  };

  if (!product) return null;

  const tag = AI_TAGS[product.aiTag] || AI_TAGS.perfect_match;
  const recommendedProduct = product.aiTag === 'pairs_well' ? {
    name: 'Matching Linen Napkins',
    price: 45,
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=200&q=80',
  } : null;

  return (
    <Modal transparent visible={!!product} animationType="none" onRequestClose={handleClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.container}>
          <Animated.View
            style={[styles.overlay, { opacity: overlayAnim }]}
          >
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={handleClose}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.sheet,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            {/* Handle bar */}
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>

            {/* AI Badge */}
            <View style={styles.aiBadge}>
              <Text style={styles.aiIcon}>✦</Text>
              <Text style={styles.aiLabel}>AI Stylist</Text>
            </View>

            {/* Product name */}
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>${product.price}</Text>

            {/* AI Tag */}
            <View style={[styles.tagContainer, { backgroundColor: tag.color + '12' }]}>
              <View style={[styles.tagDot, { backgroundColor: tag.color }]} />
              <Text style={[styles.tagText, { color: tag.color }]}>{tag.label}</Text>
            </View>

            {/* AI Message */}
            <Text style={styles.message}>{product.aiMessage}</Text>

            {/* Real-time viewers */}
            {product.viewers > 0 && (
              <View style={styles.viewerRow}>
                <Text style={styles.viewerIcon}>👁</Text>
                <Text style={styles.viewerText}>
                  {product.viewers} {product.viewers === 1 ? 'person is' : 'people are'} viewing this
                </Text>
              </View>
            )}

            {/* Recommended product */}
            {recommendedProduct && (
              <View style={styles.recommendedCard}>
                <Text style={styles.recommendedLabel}>You might also love</Text>
                <View style={styles.recommendedRow}>
                  <Image
                    source={{ uri: recommendedProduct.image }}
                    style={styles.recommendedImage}
                  />
                  <View style={styles.recommendedInfo}>
                    <Text style={styles.recommendedName}>{recommendedProduct.name}</Text>
                    <Text style={styles.recommendedPrice}>${recommendedProduct.price}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Action buttons */}
            <TouchableOpacity 
              style={styles.primaryAction}
              onPress={() => {
                onClose();
                navigation.navigate('ProductDetail', { product });
              }}
            >
              <Text style={styles.primaryActionText}>
                {product.status === 'purchased' ? 'View Alternatives' : 'View Full Details'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryAction} onPress={handleClose}>
              <Text style={styles.secondaryActionText}>Dismiss</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
  },
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.radiusXl,
    borderTopRightRadius: SIZES.radiusXl,
    padding: SIZES.xl,
    paddingBottom: 40,
    ...SHADOWS.sheet,
  },
  handleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiIcon: {
    fontSize: 14,
    marginRight: 6,
    color: COLORS.text,
  },
  aiLabel: {
    fontSize: SIZES.fontCaption,
    fontWeight: '600',
    color: COLORS.text,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  productName: {
    fontSize: SIZES.fontMedium,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: SIZES.fontRegular,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginBottom: 16,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: SIZES.radiusFull,
    marginBottom: 16,
  },
  tagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  tagText: {
    fontSize: SIZES.fontSmall,
    fontWeight: '500',
  },
  message: {
    fontSize: SIZES.fontRegular,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginBottom: 16,
  },
  viewerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.borderLight,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: SIZES.radius,
    marginBottom: 20,
  },
  viewerIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  viewerText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  recommendedCard: {
    backgroundColor: COLORS.borderLight,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 24,
  },
  recommendedLabel: {
    fontSize: SIZES.fontCaption,
    color: COLORS.textSecondary,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  recommendedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendedImage: {
    width: 52,
    height: 52,
    borderRadius: SIZES.radiusSm,
    backgroundColor: '#F0F0F0',
    marginRight: 12,
  },
  recommendedInfo: {
    flex: 1,
  },
  recommendedName: {
    fontSize: SIZES.fontSmall,
    color: COLORS.text,
    fontWeight: '500',
    marginBottom: 2,
  },
  recommendedPrice: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
  },
  primaryAction: {
    backgroundColor: COLORS.text,
    paddingVertical: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryActionText: {
    color: COLORS.white,
    fontWeight: '500',
    fontSize: SIZES.fontRegular,
    letterSpacing: 0.3,
  },
  secondaryAction: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  secondaryActionText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.fontSmall,
    fontWeight: '500',
  },
});

export default AIPopup;
