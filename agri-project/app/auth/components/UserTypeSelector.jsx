import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

const UserTypeSelector = ({ userType, onSelectUserType }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select User Type</Text>
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[
            styles.tab, 
            userType === 'farmer' && styles.activeTab
          ]}
          onPress={() => onSelectUserType('farmer')}
        >
          <Ionicons 
            name="leaf-outline" 
            size={18} 
            color={userType === 'farmer' ? 'white' : '#538A4A'} 
            style={styles.icon}
          />
          <Text style={[
            styles.tabText,
            userType === 'farmer' && styles.activeTabText
          ]}>Farmer</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab, 
            userType === 'fpo' && styles.activeTab
          ]}
          onPress={() => onSelectUserType('fpo')}
        >
          <Ionicons 
            name="people-outline" 
            size={18} 
            color={userType === 'fpo' ? 'white' : '#538A4A'} 
            style={styles.icon}
          />
          <Text style={[
            styles.tabText,
            userType === 'fpo' && styles.activeTabText
          ]}>FPO</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab, 
            userType === 'processor' && styles.activeTab
          ]}
          onPress={() => onSelectUserType('processor')}
        >
          <Ionicons 
            name="business-outline" 
            size={18} 
            color={userType === 'processor' ? 'white' : '#538A4A'} 
            style={styles.icon}
          />
          <Text style={[
            styles.tabText,
            userType === 'processor' && styles.activeTabText
          ]}>Processor</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: "#333333",
    marginBottom: 10,
    fontWeight: "500",
    marginLeft: 4,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#4A8D3D',
  },
  icon: {
    marginRight: 5,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#538A4A',
  },
  activeTabText: {
    color: 'white',
  },
});

export default UserTypeSelector;
