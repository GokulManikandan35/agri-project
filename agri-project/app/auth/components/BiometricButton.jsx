import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

const BiometricButton = ({ onPress }) => {
  return (
    <Animated.View 
      entering={FadeInDown.delay(800)} 
      style={styles.fingerprintContainer}
    >
      <TouchableOpacity 
        onPress={onPress}
        style={styles.fingerprintButton}
      >
        <Ionicons name="finger-print" size={40} color="white" />
      </TouchableOpacity>
      <Text style={styles.fingerprintText}>Touch ID</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fingerprintContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  fingerprintButton: {
    backgroundColor: '#d97706', // yellow/amber
    padding: 20,
    borderRadius: 40,
  },
  fingerprintText: {
    color: '#166534', // dark green
    marginTop: 8,
    fontWeight: '500',
  },
});

export default BiometricButton;
