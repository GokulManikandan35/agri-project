import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Mock data - replace with actual API calls in production
const MOCK_FARMERS = [
  { id: 'F001', name: 'John Doe', location: 'Karnataka', lots: [{ id: 'L001', type: 'Wheat' }, { id: 'L002', type: 'Rice' }] },
  { id: 'F002', name: 'Jane Smith', location: 'Maharashtra', lots: [{ id: 'L003', type: 'Maize' }] },
  { id: 'F003', name: 'Amit Patel', location: 'Gujarat', lots: [{ id: 'L004', type: 'Cotton' }, { id: 'L005', type: 'Groundnut' }] },
  { id: 'F004', name: 'Priya Singh', location: 'Punjab', lots: [{ id: 'L006', type: 'Rice' }] },
  { id: 'F005', name: 'Rajesh Kumar', location: 'Haryana', lots: [{ id: 'L007', type: 'Wheat' }] },
  { id: 'F006', name: 'Anita Desai', location: 'Tamil Nadu', lots: [{ id: 'L008', type: 'Sugarcane' }] },
  { id: 'F007', name: 'Suresh Reddy', location: 'Andhra Pradesh', lots: [{ id: 'L009', type: 'Rice' }, { id: 'L010', type: 'Cotton' }] },
  { id: 'F008', name: 'Meena Kumari', location: 'Rajasthan', lots: [{ id: 'L011', type: 'Millet' }] },
];

const FPOHomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [farmers, setFarmers] = useState(MOCK_FARMERS);
  const [filteredFarmers, setFilteredFarmers] = useState(MOCK_FARMERS);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Filter farmers based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFarmers(farmers);
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    let results = [];

    if (selectedFilter === 'all' || selectedFilter === 'name') {
      const nameResults = farmers.filter(farmer => 
        farmer.name.toLowerCase().includes(lowerCaseQuery)
      );
      results = [...results, ...nameResults];
    }

    if (selectedFilter === 'all' || selectedFilter === 'id') {
      const idResults = farmers.filter(farmer => 
        farmer.id.toLowerCase().includes(lowerCaseQuery)
      );
      results = [...results, ...idResults];
    }

    if (selectedFilter === 'all' || selectedFilter === 'lot') {
      const lotResults = farmers.filter(farmer => 
        farmer.lots.some(lot => lot.id.toLowerCase().includes(lowerCaseQuery))
      );
      results = [...results, ...lotResults];
    }

    // Remove duplicates
    setFilteredFarmers([...new Map(results.map(item => [item.id, item])).values()]);
  }, [searchQuery, farmers, selectedFilter]);

  // Function to fetch farmers data
  const fetchFarmers = async () => {
    setIsLoading(true);
    try {
      // In a real app, we would fetch from an API here
      // const response = await fetch('your-api-url');
      // const data = await response.json();
      // setFarmers(data);
      
      // Using mock data for now
      setTimeout(() => {
        setFarmers(MOCK_FARMERS);
        setFilteredFarmers(MOCK_FARMERS);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching farmers data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  const renderFarmerItem = ({ item }) => (
    <TouchableOpacity style={styles.farmerCard}>
      <View style={styles.farmerHeader}>
        <View style={styles.farmerAvatar}>
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.farmerInfo}>
          <Text style={styles.farmerName}>{item.name}</Text>
          <Text style={styles.farmerId}>ID: {item.id}</Text>
          <Text style={styles.farmerLocation}>{item.location}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#4A8D3D" />
      </View>
      
      <View style={styles.lotsContainer}>
        <Text style={styles.lotsTitle}>Lots:</Text>
        <View style={styles.lotsWrapper}>
          {item.lots.map(lot => (
            <View key={lot.id} style={styles.lotTag}>
              <Text style={styles.lotText}>{lot.id} - {lot.type}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFilterButton = (title, value) => (
    <TouchableOpacity 
      style={[
        styles.filterButton,
        selectedFilter === value && styles.selectedFilterButton
      ]}
      onPress={() => setSelectedFilter(value)}
    >
      <Text 
        style={[
          styles.filterButtonText,
          selectedFilter === value && styles.selectedFilterText
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>FPO Dashboard</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="person-circle-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search farmers, IDs or lots..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Search by:</Text>
        <View style={styles.filterButtons}>
          {renderFilterButton('All', 'all')}
          {renderFilterButton('Name', 'name')}
          {renderFilterButton('ID', 'id')}
          {renderFilterButton('Lot', 'lot')}
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#4A8D3D" />
      ) : filteredFarmers.length > 0 ? (
        <FlatList
          data={filteredFarmers}
          keyExtractor={item => item.id}
          renderItem={renderFarmerItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="search" size={50} color="#ccc" />
          <Text style={styles.emptyStateText}>No farmers found</Text>
          <Text style={styles.emptyStateSubText}>Try a different search term</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginRight: 10,
  },
  filterButtons: {
    flexDirection: 'row',
    flex: 1,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  selectedFilterButton: {
    backgroundColor: '#4A8D3D',
  },
  filterButtonText: {
    fontSize: 13,
    color: '#666',
  },
  selectedFilterText: {
    color: '#fff',
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
  farmerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  farmerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  farmerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4A8D3D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  farmerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  farmerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  farmerId: {
    fontSize: 14,
    color: '#666',
  },
  farmerLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  lotsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  lotsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  lotsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  lotTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  lotText: {
    color: '#4A8D3D',
    fontSize: 12,
    fontWeight: '500',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});

export default FPOHomeScreen;
