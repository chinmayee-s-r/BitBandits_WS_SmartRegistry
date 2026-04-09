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

const RegisterStep1 = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

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

            <ProgressBar step={1} totalSteps={3} />

            <FadeInView delay={100}>
              <Text style={styles.title}>Create your{'\n'}account</Text>
              <Text style={styles.subtitle}>
                Let's get started with the basics
              </Text>
            </FadeInView>

            <FadeInView delay={250} style={styles.form}>
              <InputField
                label="Email Address"
                placeholder="name@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              <InputField
                label="Password"
                placeholder="Create a secure password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <InputField
                label="Phone Number"
                placeholder="(555) 000-0000"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </FadeInView>

            <FadeInView delay={400} style={styles.footer}>
              <Button
                title="Continue"
                onPress={() => navigation.navigate('RegisterStep2')}
              />
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
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
  footer: {
    paddingBottom: 24,
    paddingTop: 16,
    alignItems: 'center',
  },
  cancelBtn: {
    paddingVertical: 8,
  },
  cancelText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.fontSmall,
    fontWeight: '500',
  },
});

export default RegisterStep1;
