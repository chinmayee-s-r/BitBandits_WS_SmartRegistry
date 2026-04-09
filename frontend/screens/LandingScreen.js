import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import { COLORS, SIZES } from '../constants/colors';
import Button from '../components/Button';

const LandingScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Smart Registry</Text>
          <Text style={styles.subtitle}>Build the perfect registry effortlessly</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button 
            title="Create Registry" 
            onPress={() => navigation.navigate('RegisterStep1')} 
          />
          <Button 
            title="Sign In" 
            type="secondary" 
            onPress={() => navigation.navigate('Login')} 
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: SIZES.padding,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: '300',
    fontFamily: 'System', // iOS default serif/System is clean
    color: COLORS.text,
    marginBottom: 16,
    letterSpacing: 1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: SIZES.fontRegular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  buttonContainer: {
    width: '100%',
    paddingBottom: 40,
  },
});

export default LandingScreen;
