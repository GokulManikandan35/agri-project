import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight } from 'react-native-reanimated';

const TimelineStep = ({ icon, title, description, delay, isLast }) => {
  return (
    <Animated.View 
      style={styles.container}
      entering={FadeInRight.delay(delay).duration(800)}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={20} color="#fff" />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A8D3D',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 15,
    paddingVertical: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});

export default TimelineStep;
