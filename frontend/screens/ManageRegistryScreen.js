import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SIZES, SHADOWS } from '../constants/colors';
import { useRegistry } from '../context/RegistryContext';
import Button from '../components/Button';

const ManageRegistryScreen = () => {
  const navigation = useNavigation();
  const { registryItems } = useRegistry();

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
      case 'purchased': return COLORS.danger;
      default: return COLORS.success;
    }
  };

  const getStatusText = (status) => {
    if (!status) return 'Available';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Registry</Text>
        <View style={{ width: 60 }} /> {/* to balance the flex row */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Top CTA */}
        <View style={styles.publishContainer}>
          <Text style={styles.publishTitle}>Ready to share?</Text>
          <Text style={styles.publishSub}>Publish your registry to make it visible to guests.</Text>
          <Button 
            title="Publish Registry" 
            onPress={() => navigation.navigate('PublishRegistry')} 
            style={{ marginBottom: 0, marginTop: 12 }}
          />
        </View>

        {registryItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Your registry is empty.</Text>
            <Text style={styles.emptySub}>Browse the catalog and add items you love!</Text>
            <Button 
              title="Browse Catalog" 
              type="secondary" 
              onPress={() => navigation.goBack()} 
              style={{ marginTop: 24 }}
            />
          </View>
        ) : (
          sections.map(section => {
            const items = groupedItems[section];
            if (!items || items.length === 0) return null;

            return (
              <View key={section} style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>{section}</Text>
                
                {items.map(item => (
                  <View key={item.id} style={styles.itemCard}>
                    <Image source={{ uri: item.image }} style={styles.itemImage} />
                    
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.itemPrice}>${item.price} <Text style={styles.itemQty}>• Qty: {item.quantity}</Text></Text>
                      
                      <View style={styles.statusBadge}>
                        <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
                        <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
                      </View>
                    </View>
                  </View>
                ))}
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
  publishContainer: {
    backgroundColor: COLORS.white,
    padding: SIZES.xl,
    borderRadius: SIZES.radiusLg,
    marginBottom: 24,
    ...SHADOWS.small,
  },
  publishTitle: {
    fontSize: SIZES.fontMedium,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  publishSub: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: SIZES.padding,
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
    textAlign: 'center',
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
  itemQty: {
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.borderLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
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
  }
});

export default ManageRegistryScreen;
