import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight } from 'react-native-reanimated';

const TraceTimeline = ({ events }) => {
  return (
    <View style={styles.container}>
      {events.map((event, index) => (
        <Animated.View 
          key={index} 
          style={styles.eventContainer}
          entering={FadeInRight.delay(index * 200).duration(500)}
        >
          <View style={styles.timeColumn}>
            <Text style={styles.date}>{event.date}</Text>
          </View>
          
          <View style={styles.iconColumn}>
            <View style={styles.iconContainer}>
              <Ionicons name="ellipse" size={12} color="#4A8D3D" />
            </View>
            {index < events.length - 1 && <View style={styles.line} />}
          </View>
          
          <View style={styles.detailsColumn}>
            <Text style={styles.title}>{event.title}</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 5,
  },
  eventContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  timeColumn: {
    width: 75,
    paddingRight: 10,
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  iconColumn: {
    width: 20,
    alignItems: 'center',
  },
  iconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e6f7ec',
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: 1,
    flex: 1,
    backgroundColor: '#ccc',
    marginTop: 5,
  },
  detailsColumn: {
    flex: 1,
    paddingLeft: 10,
    paddingBottom: 15,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
});

export default TraceTimeline;
