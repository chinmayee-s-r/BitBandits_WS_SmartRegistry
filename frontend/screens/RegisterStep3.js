import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS, SIZES } from '../constants/colors';
import InputField from '../components/InputField';
import Button from '../components/Button';

const RegisterStep3 = ({ navigation }) => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Step 3 of 3</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '100%' }]} />
          </View>
        </View>

        <Text style={styles.title}>Shipping Address</Text>

        <View style={styles.form}>
          <InputField label="Address" placeholder="Street layout" value={address} onChangeText={setAddress} />
          <InputField label="City" placeholder="City" value={city} onChangeText={setCity} />
          <InputField label="Zip Code" placeholder="00000" value={zip} onChangeText={setZip} keyboardType="numeric" />
        </View>

        <View style={styles.footer}>
          <Button title="Complete Registration" onPress={() => navigation.navigate('Onboarding1')} />
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

export default RegisterStep3;
