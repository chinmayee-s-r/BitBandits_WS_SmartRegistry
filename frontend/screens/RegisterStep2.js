import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS, SIZES } from '../constants/colors';
import InputField from '../components/InputField';
import Button from '../components/Button';

const RegisterStep2 = ({ navigation }) => {
  const [eventType, setEventType] = useState('');
  const [eventDate, setEventDate] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Step 2 of 3</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '66%' }]} />
          </View>
        </View>

        <Text style={styles.title}>Event Details</Text>

        <View style={styles.form}>
          <InputField label="Event Type" placeholder="e.g. Wedding, Baby Shower" value={eventType} onChangeText={setEventType} />
          <InputField label="Event Date" placeholder="MM/DD/YYYY" value={eventDate} onChangeText={setEventDate} />
        </View>

        <View style={styles.footer}>
          <Button title="Continue" onPress={() => navigation.navigate('RegisterStep3')} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, padding: SIZES.padding },
  progressContainer: { marginBottom: 30, marginTop: 10 },
  progressText: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 8, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 1 },
  progressBar: { height: 2, backgroundColor: COLORS.border, width: '100%' },
  progressFill: { height: '100%', backgroundColor: COLORS.text },
  title: { fontSize: 28, fontWeight: '300', color: COLORS.text, marginBottom: 40 },
  form: { flex: 1 },
  footer: { paddingBottom: 20 },
});

export default RegisterStep2;
