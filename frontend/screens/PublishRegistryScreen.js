import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SIZES, SHADOWS } from '../constants/colors';
import Button from '../components/Button';
import { useRegistry } from '../context/RegistryContext';
import { ActivityIndicator, Alert } from 'react-native';

const BASE_URL = 'http://127.0.0.1:5000';

const PublishRegistryScreen = () => {
  const navigation = useNavigation();
  const { registryItems } = useRegistry();
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    setLoading(true);
    
    // Extract product IDs
    const productIds = registryItems.map(item => item.id);

    try {
      const res = await fetch(`${BASE_URL}/publish-registry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_ids: productIds,
          // registry_id can be passed here if available, 
          // but our backend securely grabs the latest one if omitted
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
         Alert.alert('Publish Error', data.error || 'Failed to publish registry.');
      } else {
         // Navigate to TrackingDashboard upon success
         navigation.navigate('TrackingDashboard');
      }
    } catch (err) {
      Alert.alert('Network Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Publish Registry</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Visibility Setting */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Visibility</Text>
          <Text style={styles.cardSub}>Allow guests to find your registry using your name or ID.</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Make Registry Public</Text>
            <Switch 
              value={isPublic} 
              onValueChange={setIsPublic} 
              trackColor={{ false: COLORS.borderLight, true: COLORS.success }}
            />
          </View>
        </View>

        {/* Invite Guests */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Invite Guests</Text>
          <Text style={styles.cardSub}>Share your registry directly with friends and family.</Text>
          
          <TouchableOpacity style={styles.inviteOption}>
            <View style={styles.inviteIcon}><Text style={styles.emoji}>📱</Text></View>
            <View style={styles.inviteInfo}>
              <Text style={styles.inviteTitle}>Sync Contacts</Text>
              <Text style={styles.inviteDesc}>Send SMS invites easily</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.inviteOption}>
            <View style={styles.inviteIcon}><Text style={styles.emoji}>✉️</Text></View>
            <View style={styles.inviteInfo}>
              <Text style={styles.inviteTitle}>Upload Email List</Text>
              <Text style={styles.inviteDesc}>Import a CSV of guest emails</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
          
          <View style={styles.divider} />

          <TouchableOpacity style={styles.inviteOption}>
            <View style={styles.inviteIcon}><Text style={styles.emoji}>🔗</Text></View>
            <View style={styles.inviteInfo}>
              <Text style={styles.inviteTitle}>Copy Share Link</Text>
              <Text style={styles.inviteDesc}>smartregistry.com/ryan-meera</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.text} style={{ marginVertical: 10 }} />
        ) : (
          <Button title="Confirm & Publish" onPress={handlePublish} />
        )}
      </View>
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
    paddingBottom: 40,
  },
  card: {
    backgroundColor: COLORS.white,
    padding: SIZES.xl,
    borderRadius: SIZES.radiusLg,
    marginBottom: 24,
    ...SHADOWS.small,
  },
  cardTitle: {
    fontSize: SIZES.fontMedium,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  cardSub: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  settingText: {
    fontSize: SIZES.fontRegular,
    color: COLORS.text,
    fontWeight: '500',
  },
  inviteOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  inviteIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emoji: {
    fontSize: 20,
  },
  inviteInfo: {
    flex: 1,
  },
  inviteTitle: {
    fontSize: SIZES.fontRegular,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  inviteDesc: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
  },
  arrow: {
    fontSize: 20,
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginLeft: 56, // Align with text
  },
  footer: {
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  }
});

export default PublishRegistryScreen;
