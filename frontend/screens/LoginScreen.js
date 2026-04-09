import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../constants/colors';
import InputField from '../components/InputField';
import Button from '../components/Button';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Sign In</Text>
        </View>

        <View style={styles.formContainer}>
          <InputField label="Email Address" placeholder="Enter your email" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <InputField label="Password" placeholder="Enter your password" value={password} onChangeText={setPassword} secureTextEntry />
          <TouchableOpacity style={styles.forgotPass}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Button title="Sign In" onPress={() => navigation.navigate('Onboarding1')} />
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  keyboardView: { flex: 1, padding: SIZES.padding },
  header: { marginTop: 40, marginBottom: 40 },
  title: { fontSize: 28, fontWeight: '300', color: COLORS.text, letterSpacing: 0.5 },
  formContainer: { flex: 1 },
  forgotPass: { alignSelf: 'flex-end', marginTop: 8 },
  forgotText: { color: COLORS.textSecondary, fontSize: SIZES.fontSmall },
  footer: { paddingBottom: 20, alignItems: 'center' },
  backText: { color: COLORS.textSecondary, fontSize: SIZES.fontRegular, marginTop: 16 },
});

export default LoginScreen;
