import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const LoginLink = () => {
  const router = useRouter();
  
  const handleNavigateToLogin = () => {
    router.replace('/auth/login');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Already have an account? </Text>
        <TouchableOpacity onPress={handleNavigateToLogin}>
          <Text style={styles.linkText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: '#666',
    fontSize: 14,
  },
  linkText: {
    color: '#4A8D3D',
    fontWeight: '600',
    fontSize: 14,
  }
});

export default LoginLink;
