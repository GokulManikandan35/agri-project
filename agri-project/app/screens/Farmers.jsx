import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import SearchBar from '../components/SearchBar';
import FarmerCard from '../components/FarmerCard';
import FilterChip from '../components/FilterChip';

const Farmers = () => {
  const [activeRegion, setActiveRegion] = useState('all');
  
  const regions = [
    { id: 'all', name: 'All Regions' },
    { id: 'north', name: 'North India' },
    { id: 'south', name: 'South India' },
    { id: 'east', name: 'East India' },
    { id: 'west', name: 'West India' }
  ];
  
  const filters = [
    { id: 'certified', name: 'GI Certified' },
    { id: 'organic', name: 'Organic Farmers' },
    { id: 'fruits', name: 'Fruits' },
    { id: 'spices', name: 'Spices' }
  ];
  
  const farmers = [
    {
      id: '1',
      name: 'Ramesh Kumar',
      location: 'Madurai, Tamil Nadu',
      crops: ['Jasmine', 'Rice'],
      certified: true,
      image: require('../../assets/images/farmer1.jpg'),
      region: 'south'
    },
    {
      id: '2',
      name: 'Prakash Desai',
      location: 'Ratnagiri, Maharashtra',
      crops: ['Alphonso Mango'],
      certified: true,
      image: require('../../assets/images/farmer2.jpeg'),
      region: 'west'
    },
    {
      id: '3',
      name: 'Anita Sharma',
      location: 'Darjeeling, West Bengal',
      crops: ['Tea'],
      certified: true,
      image: require('../../assets/images/farmer1.jpg'),
      region: 'east'
    },
    {
      id: '4',
      name: 'Vijay Singh',
      location: 'Amritsar, Punjab',
      crops: ['Basmati Rice', 'Wheat'],
      certified: true,
      image: require('../../assets/images/farmer2.jpeg'),
      region: 'north'
    }
  ];

  const filteredFarmers = 
    activeRegion === 'all' 
      ? farmers 
      : farmers.filter(farmer => farmer.region === activeRegion);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={styles.header}
        entering={FadeIn.duration(600)}
      >
        <Text style={styles.title}>Farmers & Producers</Text>
        <View style={styles.searchContainer}>
          <SearchBar />
        </View>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Regions Tabs */}
        <Animated.View 
          entering={FadeInDown.delay(200).duration(600)}
          style={styles.regionsSection}
        >
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.regionsContainer}
          >
            {regions.map((region) => (
              <TouchableOpacity 
                key={region.id}
                style={[
                  styles.regionButton,
                  activeRegion === region.id && styles.activeRegionButton
                ]}
                onPress={() => setActiveRegion(region.id)}
              >
                <Text 
                  style={[
                    styles.regionText,
                    activeRegion === region.id && styles.activeRegionText
                  ]}
                >
                  {region.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Filters Section */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(600)}
          style={styles.filtersSection}
        >
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
          >
            {filters.map((filter) => (
              <FilterChip key={filter.id} label={filter.name} />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Farmers List */}
        <Animated.View 
          entering={FadeInDown.delay(400).duration(600)}
          style={styles.farmersSection}
        >
          <Text style={styles.sectionTitle}>
            {activeRegion === 'all' 
              ? 'All Farmers & Producers' 
              : `${regions.find(r => r.id === activeRegion)?.name} Farmers`}
          </Text>
          
          {filteredFarmers.map((farmer, index) => (
            <Animated.View
              key={farmer.id}
              entering={FadeInDown.delay(500 + (index * 100)).duration(600)}
              style={styles.farmerCardContainer}
            >
              <FarmerCard farmer={farmer} />
            </Animated.View>
          ))}
        </Animated.View>

        {/* Impact Stats */}
        <Animated.View 
          entering={FadeInDown.delay(800).duration(600)}
          style={styles.impactSection}
        >
          <Text style={styles.sectionTitle}>Our Impact</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>500+</Text>
              <Text style={styles.statLabel}>Registered Farmers</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>20+</Text>
              <Text style={styles.statLabel}>GI Products</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>States Covered</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  searchContainer: {
    marginBottom: 5,
  },
  regionsSection: {
    marginBottom: 15,
  },
  regionsContainer: {
    paddingHorizontal: 20,
  },
  regionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
    marginRight: 10,
  },
  activeRegionButton: {
    backgroundColor: '#4A8D3D',
  },
  regionText: {
    fontWeight: '500',
    color: '#666',
  },
  activeRegionText: {
    color: '#fff',
  },
  filtersSection: {
    marginBottom: 20,
  },
  filtersContainer: {
    paddingHorizontal: 20,
  },
  farmersSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  farmerCardContainer: {
    marginBottom: 15,
  },
  impactSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    width: '31%',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A8D3D',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default Farmers;
