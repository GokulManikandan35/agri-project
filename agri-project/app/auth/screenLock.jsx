import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown, useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

// Import components
import PasscodeDots from './components/PasscodeDots';
import Keypad from './components/Keypad';
import BiometricButton from './components/BiometricButton';

const { width, height } = Dimensions.get('window');

const ScreenLock = () => {
  const router = useRouter();
  const [passcode, setPasscode] = useState('');
  const [storedPasscode, setStoredPasscode] = useState('');
  const [isSettingPasscode, setIsSettingPasscode] = useState(false);
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasFingerprint, setHasFingerprint] = useState(false);
  const [isResuming, setIsResuming] = useState(false);
  const animationProgress = useSharedValue(0);
  const shakeAnimation = useSharedValue(0);

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      const lastActiveTime = await AsyncStorage.getItem('lastActiveTime');
      const userLoggedIn = await AsyncStorage.getItem('userLoggedIn');

      if (lastActiveTime && userLoggedIn === 'true') {
        setIsResuming(true);
      }

      checkPasscodeExists();
      checkBiometricSupport();
    } catch (error) {
      console.error('Error checking app state:', error);
      checkPasscodeExists();
      checkBiometricSupport();
    }
  };

  const checkPasscodeExists = async () => {
    try {
      const storedCode = await AsyncStorage.getItem('passcode');
      if (storedCode) {
        setStoredPasscode(storedCode);
      } else {
        setIsSettingPasscode(true);
      }
    } catch (error) {
      console.error('Error checking passcode:', error);
    }
  };

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setHasFingerprint(compatible && enrolled);
  };

  const handleBiometricAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate with fingerprint',
        fallbackLabel: 'Use passcode',
      });

      if (result.success) {
        handleAuthSuccess();
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
    }
  };

  const handlePasscodeInput = (number) => {
    if (passcode.length < 4) {
      const newPasscode = passcode + number;
      setPasscode(newPasscode);

      if (newPasscode.length === 4) {
        if (isSettingPasscode) {
          if (!confirmPasscode) {
            setConfirmPasscode(newPasscode);
            setPasscode('');
          } else if (confirmPasscode === newPasscode) {
            savePasscode(newPasscode);
          } else {
            handleWrongPasscode();
            setConfirmPasscode('');
            setPasscode('');
          }
        } else if (newPasscode === storedPasscode) {
          handleAuthSuccess();
        } else {
          handleWrongPasscode();
        }
      }
    }
  };

  const savePasscode = async (code) => {
    try {
      await AsyncStorage.setItem('passcode', code);
      setStoredPasscode(code);
      setIsSettingPasscode(false);
      setPasscode('');
      setConfirmPasscode('');
      Alert.alert('Success', 'Passcode set successfully!');
    } catch (error) {
      console.error('Error saving passcode:', error);
    }
  };

  const handleAuthSuccess = () => {
    animationProgress.value = withTiming(1, { duration: 1000 });

    setTimeout(async () => {
      setIsAuthenticated(true);

      await AsyncStorage.setItem('lastActiveTime', Date.now().toString());

      if (isResuming) {
        router.replace('/(tabs)/home');
      } else {
        const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');

        if (hasCompletedOnboarding === 'true') {
          router.replace('/(tabs)/home');
        } else {
          await AsyncStorage.setItem('userLoggedIn', 'true');
          router.replace('/(tabs)/home');
        }
      }
    }, 1500);
  };

  const handleWrongPasscode = () => {
    shakeAnimation.value = withTiming(3, { duration: 300 }, (finished) => {
      if (finished) {
        shakeAnimation.value = withTiming(0, { duration: 300 });
      }
    });
    setPasscode('');
  };

  const handleClear = () => {
    setPasscode(passcode.slice(0, -1));
  };

  const resetPasscode = async () => {
    try {
      await AsyncStorage.removeItem('passcode');
      setIsSettingPasscode(true);
      setPasscode('');
      setConfirmPasscode('');
      setStoredPasscode('');
    } catch (error) {
      console.error('Error resetting passcode:', error);
    }
  };

  const shakeStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(shakeAnimation.value * 10 * Math.sin(shakeAnimation.value * Math.PI * 2)),
        },
      ],
    };
  });

  const lockAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(1 - animationProgress.value),
      transform: [
        { scale: withTiming(1 - animationProgress.value * 0.5) },
        { translateY: withTiming(-100 * animationProgress.value) },
      ],
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.contentContainer, lockAnimatedStyle]}>
        <Animated.View entering={FadeIn.delay(300).duration(700)} style={styles.centerContent}>
          <Animated.View style={shakeStyle}>
            <Ionicons name="lock-closed" size={80} color="#16a34a" />
          </Animated.View>

          <Animated.Text
            entering={FadeInDown.duration(1000).delay(400)}
            style={styles.titleText}
          >
            {isSettingPasscode
              ? confirmPasscode
                ? 'Confirm your passcode'
                : 'Set your passcode'
              : 'Enter your passcode'}
          </Animated.Text>

          <Animated.View entering={FadeInDown.duration(800).delay(600)} style={styles.passcodeContainer}>
            <PasscodeDots passcode={passcode} />

            <Keypad
              onKeyPress={handlePasscodeInput}
              onClear={handleClear}
              onReset={resetPasscode}
            />

            {hasFingerprint && !isSettingPasscode && (
              <BiometricButton onPress={handleBiometricAuth} />
            )}
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9eb', // light green background
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  centerContent: {
    alignItems: 'center',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#166534', // dark green
    marginTop: 24,
    textAlign: 'center',
  },
  passcodeContainer: {
    marginTop: 32,
    width: '100%',
  },
});

export default ScreenLock;
