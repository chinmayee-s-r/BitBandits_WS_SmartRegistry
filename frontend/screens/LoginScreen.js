import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { COLORS, SIZES } from '../constants/colors';
import InputField from '../components/InputField';
import Button from '../components/Button';
import FadeInView from '../components/FadeInView';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          <FadeInView delay={100}>
            <View style={styles.header}>
              <Text style={styles.title}>Welcome{'\n'}back</Text>
              <Text style={styles.subtitle}>
                Sign in to access your registry
              </Text>
            </View>
          </FadeInView>

          <FadeInView delay={250} style={styles.formContainer}>
            <InputField
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <InputField
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.forgotPass}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </FadeInView>

          <FadeInView delay={400} style={styles.footer}>
            <Button
              title="Sign In"
              onPress={() => navigation.navigate('Onboarding1')}
            />
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </FadeInView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
  header: {
    marginTop: 20,
    marginBottom: 48,
  },
  title: {
    fontSize: SIZES.fontLarge,
    fontWeight: '200',
    color: COLORS.text,
    letterSpacing: -0.3,
    lineHeight: 40,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: SIZES.fontRegular,
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
  formContainer: {
    flex: 1,
  },
  forgotPass: {
    alignSelf: 'flex-end',
    marginTop: -8,
  },
  forgotText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.fontSmall,
    fontWeight: '400',
  },
  footer: {
    paddingBottom: 24,
    paddingTop: 32,
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

export default LoginScreen;
