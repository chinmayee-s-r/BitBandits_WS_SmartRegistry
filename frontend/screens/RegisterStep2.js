import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/colors';
import { EVENT_TYPES } from '../constants/mockData';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import FadeInView from '../components/FadeInView';

const RegisterStep2 = ({ navigation }) => {
  const [eventType, setEventType] = useState(null);
  const [showEventPicker, setShowEventPicker] = useState(false);
  const [eventMonth, setEventMonth] = useState('');
  const [eventDay, setEventDay] = useState('');
  const [eventYear, setEventYear] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Back button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          <ProgressBar step={2} totalSteps={3} />

          <FadeInView delay={100}>
            <Text style={styles.title}>Tell us about{'\n'}your event</Text>
            <Text style={styles.subtitle}>
              This helps us personalize your registry
            </Text>
          </FadeInView>

          <FadeInView delay={250} style={styles.form}>
            {/* Event Type Selector */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>EVENT TYPE</Text>
              <TouchableOpacity
                style={styles.selector}
                onPress={() => setShowEventPicker(!showEventPicker)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.selectorText,
                    !eventType && styles.selectorPlaceholder,
                  ]}
                >
                  {eventType
                    ? EVENT_TYPES.find((e) => e.value === eventType)?.label
                    : 'Select event type'}
                </Text>
                <Text style={styles.chevron}>
                  {showEventPicker ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>

              {showEventPicker && (
                <View style={styles.dropdown}>
                  {EVENT_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      style={[
                        styles.dropdownItem,
                        eventType === type.value && styles.dropdownItemActive,
                      ]}
                      onPress={() => {
                        setEventType(type.value);
                        setShowEventPicker(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownText,
                          eventType === type.value && styles.dropdownTextActive,
                        ]}
                      >
                        {type.label}
                      </Text>
                      {eventType === type.value && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Event Date */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>EVENT DATE</Text>
              <View style={styles.dateRow}>
                <View style={styles.dateField}>
                  <TouchableOpacity style={styles.dateInput}>
                    <Text
                      style={[
                        styles.dateInputText,
                        !eventMonth && styles.selectorPlaceholder,
                      ]}
                    >
                      {eventMonth || 'Month'}
                    </Text>
                  </TouchableOpacity>
                  {/* Month pills */}
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.monthScroll}
                    contentContainerStyle={styles.monthScrollContent}
                  >
                    {[
                      'Jan',
                      'Feb',
                      'Mar',
                      'Apr',
                      'May',
                      'Jun',
                      'Jul',
                      'Aug',
                      'Sep',
                      'Oct',
                      'Nov',
                      'Dec',
                    ].map((m) => (
                      <TouchableOpacity
                        key={m}
                        style={[
                          styles.monthPill,
                          eventMonth === m && styles.monthPillActive,
                        ]}
                        onPress={() => setEventMonth(m)}
                      >
                        <Text
                          style={[
                            styles.monthPillText,
                            eventMonth === m && styles.monthPillTextActive,
                          ]}
                        >
                          {m}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.dateSmallFields}>
                  <View style={styles.dateSmallField}>
                    <TouchableOpacity
                      style={styles.dateInput}
                      onPress={() => {
                        const days = ['1', '15', '20', '25', '28'];
                        const idx = days.indexOf(eventDay);
                        setEventDay(
                          days[(idx + 1) % days.length]
                        );
                      }}
                    >
                      <Text
                        style={[
                          styles.dateInputText,
                          !eventDay && styles.selectorPlaceholder,
                        ]}
                      >
                        {eventDay || 'Day'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.dateSmallField}>
                    <TouchableOpacity
                      style={styles.dateInput}
                      onPress={() => {
                        const years = ['2026', '2027', '2028'];
                        const idx = years.indexOf(eventYear);
                        setEventYear(
                          years[(idx + 1) % years.length]
                        );
                      }}
                    >
                      <Text
                        style={[
                          styles.dateInputText,
                          !eventYear && styles.selectorPlaceholder,
                        ]}
                      >
                        {eventYear || 'Year'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </FadeInView>

          <FadeInView delay={400} style={styles.footer}>
            <Button
              title="Continue"
              onPress={() => navigation.navigate('RegisterStep3')}
            />
          </FadeInView>
        </View>
      </ScrollView>
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
    marginBottom: 32,
  },
  label: {
    fontSize: SIZES.fontCaption,
    color: COLORS.textSecondary,
    marginBottom: 10,
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
    fontWeight: '400',
  },
  selectorPlaceholder: {
    color: COLORS.textTertiary,
  },
  chevron: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  dropdown: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    marginTop: 4,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownItemActive: {
    backgroundColor: COLORS.borderLight,
  },
  dropdownText: {
    fontSize: SIZES.fontRegular,
    color: COLORS.text,
  },
  dropdownTextActive: {
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '600',
  },
  dateRow: {
    gap: 12,
  },
  dateField: {
    flex: 1,
  },
  dateInput: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  dateInputText: {
    fontSize: SIZES.fontRegular,
    color: COLORS.text,
    fontWeight: '400',
  },
  monthScroll: {
    marginTop: 12,
  },
  monthScrollContent: {
    gap: 8,
  },
  monthPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  monthPillActive: {
    backgroundColor: COLORS.text,
    borderColor: COLORS.text,
  },
  monthPillText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.text,
    fontWeight: '500',
  },
  monthPillTextActive: {
    color: COLORS.white,
  },
  dateSmallFields: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  dateSmallField: {
    flex: 1,
  },
  footer: {
    paddingBottom: 24,
    paddingTop: 16,
  },
});

export default RegisterStep2;
