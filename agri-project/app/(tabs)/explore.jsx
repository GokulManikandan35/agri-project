import React from 'react';
import { View, StyleSheet } from 'react-native';
import ExploreScreen from '../screens/Explore';

export default function Explore() {
  return (
    <View style={styles.container}>
      <ExploreScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
