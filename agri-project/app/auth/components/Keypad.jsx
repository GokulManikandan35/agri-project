import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Keypad = ({ onKeyPress, onClear, onReset }) => {
  return (
    <View style={styles.keypadContainer}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
        <TouchableOpacity
          key={number}
          onPress={() => onKeyPress(number.toString())}
          style={styles.keypadButton}
        >
          <Text style={styles.keypadButtonText}>{number}</Text>
        </TouchableOpacity>
      ))}
      
      <TouchableOpacity
        onPress={onReset}
        style={styles.keypadButton}
      >
        <Ionicons name="refresh" size={30} color="#16a34a" />
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => onKeyPress('0')}
        style={styles.keypadButton}
      >
        <Text style={styles.keypadButtonText}>0</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={onClear}
        style={styles.keypadButton}
      >
        <Ionicons name="backspace" size={30} color="#16a34a" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  keypadContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  keypadButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
    borderWidth: 2,
    borderColor: '#e4f0db', // light green border
  },
  keypadButtonText: {
    fontSize: 28,
    color: '#166534', // dark green
    fontWeight: '600',
  },
});

export default Keypad;
