import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, SIZES, SHADOWS } from '../constants/colors';

const BASE_URL = 'http://127.0.0.1:5000';

const MyRegistryDashboardScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  
  // Pick up user_id from route if passed down
  const user_id = route.params?.user_id || '';

  useEffect(() => {
    fetchMyRegistry();
  }, []);

  const fetchMyRegistry = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/my-registry?user_id=${user_id}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to load registry');
      }
      
      setItems(data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const metrics = useMemo(() => {
    const total = items.length;
    const purchased = items.filter(i => (i.status || '').toLowerCase() === 'purchased').length;
    const pending = total - purchased;
    return { total, purchased, pending };
  }, [items]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('HomeHub')} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Registry Items</Text>
        <View style={{ width: 60 }} />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.text} />
          <Text style={{ marginTop: 10, color: COLORS.textSecondary }}>Syncing with database...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={{ color: COLORS.danger, marginBottom: 12 }}>{error}</Text>
          <TouchableOpacity onPress={fetchMyRegistry} style={styles.retryBtn}>
            <Text style={{ color: '#fff' }}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Overview Metrics */}
          <View style={styles.metricsContainer}>
            <View style={styles.metricBox}>
              <Text style={styles.metricVal}>{metrics.total}</Text>
              <Text style={styles.metricLabel}>Total</Text>
            </View>
            <View style={styles.dividerVertical} />
            <View style={styles.metricBox}>
              <Text style={[styles.metricVal, { color: COLORS.danger }]}>{metrics.purchased}</Text>
              <Text style={styles.metricLabel}>Gifted</Text>
            </View>
            <View style={styles.dividerVertical} />
            <View style={styles.metricBox}>
              <Text style={[styles.metricVal, { color: COLORS.success }]}>{metrics.pending}</Text>
              <Text style={styles.metricLabel}>Pending</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Real-time Contributions</Text>

          {items.length === 0 ? (
            <View style={styles.emptyState}>
               <Text style={styles.emptyText}>No items found in your registry.</Text>
            </View>
          ) : (
            items.map(item => {
              const statusStr = (item.status && item.status.toLowerCase() !== 'available') 
                ? item.status.toUpperCase() 
                : 'AVAILABLE';
                
              const progressPct = item.required_amount > 0 
                ? Math.min((item.total_contribution / item.required_amount) * 100, 100) 
                : 0;

              return (
                <View key={item.registry_item_id} style={styles.itemCard}>
                  <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                    
                    <View style={styles.priceRow}>
                      <Text style={styles.priceText}>Target: ${item.required_amount.toFixed(2)}</Text>
                      {statusStr === 'PURCHASED' ? (
                        <Text style={styles.purchasedText}>Fully Funded ✓</Text>
                      ) : (
                        <Text style={styles.statusText}>{statusStr}</Text>
                      )}
                    </View>
                    
                    {/* Progress Bar for Group Gifting / Contributions */}
                    <View style={styles.progressLabelRow}>
                      <Text style={styles.contribText}>${item.total_contribution.toFixed(2)} raised</Text>
                      <Text style={styles.pctText}>{Math.round(progressPct)}%</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
                    </View>

                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    color: '#007AFF', // iOS blue style
    fontWeight: '400',
  },
  headerTitle: {
    fontSize: SIZES.fontMedium,
    fontWeight: '600',
    color: COLORS.text,
  },
  retryBtn: {
    backgroundColor: COLORS.text,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20
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
    padding: 16,
    marginBottom: 14,
    alignItems: 'center',
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)'
  },
  itemImage: {
    width: 65,
    height: 65,
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
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  priceText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    fontWeight: '500'
  },
  statusText: {
    fontSize: SIZES.fontSmall,
    color: '#007AFF',
    fontWeight: '600',
  },
  purchasedText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.success,
    fontWeight: '700',
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  contribText: {
    fontSize: SIZES.fontMicro,
    color: COLORS.textSecondary,
    fontWeight: '500'
  },
  pctText: {
    fontSize: SIZES.fontMicro,
    color: COLORS.textSecondary,
    fontWeight: '700'
  },
  progressBarBg: {
    height: 6,
    backgroundColor: COLORS.borderLight,
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: 3,
  }
});

export default MyRegistryDashboardScreen;
