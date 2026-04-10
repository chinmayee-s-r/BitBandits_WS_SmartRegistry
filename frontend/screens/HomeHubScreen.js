import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const HomeHubScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim1 = useRef(new Animated.Value(20)).current;
  const slideAnim2 = useRef(new Animated.Value(20)).current;
  const slideAnim3 = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.stagger(150, [
        Animated.timing(slideAnim1, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim2, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim3, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [fadeAnim, slideAnim1, slideAnim2, slideAnim3]);

  const Card = ({ title, description, onPress, animValue, style }) => (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: animValue }],
        },
        style,
      ]}
    >
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.65}
        onPress={onPress}
      >
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <Text style={styles.greeting}>Welcome back</Text>
        <Text style={styles.subtext}>What would you like to do today?</Text>
      </Animated.View>

      <View style={styles.content}>
        <Card
          title="Create a registry"
          description="Build your registry with personalized recommendations"
          onPress={() => navigation.navigate('Onboarding1')}
          animValue={slideAnim1}
        />

        <Card
          title="Manage my registry"
          description="View, edit, and track your registry"
          onPress={() => navigation.navigate('RegistryScreen')}
          animValue={slideAnim2}
        />

        <Card
          title="Find a registry"
          description="Search and purchase gifts for someone"
          onPress={() => navigation.navigate('FindRegistry')}
          animValue={slideAnim3}
          style={styles.guestCard}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    paddingHorizontal: 32,
    paddingTop: 80, // Generous top spacing
    paddingBottom: 48,
  },
  greeting: {
    fontSize: 34,
    fontWeight: '300',
    color: '#1C1C1E',
    letterSpacing: 0.3,
    marginBottom: 12,
  },
  subtext: {
    fontSize: 17,
    color: '#8E8E93',
    fontWeight: '400',
    letterSpacing: 0.1,
  },
  content: {
    paddingHorizontal: 24,
  },
  cardContainer: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14, 
    paddingVertical: 32,
    paddingHorizontal: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.015)',
  },
  cardTitle: {
    fontSize: 21,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  cardDescription: {
    fontSize: 15,
    color: '#8E8E93',
    lineHeight: 22,
    fontWeight: '400',
  },
  guestCard: {
    marginTop: 24, // Slightly separated (guest journey)
  },
});

export default HomeHubScreen;
