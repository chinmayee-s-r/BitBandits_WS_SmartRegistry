import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { COLORS, SIZES } from '../constants/colors';
import InputField from '../components/InputField';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import FadeInView from '../components/FadeInView';

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

const RegisterStep3 = ({ navigation }) => {
  const [street, setStreet] = useState('');
  const [aptSuite, setAptSuite] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [showStates, setShowStates] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Back button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>

            <ProgressBar step={3} totalSteps={3} />

            <FadeInView delay={100}>
              <Text style={styles.title}>Shipping{'\n'}address</Text>
              <Text style={styles.subtitle}>
                Where should gifts be delivered?
              </Text>
            </FadeInView>

            <FadeInView delay={250} style={styles.form}>
              <InputField
                label="Street Address"
                placeholder="123 Main Street"
                value={street}
                onChangeText={setStreet}
              />
              <InputField
                label="Apt / Suite (optional)"
                placeholder="Apt 4B"
                value={aptSuite}
                onChangeText={setAptSuite}
              />
              <InputField
                label="City"
                placeholder="San Francisco"
                value={city}
                onChangeText={setCity}
              />

              {/* State selector */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>STATE</Text>
                <TouchableOpacity
                  style={styles.selector}
                  onPress={() => setShowStates(!showStates)}
                >
                  <Text
                    style={[
                      styles.selectorText,
                      !state && styles.placeholder,
                    ]}
                  >
                    {state || 'Select state'}
                  </Text>
                  <Text style={styles.chevron}>{showStates ? '▲' : '▼'}</Text>
                </TouchableOpacity>

                {showStates && (
                  <ScrollView
                    style={styles.stateGrid}
                    nestedScrollEnabled
                  >
                    <View style={styles.stateGridInner}>
                      {US_STATES.map((s) => (
                        <TouchableOpacity
                          key={s}
                          style={[
                            styles.statePill,
                            state === s && styles.statePillActive,
                          ]}
                          onPress={() => {
                            setState(s);
                            setShowStates(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.statePillText,
                              state === s && styles.statePillTextActive,
                            ]}
                          >
                            {s}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                )}
              </View>

              <InputField
                label="Zip Code"
                placeholder="94102"
                value={zip}
                onChangeText={setZip}
                keyboardType="numeric"
              />
            </FadeInView>

            <FadeInView delay={400} style={styles.footer}>
              <Button
                title="Complete Registration"
                onPress={() => navigation.navigate('Onboarding1')}
              />
            </FadeInView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  backArrow: {
    fontSize: 24,
    color: COLORS.text,
    fontWeight: '300',
  },
  title: {
    fontSize: SIZES.fontLarge,
    fontWeight: '200',
    color: COLORS.text,
    marginBottom: 12,
    letterSpacing: -0.3,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: SIZES.fontRegular,
    color: COLORS.textSecondary,
    marginBottom: 40,
    fontWeight: '400',
  },
  form: {
    flex: 1,
  },
  fieldGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: SIZES.fontCaption,
    color: COLORS.textSecondary,
    marginBottom: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  selector: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    paddingHorizontal: 16,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorText: {
    fontSize: SIZES.fontRegular,
    color: COLORS.text,
  },
  placeholder: {
    color: COLORS.textTertiary,
  },
  chevron: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  stateGrid: {
    maxHeight: 180,
    marginTop: 8,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
  },
  stateGridInner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statePill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: SIZES.radiusSm,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  statePillActive: {
    backgroundColor: COLORS.text,
    borderColor: COLORS.text,
  },
  statePillText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.text,
    fontWeight: '500',
  },
  statePillTextActive: {
    color: COLORS.white,
  },
  footer: {
    paddingBottom: 24,
    paddingTop: 16,
  },
});

export default RegisterStep3;
