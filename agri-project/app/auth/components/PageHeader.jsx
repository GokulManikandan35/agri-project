import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';

const PageHeader = ({ title, subtitle, showBackButton, onBackPress }) => {
  return (
    <Animated.View
      entering={FadeIn.duration(600)}
      style={styles.container}
    >
      {showBackButton && (
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onBackPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      )}
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 5,
    zIndex: 10,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    color: "#333333",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: "#666666",
    textAlign: "center",
    marginTop: 8,
    fontSize: 16,
  },
});

export default PageHeader;
