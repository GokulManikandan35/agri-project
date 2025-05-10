import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TabLayout = () => {
  // Create a fixed height for the tab bar instead of using dynamic calculations
  const fixedTabBarHeight = Platform.OS === 'ios' ? 80 : 65;
  const fixedBottomPadding = Platform.OS === 'ios' ? 20 : 10;
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4A8D3D',
        tabBarInactiveTintColor: '#777777',
        tabBarStyle: {
          height: fixedTabBarHeight,
          paddingBottom: fixedBottomPadding,
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
