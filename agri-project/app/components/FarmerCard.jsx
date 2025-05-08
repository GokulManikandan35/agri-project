import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FarmerCard = ({ farmer }) => {
  return (
    <TouchableOpacity style={styles.container}>
      <Image source={farmer.image} style={styles.image} />
      
      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{farmer.name}</Text>
          {farmer.certified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="shield-checkmark" size={12} color="#fff" />
            </View>
          )}
        </View>
        
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text style={styles.location}>{farmer.location}</Text>
        </View>
        
        <View style={styles.cropsContainer}>
          {farmer.crops.map((crop, index) => (
            <View key={index} style={styles.cropTag}>
              <Text style={styles.cropText}>{crop}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <TouchableOpacity style={styles.arrowContainer}>
        <Ionicons name="chevron-forward" size={20} color="#4A8D3D" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 6,
  },
  verifiedBadge: {
    backgroundColor: '#4A8D3D',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  location: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  cropsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cropTag: {
    backgroundColor: '#e6f7ec',
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginRight: 6,
    marginBottom: 4,
  },
  cropText: {
    fontSize: 11,
    color: '#4A8D3D',
  },
  arrowContainer: {
    padding: 5,
  },
});

export default FarmerCard;
