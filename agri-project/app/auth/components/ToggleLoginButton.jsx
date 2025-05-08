import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const ToggleLoginButton = ({ onPress, isPinLogin }) => {
  return (
    <TouchableOpacity style={styles.toggleButton} onPress={onPress}>
      <Text style={styles.toggleButtonText}>
        {isPinLogin ? 'Use Email & Password' : 'Use PIN Login'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggleButton: {
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#4A8D3D',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  }
});

export default ToggleLoginButton;
