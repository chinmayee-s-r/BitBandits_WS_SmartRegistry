import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterStep1 from '../screens/RegisterStep1';
import RegisterStep2 from '../screens/RegisterStep2';
import RegisterStep3 from '../screens/RegisterStep3';
import Onboarding1 from '../screens/Onboarding1';
import Onboarding2 from '../screens/Onboarding2';
import Onboarding3 from '../screens/Onboarding3';
import LoadingScreen from '../screens/LoadingScreen';
import RegistryScreen from '../screens/RegistryScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F5F5F7' },
          animation: 'fade_from_bottom',
          animationDuration: 300,
        }}
      >
        {/* Landing */}
        <Stack.Screen
          name="Landing"
          component={LandingScreen}
          options={{ animation: 'fade' }}
        />

        {/* Auth */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="RegisterStep1" component={RegisterStep1} />
        <Stack.Screen name="RegisterStep2" component={RegisterStep2} />
        <Stack.Screen name="RegisterStep3" component={RegisterStep3} />

        {/* Onboarding */}
        <Stack.Screen name="Onboarding1" component={Onboarding1} />
        <Stack.Screen name="Onboarding2" component={Onboarding2} />
        <Stack.Screen name="Onboarding3" component={Onboarding3} />

        {/* AI Loading */}
        <Stack.Screen
          name="LoadingScreen"
          component={LoadingScreen}
          options={{ animation: 'fade', gestureEnabled: false }}
        />

        {/* Main Registry */}
        <Stack.Screen
          name="RegistryScreen"
          component={RegistryScreen}
          options={{ animation: 'fade', gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
