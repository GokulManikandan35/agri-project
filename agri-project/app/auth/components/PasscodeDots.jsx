import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

const PasscodeDots = ({ passcode }) => {
  // Keep the dots for password feedback
  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {[0, 1, 2, 3].map((index) => (
        <Animated.View
          key={index}
          entering={ZoomIn.delay(index * 100)}
          style={[
            styles.dot,
            index < passcode.length ? styles.activeDot : styles.inactiveDot
          ]}
        />
      ))}
    </View>
  );

  // Add minimal keyboard visualization below the dots
  const renderMinimalKeyboard = () => {
    // Display the last entered digit
    const lastDigit = passcode.length > 0 ? passcode[passcode.length - 1] : "";
    
    return (
      <View style={styles.keyboardContainer}>
        <View style={styles.lastDigitContainer}>
          {lastDigit && (
            <Animated.View
              entering={ZoomIn}
              style={styles.lastDigitCircle}
            >
              <Text style={styles.lastDigitText}>{lastDigit}</Text>
            </Animated.View>
          )}
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(passcode.length / 4) * 100}%` }
            ]} 
          />
        </View>
      </View>
    );
  };

  return (
    <View>
      {renderDots()}
      {renderMinimalKeyboard()}
    </View>
  );
};

const styles = StyleSheet.create({
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 16,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  activeDot: {
    backgroundColor: '#16a34a', // green
  },
  inactiveDot: {
    backgroundColor: '#d1d5db', // gray
  },
  keyboardContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  lastDigitContainer: {
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  lastDigitCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lastDigitText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#16a34a',
  },
  progressBar: {
    width: '70%',
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#16a34a',
    borderRadius: 3,
  }
});

export default PasscodeDots;
