import React from 'react';
import { View, StyleSheet } from 'react-native';
import HomeScreen from '../screens/Home';

export default function Home() {
  return (
    <View style={styles.container}>
      <HomeScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
