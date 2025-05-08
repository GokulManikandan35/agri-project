import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import FilterChip from '../components/FilterChip';

const Explore = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'fruits', name: 'Fruits' },
    { id: 'spices', name: 'Spices' },
    { id: 'grains', name: 'Grains' },
    { id: 'flowers', name: 'Flowers' }
  ];
  
  const regions = [
    { id: 'tamil-nadu', name: 'Tamil Nadu', count: 12 },
    { id: 'kerala', name: 'Kerala', count: 8 },
    { id: 'karnataka', name: 'Karnataka', count: 10 },
    { id: 'west-bengal', name: 'West Bengal', count: 6 },
    { id: 'maharashtra', name: 'Maharashtra', count: 9 }
  ];
  
  const filters = [
    { id: 'certified', name: 'GI Certified' },
    { id: 'organic', name: 'Organic' },
    { id: 'recent', name: 'Recently Added' },
    { id: 'price', name: 'Price' }
  ];
  
  const products = [
    {
      id: '1',
      name: 'Madurai Jasmine',
      region: 'Tamil Nadu',
      image: require('../../assets/images/madurai-jasmine.jpeg'),
      verified: true,
      category: 'flowers'
    },
    {
      id: '2',
      name: 'Darjeeling Tea',
      region: 'West Bengal',
      image: require('../../assets/images/dargeling-tea.jpg'),
      verified: true,
      category: 'spices'
    },
    {
      id: '3',
      name: 'Alphonso Mangoes',
      region: 'Maharashtra',
      image: require('../../assets/images/alphonso-mango.jpg'),
      verified: true,
      category: 'fruits'
    },
    {
      id: '4',
      name: 'Coorg Oranges',
      region: 'Karnataka',
      image: require('../../assets/images/coorg-orange.jpg'),
      verified: true,
      category: 'fruits'
    },
    {
      id: '5',
      name: 'Basmati Rice',
      region: 'Punjab',
      image: require('../../assets/images/basmati-rice.jpeg'),
      verified: true,
      category: 'grains'
    },
    {
      id: '6',
      name: 'Mysore Sandal Soap',
      region: 'Karnataka',
      image: require('../../assets/images/mysore-sandal.jpg'),
      verified: true,
      category: 'other'
    }
  ];

  const filteredProducts = 
    activeCategory === 'all' 
      ? products 
      : products.filter(product => product.category === activeCategory);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={styles.header}
        entering={FadeIn.duration(600)}
      >
        <Text style={styles.title}>Explore Products</Text>
        <View style={styles.searchContainer}>
          <SearchBar />
        </View>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categories Section */}
        <Animated.View 
          entering={FadeInDown.delay(200).duration(600)}
          style={styles.categoriesSection}
        >
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity 
                key={category.id}
                style={[
                  styles.categoryButton,
                  activeCategory === category.id && styles.activeCategoryButton
                ]}
                onPress={() => setActiveCategory(category.id)}
              >
                <Text 
                  style={[
                    styles.categoryText,
                    activeCategory === category.id && styles.activeCategoryText
                  ]}
                >
                  {category.name}
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

        {/* Products Grid */}
        <Animated.View 
          entering={FadeInDown.delay(400).duration(600)}
          style={styles.productsSection}
        >
          <Text style={styles.sectionTitle}>
            {activeCategory === 'all' ? 'All Products' : categories.find(c => c.id === activeCategory)?.name}
          </Text>
          
          <View style={styles.productsGrid}>
            {filteredProducts.map((product, index) => (
              <View key={product.id} style={styles.productCardWrapper}>
                <ProductCard product={product} />
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Regions Section */}
        <Animated.View 
          entering={FadeInDown.delay(500).duration(600)}
          style={styles.regionsSection}
        >
          <Text style={styles.sectionTitle}>Browse by Region</Text>
          
          {regions.map((region, index) => (
            <TouchableOpacity key={region.id} style={styles.regionItem}>
              <View style={styles.regionInfo}>
                <Text style={styles.regionName}>{region.name}</Text>
                <Text style={styles.regionCount}>{region.count} products</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          ))}
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
  categoriesSection: {
    marginBottom: 15,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
    marginRight: 10,
  },
  activeCategoryButton: {
    backgroundColor: '#4A8D3D',
  },
  categoryText: {
    fontWeight: '500',
    color: '#666',
  },
  activeCategoryText: {
    color: '#fff',
  },
  filtersSection: {
    marginBottom: 20,
  },
  filtersContainer: {
    paddingHorizontal: 20,
  },
  productsSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCardWrapper: {
    width: '48%',
    marginBottom: 15,
  },
  regionsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  regionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  regionInfo: {
    flex: 1,
  },
  regionName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  regionCount: {
    fontSize: 12,
    color: '#666',
  },
});

export default Explore;
