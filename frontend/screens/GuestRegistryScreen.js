import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SIZES, SHADOWS } from '../constants/colors';
import { useRegistry } from '../context/RegistryContext';
import Button from '../components/Button';

const GuestRegistryScreen = () => {
  const navigation = useNavigation();
  const { registryItems, updateItemStatus, incrementContributors } = useRegistry();

  // Group items
  const groupedItems = useMemo(() => {
    return registryItems.reduce((acc, item) => {
      const sec = item.section || 'Essentials';
      if (!acc[sec]) acc[sec] = [];
      acc[sec].push(item);
      return acc;
    }, {});
  }, [registryItems]);

  const sections = ['Essentials', 'Nice to Have', 'Premium Picks'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return COLORS.success;
      case 'viewing': return COLORS.warning;
      case 'reserved': return COLORS.accent;
      case 'purchased': return COLORS.textTertiary;
      default: return COLORS.success;
    }
  };

  const handleBuy = (item) => {
    updateItemStatus(item.id, 'purchased');
    Alert.alert("Thank you!", "You have successfully gifted this item.");
  };

  const handleContribute = (item) => {
    incrementContributors(item.id);
    Alert.alert("Contribution added!", "Thanks for chipping in.");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registry Details</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Welcome Banner */}
        <View style={styles.bannerContainer}>
          <Text style={styles.bannerTitle}>Welcome to the Registry</Text>
          <Text style={styles.bannerSub}>Help them build their dream setup by contributing or purchasing items below.</Text>
        </View>

        {registryItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>This registry is currently empty.</Text>
            <Text style={styles.emptySub}>Check back later!</Text>
          </View>
        ) : (
          sections.map(section => {
            const items = groupedItems[section];
            if (!items || items.length === 0) return null;

            return (
              <View key={section} style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>{section}</Text>
                
                {items.map(item => {
                  const isExpensive = item.price >= 200;
                  const isPurchased = item.status === 'purchased';
                  const isReserved = item.status === 'reserved';

                  return (
                    <View key={item.id} style={styles.itemCard}>
                      <Image source={{ uri: item.image }} style={styles.itemImage} />
                      
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.itemPrice}>${item.price} {item.contributors > 0 ? `• ${item.contributors} contributors` : ''}</Text>
                        
                        <View style={styles.statusBadge}>
                          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
                          <Text style={styles.statusText}>{isPurchased ? 'Gifted' : (isReserved ? 'In cart' : 'Available')}</Text>
                        </View>
                      </View>

                      {/* Action Button */}
                      <View style={styles.actionContainer}>
                        {isPurchased ? (
                          <TouchableOpacity style={[styles.actionBtn, styles.disabledBtn]} disabled>
                            <Text style={styles.disabledText}>Gifted</Text>
                          </TouchableOpacity>
                        ) : isReserved ? (
                          <View style={styles.reservedBox}>
                            <Text style={styles.reservedText}>In Cart</Text>
                          </View>
                        ) : isExpensive ? (
                          <TouchableOpacity style={styles.contributeBtn} onPress={() => handleContribute(item)}>
                            <Text style={styles.contributeText}>Contribute</Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity style={styles.buyBtn} onPress={() => handleBuy(item)}>
                            <Text style={styles.buyText}>Buy</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  backBtn: {
    paddingVertical: 8,
    width: 60,
  },
  backBtnText: {
    fontSize: SIZES.fontRegular,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: SIZES.fontMedium,
    fontWeight: '600',
    color: COLORS.text,
  },
  scrollContent: {
    padding: SIZES.padding,
    paddingBottom: 80,
  },
  bannerContainer: {
    backgroundColor: COLORS.white,
    padding: SIZES.xl,
    borderRadius: SIZES.radiusLg,
    marginBottom: 24,
    ...SHADOWS.small,
  },
  bannerTitle: {
    fontSize: SIZES.fontMedium,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  bannerSub: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: SIZES.fontMedium,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: SIZES.fontRegular,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
    marginLeft: 4,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: SIZES.radiusSm,
    backgroundColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: SIZES.fontRegular,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: SIZES.fontSmall,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.borderLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: SIZES.radiusFull,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: SIZES.fontMicro,
    fontWeight: '600',
    color: COLORS.text,
  },
  actionContainer: {
    marginLeft: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  buyBtn: {
    backgroundColor: COLORS.text,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: SIZES.radiusFull,
    width: '100%',
    alignItems: 'center',
  },
  buyText: {
    color: COLORS.white,
    fontSize: SIZES.fontSmall,
    fontWeight: '600',
  },
  contributeBtn: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.text,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: SIZES.radiusFull,
    width: '100%',
    alignItems: 'center',
  },
  contributeText: {
    color: COLORS.text,
    fontSize: SIZES.fontSmall,
    fontWeight: '600',
  },
  reservedBox: {
    backgroundColor: COLORS.borderLight,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: SIZES.radiusFull,
  },
  reservedText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.fontSmall,
    fontWeight: '500',
  },
  disabledBtn: {
    backgroundColor: COLORS.borderLight,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: SIZES.radiusFull,
    width: '100%',
    alignItems: 'center',
  },
  disabledText: {
    color: COLORS.textTertiary,
    fontSize: SIZES.fontSmall,
    fontWeight: '600',
  }
});

export default GuestRegistryScreen;
