import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const SignupLink = () => {
  const router = useRouter();
  
  const handleNavigateToSignup = () => {
    router.push('/auth/signup');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Don't have an account? </Text>
        <TouchableOpacity onPress={handleNavigateToSignup}>
          <Text style={styles.linkText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center',
  },
  text: {
    color: '#666',
    fontSize: 14,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    color: '#4A8D3D',
    fontWeight: '600',
    fontSize: 14,
  }
});

export default SignupLink;
