import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../constants/colors';
import InputField from '../components/InputField';
import Button from '../components/Button';

const RegisterStep1 = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Step 1 of 3</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '33%' }]} />
          </View>
        </View>

        <Text style={styles.title}>Create your account</Text>

        <View style={styles.form}>
          <InputField label="Email Address" placeholder="name@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <InputField label="Password" placeholder="Create a password" value={password} onChangeText={setPassword} secureTextEntry />
          <InputField label="Phone Number" placeholder="(555) 000-0000" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        </View>

        <View style={styles.footer}>
          <Button title="Continue" onPress={() => navigation.navigate('RegisterStep2')} />
          <TouchableOpacity onPress={() => navigation.goBack()}>
             <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
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
  footer: { paddingBottom: 20, alignItems: 'center' },
  cancelText: { color: COLORS.textSecondary, fontSize: SIZES.fontRegular, marginTop: 16 },
});

export default RegisterStep1;
