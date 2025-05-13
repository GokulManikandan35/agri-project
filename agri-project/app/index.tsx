import { useEffect, useState } from "react";
import { Text, View, ActivityIndicator, StyleSheet, Image, StatusBar } from "react-native";
import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check if user is logged in
        const isAuthenticated = await AsyncStorage.getItem('userLoggedIn');
        
        if (isAuthenticated === 'true') {
          // Route to the tabbed layout instead of directly to Home screen
          router.replace('farmer/(tabs)/home');
        } else {
          // If not authenticated, check if PIN exists
          const userPin = await AsyncStorage.getItem('userPin');
          
          // Always go to login - it will either require PIN entry or PIN setup
          router.replace('farmer/auth/login');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        router.replace('farmer/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay for better UX
    const timer = setTimeout(checkAuthStatus, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Show loading screen while checking authentication
  return (
    <View style={styles.container}>
      {/* Use native StatusBar to ensure visibility */}
      <StatusBar 
        translucent={false}
        backgroundColor="#ffffff" 
        barStyle="dark-content" 
      />
      {/* Also use Expo's StatusBar for compatibility */}
      <ExpoStatusBar style="dark" />
      
      <Image 
        source={require('../assets/images/agri_logo.jpg')} 
        style={styles.logo}
        resizeMode="contain"
      />
      {isLoading && (
        <ActivityIndicator size="large" color="#4A8D3D" style={styles.loader} />
      )}
      <Text style={styles.text}>Welcome to Agri App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
  text: {
    marginTop: 16,
    fontSize: 22,
    fontWeight: '600',
    color: '#4A8D3D',
  }
});
