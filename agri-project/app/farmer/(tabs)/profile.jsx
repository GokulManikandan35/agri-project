import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProfileScreen from '../screens/Profile';

export default function Profile() {
  return (
    <View style={styles.container}>
      <ProfileScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
