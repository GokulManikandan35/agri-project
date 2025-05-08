import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInDown, FadeOut } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from 'expo-local-authentication';

// Import components
import PasscodeDots from './components/PasscodeDots';
import Keypad from './components/Keypad';
import BiometricButton from './components/BiometricButton';
import EmailLoginForm from './components/EmailLoginForm';
import ToggleLoginButton from './components/ToggleLoginButton';
import SignupLink from './components/SignupLink';

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("farmer"); // Default to farmer login
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(true);
  const [pinCode, setPinCode] = useState('');
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [confirmPin, setConfirmPin] = useState('');
  const [storedPin, setStoredPin] = useState('');
  const [lastLoggedInUser, setLastLoggedInUser] = useState(null);
  const [isPinLogin, setIsPinLogin] = useState(true);

  useEffect(() => {
    checkBiometricAvailability();
    checkLastLoggedInUser();
    checkPinExists();
  }, []);

  const checkBiometricAvailability = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setIsBiometricAvailable(compatible && enrolled);
  };

  const checkLastLoggedInUser = async () => {
    try {
      const lastUserType = await AsyncStorage.getItem("userType");
      
      if (lastUserType) {
        setLastLoggedInUser({
          type: lastUserType
        });
        setUserType(lastUserType);
      }
    } catch (error) {
      console.log("Error retrieving last logged in user:", error);
    }
  };

  const checkPinExists = async () => {
    try {
      const storedUserPin = await AsyncStorage.getItem('userPin');
      if (storedUserPin) {
        setStoredPin(storedUserPin);
        setIsSettingPin(false);
      } else {
        setIsSettingPin(true);
      }
    } catch (error) {
      console.error('Error checking pin:', error);
    }
  };

  const handleBiometricLogin = async () => {
    if (!lastLoggedInUser) {
      Alert.alert("No Previous User", "Please set a PIN first.");
      return;
    }

    try {
      setLoading(true);
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Login as ${lastLoggedInUser.type}`,
        disableDeviceFallback: false,
        cancelLabel: "Cancel",
      });

      if (result.success) {
        await AsyncStorage.setItem("userLoggedIn", "true");
        await AsyncStorage.setItem("userType", lastLoggedInUser.type);
        setLoading(false);
        router.replace("/(tabs)/home");
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log("Biometric login error:", error);
      Alert.alert("Authentication Failed", "Please try again or log in with your PIN.");
    }
  };

  const handlePinInput = (number) => {
    if (pinCode.length < 4) {
      const newPin = pinCode + number;
      setPinCode(newPin);

      if (newPin.length === 4) {
        if (isSettingPin) {
          if (!confirmPin) {
            setConfirmPin(newPin);
            setPinCode('');
          } else if (confirmPin === newPin) {
            savePin(newPin);
          } else {
            handleWrongPin();
            setConfirmPin('');
            setPinCode('');
          }
        } else if (newPin === storedPin) {
          handleLoginSuccess();
        } else {
          handleWrongPin();
        }
      }
    }
  };

  const savePin = async (pin) => {
    try {
      setLoading(true);
      await AsyncStorage.setItem('userPin', pin);
      await AsyncStorage.setItem("userType", userType);
      setStoredPin(pin);
      setIsSettingPin(false);
      setPinCode('');
      setConfirmPin('');
      setLoading(false);
      
      Alert.alert(
        'Success', 
        'PIN set successfully!',
        [{ text: 'OK', onPress: () => handleLoginSuccess() }]
      );
    } catch (error) {
      setLoading(false);
      console.error('Error saving PIN:', error);
      Alert.alert('Error', 'Failed to save PIN. Please try again.');
    }
  };

  const handleLoginSuccess = async () => {
    try {
      setLoading(true);
      await AsyncStorage.setItem("userLoggedIn", "true");
      await AsyncStorage.setItem("userType", userType);
      setLoading(false);
      router.replace("/(tabs)/home");
    } catch (error) {
      setLoading(false);
      console.log("Login error:", error);
      Alert.alert("Login Failed", "Please try again.");
    }
  };

  const handleWrongPin = () => {
    setPinCode('');
    Alert.alert('Error', 'Invalid PIN. Please try again.');
  };

  const handleClear = () => {
    setPinCode(pinCode.slice(0, -1));
  };

  const resetPin = async () => {
    try {
      await AsyncStorage.removeItem('userPin');
      setIsSettingPin(true);
      setPinCode('');
      setConfirmPin('');
      setStoredPin('');
    } catch (error) {
      console.error('Error resetting PIN:', error);
    }
  };

  const handleEmailPasswordLogin = async (email, password) => {
    try {
      setLoading(true);
      
      if (email === 'test@example.com' && password === 'password123') {
        await AsyncStorage.setItem("userLoggedIn", "true");
        await AsyncStorage.setItem("userType", userType);
        setLoading(false);
        router.replace("/(tabs)/home");
      } else {
        setLoading(false);
        Alert.alert("Login Failed", "Invalid email or password. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      console.log("Email login error:", error);
      Alert.alert("Login Failed", "Please try again.");
    }
  };

  const toggleLoginMethod = () => {
    setIsPinLogin(!isPinLogin);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Animated.View
            entering={FadeIn.duration(600)}
            style={styles.logoContainer}
          >
            <Image
              source={require("../../assets/images/agri_logo.jpg")}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          <Animated.View
            entering={FadeIn.duration(600).delay(100)}
            style={styles.welcomeContainer}
          >
            <Text style={styles.welcomeTitle}>Welcome to Agri App</Text>
            <Text style={styles.welcomeSubtitle}>
              {isPinLogin 
                ? (isSettingPin 
                  ? (confirmPin 
                    ? 'Confirm your PIN' 
                    : 'Set a 4-digit PIN')
                  : 'Enter your PIN to continue')
                : 'Login with your credentials'
              }
            </Text>
          </Animated.View>

          <Animated.View 
            entering={FadeIn.duration(600).delay(150)}
            style={styles.userTypeContainer}
          >
            <Text style={styles.userTypeLabel}>Select User Type</Text>
            <View style={styles.userTypeTabs}>
              <TouchableOpacity 
                style={[
                  styles.userTypeTab, 
                  userType === 'farmer' && styles.activeUserTypeTab
                ]}
                onPress={() => setUserType('farmer')}
              >
                <Ionicons 
                  name="leaf-outline" 
                  size={18} 
                  color={userType === 'farmer' ? 'white' : '#538A4A'} 
                  style={styles.userTypeIcon}
                />
                <Text style={[
                  styles.userTypeText,
                  userType === 'farmer' && styles.activeUserTypeText
                ]}>Farmer</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.userTypeTab, 
                  userType === 'fpo' && styles.activeUserTypeTab
                ]}
                onPress={() => setUserType('fpo')}
              >
                <Ionicons 
                  name="people-outline" 
                  size={18} 
                  color={userType === 'fpo' ? 'white' : '#538A4A'} 
                  style={styles.userTypeIcon}
                />
                <Text style={[
                  styles.userTypeText,
                  userType === 'fpo' && styles.activeUserTypeText
                ]}>FPO</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.userTypeTab, 
                  userType === 'processor' && styles.activeUserTypeTab
                ]}
                onPress={() => setUserType('processor')}
              >
                <Ionicons 
                  name="business-outline" 
                  size={18} 
                  color={userType === 'processor' ? 'white' : '#538A4A'} 
                  style={styles.userTypeIcon}
                />
                <Text style={[
                  styles.userTypeText,
                  userType === 'processor' && styles.activeUserTypeText
                ]}>Processor</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {isPinLogin ? (
            <Animated.View 
              entering={FadeIn.duration(600).delay(200)}
              exiting={FadeOut.duration(300)}
              style={styles.pinContainer}
            >
              <PasscodeDots passcode={pinCode} />
              
              <Keypad
                onKeyPress={handlePinInput}
                onClear={handleClear}
                onReset={resetPin}
              />

              {isBiometricAvailable && !isSettingPin && lastLoggedInUser && (
                <Animated.View
                  entering={FadeIn.duration(600).delay(250)}
                  style={styles.biometricContainer}
                >
                  <BiometricButton onPress={handleBiometricLogin} />
                </Animated.View>
              )}
            </Animated.View>
          ) : (
            <Animated.View
              entering={FadeIn.duration(600).delay(200)}
              exiting={FadeOut.duration(300)}
            >
              <EmailLoginForm 
                onSubmit={handleEmailPasswordLogin} 
                userType={userType}
                loading={loading}
              />
            </Animated.View>
          )}

          <Animated.View
            entering={FadeIn.duration(600).delay(300)}
          >
            <ToggleLoginButton
              onPress={toggleLoginMethod}
              isPinLogin={isPinLogin}
            />
          </Animated.View>

          <Animated.View
            entering={FadeIn.duration(600).delay(350)}
          >
            <SignupLink />
          </Animated.View>

          {loading && !isPinLogin && (
            <ActivityIndicator size="large" color="#4A8D3D" style={styles.loader} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  logo: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  welcomeContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  welcomeTitle: {
    color: "#333333",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  welcomeSubtitle: {
    color: "#666666",
    textAlign: "center",
    marginTop: 8,
    fontSize: 16,
  },
  userTypeContainer: {
    marginBottom: 30,
  },
  userTypeLabel: {
    fontSize: 14,
    color: "#333333",
    marginBottom: 10,
    fontWeight: "500",
    marginLeft: 4,
  },
  userTypeTabs: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 4,
  },
  userTypeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  activeUserTypeTab: {
    backgroundColor: '#4A8D3D',
  },
  userTypeIcon: {
    marginRight: 5,
  },
  userTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#538A4A',
  },
  activeUserTypeText: {
    color: 'white',
  },
  pinContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  biometricContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loader: {
    marginTop: 20,
  }
});

export default Login;
