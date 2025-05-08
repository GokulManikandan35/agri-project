import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProductCard = ({ product }) => {
  return (
    <TouchableOpacity style={styles.container}>
      <Image source={product.image} style={styles.image} />
      {product.verified && (
        <View style={styles.verifiedBadge}>
          <Ionicons name="shield-checkmark" size={12} color="#fff" />
        </View>
      )}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{product.name}</Text>
        <View style={styles.regionContainer}>
          <Ionicons name="location-outline" size={12} color="#4A8D3D" />
          <Text style={styles.region}>{product.region}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 160,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginRight: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  image: {
    width: '100%',
    height: 130,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#4A8D3D',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  regionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  region: {
    fontSize: 12,
    color: '#666',
    marginLeft: 3,
  },
});

export default ProductCard;
