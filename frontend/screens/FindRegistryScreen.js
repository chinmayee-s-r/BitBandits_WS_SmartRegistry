import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { COLORS, SIZES } from '../constants/colors';
import FadeInView from '../components/FadeInView';
import { useRegistry } from '../context/RegistryContext';

const RECENT_SEARCHES = [
  "Richa's Wedding",
  "Housewarming"
];

// Simple Search Icon Component (to keep it dependency-free without vector-icons if not installed)
const SearchIcon = () => (
  <View style={styles.searchIconContainer}>
    <View style={styles.searchCircle} />
    <View style={styles.searchHandle} />
  </View>
);

const { width } = Dimensions.get('window');

const FindRegistryScreen = ({ navigation, route }) => {
  const { setUserRole, setSelectedRegistry } = useRegistry();
  const user_id = route?.params?.user_id || '';
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [registriesDB, setRegistriesDB] = useState([]);
  
  // Animation for focus state
  const focusAnim = useRef(new Animated.Value(0)).current;

  // Animation for list appearance
  const listAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fetch live registries from backend
    const loadRegistries = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/all-registries');
        const data = await res.json();
        if (data.registries) {
          setRegistriesDB(data.registries);
        }
      } catch (err) {
        console.error("Failed to fetch registries:", err);
      }
    };
    loadRegistries();
  }, []);

  useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false, // For borderColor/shadowColor interpolation
    }).start();
  }, [isFocused]);

  useEffect(() => {
    Animated.timing(listAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [query]);

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0,0,0,0)', 'rgba(0, 122, 255, 0.3)'],
  });

  const shadowOpacity = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.03, 0.08],
  });

  // Filter Logic
  const filteredSuggestions = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return registriesDB.filter(
      (reg) =>
        reg.name.toLowerCase().includes(lowerQuery) ||
        reg.id.toLowerCase().includes(lowerQuery)
    );
  }, [query, registriesDB]);

  const handleSelectRegistry = (registryId) => {
    console.log("Selected Registry:", registryId);
    setUserRole('guest');
    setSelectedRegistry(registryId);
    navigation.navigate('GuestRegistry', { user_id });
  };

  const handleRecentSearch = (searchText) => {
    setQuery(searchText);
    setIsFocused(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.content}>
          {/* Header */}
          <FadeInView delay={100} translateY={10} style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backText}>Cancel</Text>
            </TouchableOpacity>
            
            <View style={styles.headerTitleContainer}>
              <Text style={styles.title}>Find Registry</Text>
            </View>
            <View style={styles.headerRight} />
          </FadeInView>

          {/* Search Bar */}
          <FadeInView delay={150} translateY={15} style={{ zIndex: 10 }}>
            <Animated.View style={[
              styles.searchBarContainer,
              { borderColor, shadowOpacity }
            ]}>
              <SearchIcon />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name or registry ID"
                placeholderTextColor="#8E8E93"
                value={query}
                onChangeText={setQuery}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
              />
              {query.length > 0 && (
                <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
                  <View style={styles.clearCircle}>
                    <Text style={styles.clearText}>✕</Text>
                  </View>
                </TouchableOpacity>
              )}
            </Animated.View>
          </FadeInView>

          {/* Scrolling Content */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            <Animated.View style={{ opacity: listAnim }}>
              {/* Empty State / Recent */}
              {query.trim().length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.recentSectionTitle}>Recent Searches</Text>
                  {RECENT_SEARCHES.map((search, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.recentItem}
                      onPress={() => handleRecentSearch(search)}
                    >
                      <Text style={styles.historyIcon}>↺</Text>
                      <Text style={styles.recentText}>{search}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                /* Active Suggestions */
                <View style={styles.suggestionsContainer}>
                  {filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map((reg) => (
                      <TouchableOpacity
                        key={reg.id}
                        style={styles.registryCard}
                        onPress={() => handleSelectRegistry(reg.id)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.cardMain}>
                          <Text style={styles.registrantName}>{reg.name}</Text>
                          <Text style={styles.eventText}>
                            {reg.event}  ·  <Text style={styles.dateText}>{reg.date}</Text>
                          </Text>
                        </View>
                        <View style={styles.cardRight}>
                          <Text style={styles.idLabel}>ID</Text>
                          <Text style={styles.registryId}>{reg.id}</Text>
                        </View>
                      </TouchableOpacity>
                    ))
                  ) : (
                    /* No Results */
                    <View style={styles.noResultsBox}>
                      <Text style={styles.noResultsFace}>(·•᷄ࡇ•᷅ )</Text>
                      <Text style={styles.noResultsTitle}>No registries found</Text>
                      <Text style={styles.noResultsSub}>Try refining your search</Text>
                    </View>
                  )}
                </View>
              )}
            </Animated.View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
    paddingTop: Platform.OS === 'android' ? 24 : 8,
  },
  
  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    height: 44,
  },
  backButton: {
    height: '100%',
    justifyContent: 'center',
    width: 70,
  },
  backText: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '400',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  headerRight: {
    width: 70, // To center title properly
  },

  /* Search Bar (Pill) */
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24, // Pill shape
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1, // Will be animated
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
    fontWeight: '400',
    borderWidth: 0,
    outlineStyle: 'none', // Web fix
    padding: 0, 
    height: 24,
  },
  clearBtn: {
    padding: 4,
  },
  clearCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#C7C7CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  
  /* Mock Search Icon Component Styles */
  searchIconContainer: {
    marginRight: 10,
    width: 16,
    height: 16,
    position: 'relative',
  },
  searchCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#8E8E93',
  },
  searchHandle: {
    width: 1.5,
    height: 6,
    backgroundColor: '#8E8E93',
    position: 'absolute',
    bottom: -1,
    right: 0,
    transform: [{ rotate: '-45deg' }],
  },

  /* Scroll Content */
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 8,
  },

  /* Recent Searches */
  emptyState: {
    marginTop: 12,
  },
  recentSectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  historyIcon: {
    fontSize: 16,
    color: '#8E8E93',
    marginRight: 12,
  },
  recentText: {
    fontSize: 16,
    color: '#1C1C1E',
    fontWeight: '400',
  },

  /* Suggestions Results */
  suggestionsContainer: {
    gap: 12,
  },
  registryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  cardMain: {
    flex: 1,
    paddingRight: 12,
  },
  registrantName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  eventText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '400',
  },
  dateText: {
    color: '#1C1C1E', // Slight contrast inside gray
  },
  cardRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  idLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#A1A1A6',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  registryId: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1C1C1E',
    letterSpacing: 0.2,
  },

  /* No Results */
  noResultsBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noResultsFace: {
    fontSize: 32,
    color: '#D1D1D6',
    marginBottom: 16,
  },
  noResultsTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  noResultsSub: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '400',
  },
});

export default FindRegistryScreen;
