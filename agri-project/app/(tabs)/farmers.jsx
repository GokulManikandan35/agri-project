import React from 'react';
import { View, StyleSheet } from 'react-native';
import FarmersScreen from '../screens/Farmers';

export default function Farmers() {
  return (
    <View style={styles.container}>
      <FarmersScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
