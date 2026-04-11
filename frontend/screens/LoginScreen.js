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
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SIZES } from '../constants/colors';
import InputField from '../components/InputField';
import Button from '../components/Button';
import FadeInView from '../components/FadeInView';

const BASE_URL = 'http://127.0.0.1:5000';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    if (!email.trim()) {
      setErrorMsg('Please enter your email address');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`${BASE_URL}/login-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'User not found in our system');
      }

      // Success! Pass user_id mapping downwards ideally
      navigation.navigate('HomeHub', { user_id: data.user_id });
    } catch (err) {
      setErrorMsg(err.message || 'Error communicating with server');
    } finally {
      setLoading(false);
    }
  };

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
              onChangeText={(text) => {
                setEmail(text);
                setErrorMsg(''); // Clear error on typing
              }}
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

            {errorMsg ? (
              <Text style={styles.errorText}>{errorMsg}</Text>
            ) : null}
          </FadeInView>

          <FadeInView delay={400} style={styles.footer}>
            {loading ? (
              <ActivityIndicator size="large" color={COLORS.text} style={{ marginVertical: 10 }} />
            ) : (
              <Button
                title="Sign In"
                onPress={handleLogin}
              />
            )}
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => navigation.goBack()}
              disabled={loading}
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
  errorText: {
    color: 'red',
    marginTop: 12,
    fontSize: SIZES.fontSmall,
    textAlign: 'center',
  },
});

export default LoginScreen;
