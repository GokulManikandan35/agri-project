import { useEffect, useRef, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';

export default function RootLayout() {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [lastActive, setLastActive] = useState(Date.now());

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    // When app comes to the foreground (from background)
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      const currentTime = Date.now();
      const timeDiff = currentTime - lastActive;
      
      // If more than 30 seconds have passed (adjust as needed)
      if (timeDiff > 30000) {
        const userLoggedIn = await AsyncStorage.getItem('userLoggedIn');
        
        if (userLoggedIn === 'true') {
          // Check if biometrics is available
          const compatible = await LocalAuthentication.hasHardwareAsync();
          const enrolled = await LocalAuthentication.isEnrolledAsync();
          
          if (compatible && enrolled) {
            try {
              const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Verify your identity to continue',
                fallbackLabel: 'Use PIN',
              });
              
              if (!result.success) {
                // If biometric auth fails, go to PIN screen
                router.navigate('/auth/login');
              }
            } catch (error) {
              console.error('Biometric auth error:', error);
              router.navigate('/auth/login');
            }
          } else {
            // No biometrics, go to PIN screen
            router.navigate('/auth/login');
          }
        }
      }
    } else if (nextAppState === 'background' || nextAppState === 'inactive') {
      // Save timestamp when app goes to background
      setLastActive(Date.now());
    }
    
    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ 
        headerShown: false, // This hides the header with the path
        animation: 'fade',
      }} />
    </>
  );
}
