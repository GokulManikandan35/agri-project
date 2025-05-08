import React from 'react';
import { View, StyleSheet } from 'react-native';
import TrackScreen from '../screens/Track';

export default function Track() {
  return (
    <View style={styles.container}>
      <TrackScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
