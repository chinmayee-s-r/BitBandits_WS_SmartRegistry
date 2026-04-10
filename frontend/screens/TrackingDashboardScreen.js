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

const TrackingDashboardScreen = () => {
  const navigation = useNavigation();
  const { registryItems } = useRegistry();

  const metrics = useMemo(() => {
    const total = registryItems.length;
    const purchased = registryItems.filter(i => i.status === 'purchased').length;
    const pending = total - purchased;
    return { total, purchased, pending };
  }, [registryItems]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('ManageRegistry')} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Manage</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tracking</Text>
        <TouchableOpacity onPress={() => navigation.navigate('HomeHub')} style={styles.doneBtn}>
          <Text style={styles.doneBtnText}>Home</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Overview Metrics */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricBox}>
            <Text style={styles.metricVal}>{metrics.total}</Text>
            <Text style={styles.metricLabel}>Items</Text>
          </View>
          <View style={styles.dividerVertical} />
          <View style={styles.metricBox}>
            <Text style={[styles.metricVal, { color: COLORS.danger }]}>{metrics.purchased}</Text>
            <Text style={styles.metricLabel}>Purchased</Text>
          </View>
          <View style={styles.dividerVertical} />
          <View style={styles.metricBox}>
            <Text style={[styles.metricVal, { color: COLORS.success }]}>{metrics.pending}</Text>
            <Text style={styles.metricLabel}>Pending</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Item Status Timeline</Text>

        {registryItems.length === 0 ? (
          <View style={styles.emptyState}>
             <Text style={styles.emptyText}>No items to track yet.</Text>
          </View>
        ) : (
          registryItems.map(item => (
            <View key={item.id} style={styles.itemCard}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                
                {item.status === 'purchased' ? (
                  <View style={styles.statusContent}>
                    <Text style={styles.purchasedText}>✓ Purchased by Guest</Text>
                    <Text style={styles.etaText}>Delivery ETA: TBD</Text>
                  </View>
                ) : item.status === 'viewing' || item.status === 'reserved' ? (
                  <View style={styles.statusContent}>
                    <Text style={styles.pendingText}>⏳ In a guest's cart</Text>
                  </View>
                ) : (
                  <View style={styles.statusContent}>
                    <Text style={styles.availableText}>Available</Text>
                  </View>
                )}
              </View>
            </View>
          ))
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
    width: 80,
  },
  backBtnText: {
    fontSize: SIZES.fontRegular,
    color: '#007AFF', // iOS blue style
    fontWeight: '400',
  },
  headerTitle: {
    fontSize: SIZES.fontMedium,
    fontWeight: '600',
    color: COLORS.text,
  },
  doneBtn: {
    paddingVertical: 8,
    width: 80,
    alignItems: 'flex-end',
  },
  doneBtnText: {
    fontSize: SIZES.fontRegular,
    color: '#007AFF',
    fontWeight: '600',
  },
  scrollContent: {
    padding: SIZES.padding,
    paddingBottom: 80,
  },
  metricsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    paddingVertical: SIZES.xl,
    paddingHorizontal: SIZES.padding,
    marginBottom: 32,
    ...SHADOWS.small,
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerVertical: {
    width: 1,
    backgroundColor: COLORS.borderLight,
    height: '80%',
    alignSelf: 'center',
  },
  metricVal: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.fontRegular,
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
    width: 60,
    height: 60,
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
    marginBottom: 6,
  },
  statusContent: {
    marginTop: 2,
  },
  purchasedText: {
    fontSize: SIZES.fontSmall,
    fontWeight: '600',
    color: COLORS.danger,
    marginBottom: 2,
  },
  etaText: {
    fontSize: SIZES.fontMicro,
    color: COLORS.textSecondary,
  },
  pendingText: {
    fontSize: SIZES.fontSmall,
    fontWeight: '500',
    color: COLORS.warning,
  },
  availableText: {
    fontSize: SIZES.fontSmall,
    fontWeight: '500',
    color: COLORS.success,
  }
});

export default TrackingDashboardScreen;
