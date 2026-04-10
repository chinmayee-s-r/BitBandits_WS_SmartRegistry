import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator';
import { RegistryProvider } from './context/RegistryContext';

export default function App() {
  return (
    <RegistryProvider>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </RegistryProvider>
  );
}
