import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FilterChip = ({ label }) => {
  const [selected, setSelected] = useState(false);
  
  return (
    <TouchableOpacity 
      style={[styles.chip, selected && styles.chipSelected]} 
      onPress={() => setSelected(!selected)}
    >
      {selected && (
        <Ionicons 
          name="checkmark" 
          size={14} 
          color="#fff" 
          style={styles.icon}
        />
      )}
      <Text 
        style={[styles.label, selected && styles.labelSelected]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  chipSelected: {
    backgroundColor: '#4A8D3D',
    borderColor: '#4A8D3D',
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  labelSelected: {
    color: '#fff',
  },
  icon: {
    marginRight: 4,
  }
});

export default FilterChip;
