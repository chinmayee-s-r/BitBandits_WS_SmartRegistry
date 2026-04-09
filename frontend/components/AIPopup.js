import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../constants/colors';
import { Sparkles, X } from 'lucide-react-native'; // Assuming lucide-react-native is installed

const AIPopup = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.aiBadge}>
            <Sparkles size={16} color={COLORS.text} style={{ marginRight: 6 }} />
            <Text style={styles.aiText}>AI Stylist</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.message}>{product.aiMessage}</Text>

        {product.status === 'viewing' && (
          <Text style={styles.statusText}>👀 2 people are viewing this item</Text>
        )}

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Add to Registry</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiText: {
    fontSize: SIZES.fontSmall,
    fontWeight: '600',
    color: '#000',
  },
  closeBtn: {
    padding: 4,
  },
  productName: {
    fontSize: SIZES.fontMedium,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  message: {
    fontSize: SIZES.fontRegular,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  statusText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.warning,
    marginBottom: 20,
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: SIZES.fontRegular,
  },
});

export default AIPopup;
