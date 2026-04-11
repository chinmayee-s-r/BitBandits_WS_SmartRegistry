import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SIZES, SHADOWS } from '../constants/colors';
import { useRegistry } from '../context/RegistryContext';
import Button from '../components/Button';

// Utility for creating a local guest UUID since they might be anonymous browsers
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const GuestRegistryScreen = ({ route }) => {
  const navigation = useNavigation();
  const { updateItemStatus, incrementContributors, selectedRegistry } = useRegistry();
  const [dbItems, setDbItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Modal and transaction states
  const passedUserId = route?.params?.user_id;
  const [guestId] = React.useState(passedUserId || generateUUID());
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [contribAmount, setContribAmount] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);

  const fetchGuestRegistry = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/my-registry?registry_id=${selectedRegistry || ''}`);
      const data = await res.json();
      if (data.items) {
        setDbItems(data.items);
      }
    } catch (err) {
      console.error("Failed to load guest registry:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchGuestRegistry();
  }, [selectedRegistry]);

  // Group items
  const groupedItems = useMemo(() => {
    return dbItems.reduce((acc, item) => {
      const sec = item.section || 'Essentials';
      if (!acc[sec]) acc[sec] = [];
      acc[sec].push(item);
      return acc;
    }, {});
  }, [dbItems]);

  const sections = ['Essentials', 'Nice to Have', 'Premium Picks'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE': return COLORS.success || '#34C759'; // Green
      case 'RESERVED': return '#FF9500'; // Amber (Hard lock)
      case 'PURCHASED': return COLORS.error || '#FF3B30'; // Red
      default: return '#34C759';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'AVAILABLE': return 'Available';
      case 'RESERVED': return 'Payment Pending';
      case 'PURCHASED': return 'Gifted';
      default: return 'Available';
    }
  };

  const handleBuyClick = async (item) => {
    // Attempt Hard Lock `/start-payment`
    try {
      const lockRes = await fetch(`http://127.0.0.1:5000/start-payment/${item.registry_item_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: guestId })
      });
      const lockData = await lockRes.json();
      
      if (!lockRes.ok) {
        Alert.alert("Item Unavailable", lockData.error || "Someone else is currently purchasing this item.");
        fetchGuestRegistry(); // refresh instantly
        return;
      }
      
      // Successfully locked
      setSelectedItem(item);
      setContribAmount('');
      setModalVisible(true);
    } catch (error) {
       Alert.alert("Error", "Could not connect to server to lock item.");
    }
  };

  const submitContribution = async () => {
    if (!selectedItem) return;
    const amountVal = parseFloat(contribAmount);
    if (isNaN(amountVal) || amountVal <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount to contribute.");
      return;
    }
    
    setIsProcessing(true);
    try {
      const payRes = await fetch(`http://127.0.0.1:5000/contribute/${selectedItem.registry_item_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          user_id: guestId,
          amount: amountVal
        })
      });

      const result = await payRes.json();
      if (!payRes.ok) {
        Alert.alert("Failed", result.error || "An error occurred during payment.");
      } else {
        Alert.alert("Success!", result.completed ? "Item fully gifted!" : "Your contribution was added successfully!");
        setModalVisible(false);
        fetchGuestRegistry(); // Re-sync after success
      }
    } catch (error) {
       Alert.alert("Error", "Network error processing payment.");
    } finally {
       setIsProcessing(false);
    }
  };

  const cancelPurchase = () => {
    setModalVisible(false);
    // Optional: we don't necessarily have an explicit "release-payment" endpoint, 
    // it will automatically expire after 5 mins via release_expired_locks on the next fetch,
    // but ideally we'd ping the backend to release the hard lock immediately.
    // The instructions note automatic expiry, so we'll just close modal.
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

        {dbItems.length === 0 && !loading ? (
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
                  const isPurchased = item.status === 'PURCHASED';
                  const isLocked = item.status === 'RESERVED';
                  
                  // Compute remaining safely
                  const required = parseFloat(item.required_amount) || item.price;
                  const contributed = parseFloat(item.total_contribution) || 0;
                  const remaining = Math.max(0, required - contributed);

                  return (
                    <View key={item.registry_item_id || item.id} style={styles.itemCard}>
                      <Image source={{ uri: item.image }} style={styles.itemImage} />
                      
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.itemPrice}>
                          ${item.price} {contributed > 0 ? `• $${contributed} raised` : ''}
                        </Text>
                        
                        {item.bought_by_names && item.bought_by_names.length > 0 && (
                          <Text style={styles.boughtByText}>
                            Bought by: {item.bought_by_names.join(', ')}
                          </Text>
                        )}

                        {isLocked && item.locked_by_name && (
                          <Text style={styles.boughtByText}>
                            Being viewed by: {item.locked_by_name}
                          </Text>
                        )}
                        
                        <View style={styles.statusBadge}>
                          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
                          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
                        </View>
                      </View>

                      {/* Action Button */}
                      <View style={styles.actionContainer}>
                        {isPurchased ? (
                          <TouchableOpacity style={[styles.actionBtn, styles.disabledBtn]} disabled>
                            <Text style={styles.disabledText}>Fully Gifted</Text>
                          </TouchableOpacity>
                        ) : isLocked && item.locked_by !== guestId ? (
                          <TouchableOpacity style={[styles.actionBtn, styles.disabledBtn]} disabled>
                            <Text style={styles.disabledText}>Pending</Text>
                          </TouchableOpacity>
                        ) : isLocked && item.locked_by === guestId ? (
                          <TouchableOpacity style={styles.buyBtn} onPress={() => { setSelectedItem(item); setModalVisible(true); }}>
                            <Text style={styles.buyText}>Resume</Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity style={styles.buyBtn} onPress={() => handleBuyClick(item)}>
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

      {/* Contribution Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={cancelPurchase}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <Text style={styles.modalTitle}>Contribute to {selectedItem.name}</Text>
                
                {(() => {
                   const r = parseFloat(selectedItem.required_amount) || selectedItem.price;
                   const c = parseFloat(selectedItem.total_contribution) || 0;
                   return (
                     <Text style={styles.modalSub}>
                        Remaining balance: <Text style={{fontWeight:'600'}}>${Math.max(0, r - c).toFixed(2)}</Text>
                     </Text>
                   );
                })()}

                <View style={styles.inputContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.amountInput}
                    keyboardType="numeric"
                    placeholder="0.00"
                    placeholderTextColor={COLORS.textTertiary}
                    value={contribAmount}
                    onChangeText={setContribAmount}
                    autoFocus
                  />
                </View>
                
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.modalCancelBtn} onPress={cancelPurchase} disabled={isProcessing}>
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.modalSubmitBtn} onPress={submitContribution} disabled={isProcessing}>
                    <Text style={styles.modalSubmitText}>{isProcessing ? "Processing..." : "Confirm Payment"}</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  },
  boughtByText: {
    fontSize: SIZES.fontMicro,
    color: COLORS.textSecondary,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.radiusLg,
    borderTopRightRadius: SIZES.radiusLg,
    padding: SIZES.xl,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: SIZES.fontMedium,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  modalSub: {
    fontSize: SIZES.fontRegular,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.text,
    paddingBottom: 8,
    marginBottom: 32,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: '500',
    color: COLORS.text,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '600',
    color: COLORS.text,
    padding: 0,
    margin: 0,
    outlineStyle: 'none', // Web fix
  },
  modalActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: COLORS.borderLight,
    borderRadius: SIZES.radiusFull,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: SIZES.fontRegular,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  modalSubmitBtn: {
    flex: 2,
    paddingVertical: 14,
    backgroundColor: COLORS.text,
    borderRadius: SIZES.radiusFull,
    alignItems: 'center',
  },
  modalSubmitText: {
    fontSize: SIZES.fontRegular,
    fontWeight: '600',
    color: COLORS.white,
  }
});

export default GuestRegistryScreen;
