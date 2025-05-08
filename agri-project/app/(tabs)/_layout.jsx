import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TabLayout = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4A8D3D',
        tabBarInactiveTintColor: '#777777',
        tabBarStyle: {
          height: 65 + (Platform.OS === 'ios' ? insets.bottom : 0),
          paddingBottom: 10 + (Platform.OS === 'ios' ? insets.bottom - 10 : 0),
          paddingTop: 5,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 8,
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F0F0F0',
          borderTopWidth: 1,
        },
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelPosition: 'below-icon',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          tabBarLabel: ({ color, focused }) => (
            <Text style={[styles.tabBarLabel, { color }]}>Home</Text>
          ),
        }}
      />
      
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
          tabBarLabel: ({ color, focused }) => (
            <Text style={[styles.tabBarLabel, { color }]}>Explore</Text>
          ),
        }}
      />
      
      <Tabs.Screen
        name="track"
        options={{
          title: 'Track',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="qr-code-outline" size={size} color={color} />
          ),
          tabBarLabel: ({ color, focused }) => (
            <Text style={[styles.tabBarLabel, { color }]}>Track</Text>
          ),
        }}
      />
      
      <Tabs.Screen
        name="farmers"
        options={{
          title: 'Farmers',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="leaf-outline" size={size} color={color} />
          ),
          tabBarLabel: ({ color, focused }) => (
            <Text style={[styles.tabBarLabel, { color }]}>Farmers</Text>
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
          tabBarLabel: ({ color, focused }) => (
            <Text style={[styles.tabBarLabel, { color }]}>Profile</Text>
          ),
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default TabLayout;
