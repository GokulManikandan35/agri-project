import { useEffect, useRef, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppState, AppStateStatus, Alert, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as Updates from 'expo-updates';

export default function RootLayout() {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [lastActive, setLastActive] = useState(Date.now());
  const [deleting, setDeleting] = useState(false);

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

  const handleDeleteAll = async () => {
    Alert.alert(
      "Delete All Data",
      "Are you sure you want to delete all data?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeleting(true);
            try {
              await axios.post('http://4.247.169.244:8080/clear_all_data/');
              await AsyncStorage.clear();
              Alert.alert("Success", "All data deleted.");
              // Reload the app
              await Updates.reloadAsync();
            } catch (error) {
              Alert.alert("Error", "Failed to delete data.");
            } finally {
              setDeleting(false);
            }
          }
        }
      ]
    );
  };

  return (
    <>
      <StatusBar style="dark" />
      {/* Delete Icon */}
      <View style={{
        position: 'absolute',
        top: 40,
        right: 24,
        zIndex: 1000,
      }}>
        <TouchableOpacity onPress={handleDeleteAll} disabled={deleting}>
          {deleting ? (
            <ActivityIndicator size="small" color="#e53935" />
          ) : (
            <Ionicons name="trash-outline" size={18} color="red" />
          )}
        </TouchableOpacity>
      </View>
      <Stack screenOptions={{ 
        headerShown: false, // This hides the header with the path
        animation: 'fade',
      }} />
    </>
  );
}
