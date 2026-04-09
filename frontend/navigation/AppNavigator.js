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
          contentStyle: { backgroundColor: '#F5F5F7' }
        }}
      >
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        
        {/* Registration Flow */}
        <Stack.Screen name="RegisterStep1" component={RegisterStep1} />
        <Stack.Screen name="RegisterStep2" component={RegisterStep2} />
        <Stack.Screen name="RegisterStep3" component={RegisterStep3} />
        
        {/* AI Onboarding Flow */}
        <Stack.Screen name="Onboarding1" component={Onboarding1} />
        <Stack.Screen name="Onboarding2" component={Onboarding2} />
        <Stack.Screen name="Onboarding3" component={Onboarding3} />
        <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
        
        {/* Main App */}
        <Stack.Screen name="RegistryScreen" component={RegistryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
