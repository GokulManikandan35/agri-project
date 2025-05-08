import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import ScanButton from '../components/ScanButton';
import TraceTimeline from '../components/TraceTimeline';

const Track = () => {
  const [trackingCode, setTrackingCode] = useState('');
  const [trackedProduct, setTrackedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('qr'); // 'qr' or 'code'
  
  const handleTrack = () => {
    if (trackingCode && trackingCode.trim()) {
      // In a real app, this would make an API call to fetch product details
      // For demo, we'll just set a mock product
      setTrackedProduct({
        id: '123',
        name: 'Alphonso Mango',
        region: 'Ratnagiri, Maharashtra',
        certificate: 'GI-2018-005',
        image: require('../../assets/images/alphonso-mango.jpg'),
        farmer: {
          name: 'Prakash Desai',
          location: 'Ratnagiri, Maharashtra'
        },
        timeline: [
          {
            date: '10 May 2023',
            title: 'Harvested',
            description: 'Harvested from Ratnagiri orchard'
          },
          {
            date: '11 May 2023',
            title: 'Quality Check',
            description: 'Passed quality verification at local center'
          },
          {
            date: '12 May 2023',
            title: 'Packaging',
            description: 'Packaged with sustainable materials'
          },
          {
            date: '14 May 2023',
            title: 'Distribution',
            description: 'Shipped to retail destinations'
          }
        ]
      });
    }
  };
  
  const resetSearch = () => {
    setTrackedProduct(null);
    setTrackingCode('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Animated.Text 
          style={styles.title}
          entering={FadeIn.duration(600)}
        >
          Track & Verify Products
        </Animated.Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {!trackedProduct ? (
          <View style={styles.searchSection}>
            <Animated.View 
              style={styles.tabsContainer}
              entering={FadeInDown.delay(200).duration(600)}
            >
              <TouchableOpacity 
                style={[
                  styles.tab, 
                  activeTab === 'qr' && styles.activeTab
                ]}
                onPress={() => setActiveTab('qr')}
              >
                <Ionicons 
                  name="qr-code" 
                  size={20} 
                  color={activeTab === 'qr' ? '#4A8D3D' : '#666'} 
                  style={styles.tabIcon}
                />
                <Text 
                  style={[
                    styles.tabText, 
                    activeTab === 'qr' && styles.activeTabText
                  ]}
                >
                  Scan QR Code
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.tab, 
                  activeTab === 'code' && styles.activeTab
                ]}
                onPress={() => setActiveTab('code')}
              >
                <Ionicons 
                  name="barcode" 
                  size={20} 
                  color={activeTab === 'code' ? '#4A8D3D' : '#666'} 
                  style={styles.tabIcon}
                />
                <Text 
                  style={[
                    styles.tabText, 
                    activeTab === 'code' && styles.activeTabText
                  ]}
                >
                  Enter Code
                </Text>
              </TouchableOpacity>
            </Animated.View>
            
            {activeTab === 'qr' ? (
              <Animated.View
                style={styles.scanSection}
                entering={FadeInDown.delay(300).duration(600)}
              >
                <ScanButton onScan={() => setTrackedProduct('mock')} />
                <Text style={styles.scanInstructions}>
                  Position the QR code within the frame to scan
                </Text>
              </Animated.View>
            ) : (
              <Animated.View
                style={styles.codeSection}
                entering={FadeInDown.delay(300).duration(600)}
              >
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter tracking or GI certificate code"
                    value={trackingCode}
                    onChangeText={setTrackingCode}
                    autoCapitalize="characters"
                  />
                  {trackingCode ? (
                    <TouchableOpacity 
                      style={styles.clearButton}
                      onPress={() => setTrackingCode('')}
                    >
                      <Ionicons name="close-circle" size={20} color="#999" />
                    </TouchableOpacity>
                  ) : null}
                </View>
                
                <TouchableOpacity 
                  style={styles.trackButton}
                  onPress={handleTrack}
                  disabled={!trackingCode}
                >
                  <Text style={styles.trackButtonText}>Track Product</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
            
            <Animated.View
              style={styles.recentSearches}
              entering={FadeInDown.delay(400).duration(600)}
            >
              <Text style={styles.recentTitle}>Recent Searches</Text>
              <View style={styles.recentItem}>
                <Ionicons name="time-outline" size={20} color="#666" style={styles.recentIcon} />
                <Text style={styles.recentText}>GI-2023-0394 (Darjeeling Tea)</Text>
              </View>
              <View style={styles.recentItem}>
                <Ionicons name="time-outline" size={20} color="#666" style={styles.recentIcon} />
                <Text style={styles.recentText}>GI-2022-1172 (Alphonso Mango)</Text>
              </View>
            </Animated.View>
          </View>
        ) : (
          <View style={styles.resultSection}>
            <Animated.View 
              style={styles.productHeader}
              entering={FadeInDown.delay(200).duration(600)}
            >
              <Image source={trackedProduct.image} style={styles.productImage} />
              <View style={styles.productInfo}>
                <View style={styles.productNameRow}>
                  <Text style={styles.productName}>{trackedProduct.name}</Text>
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="shield-checkmark" size={14} color="#fff" />
                  </View>
                </View>
                <View style={styles.productDetailRow}>
                  <Ionicons name="location-outline" size={16} color="#666" />
                  <Text style={styles.productDetail}>{trackedProduct.region}</Text>
                </View>
                <View style={styles.productDetailRow}>
                  <Ionicons name="document-text-outline" size={16} color="#666" />
                  <Text style={styles.productDetail}>
                    Certificate: {trackedProduct.certificate}
                  </Text>
                </View>
              </View>
            </Animated.View>
            
            <Animated.View
              style={styles.farmerSection}
              entering={FadeInDown.delay(300).duration(600)}
            >
              <Text style={styles.sectionTitle}>Producer Information</Text>
              <View style={styles.farmerCard}>
                <View style={styles.farmerIconContainer}>
                  <Ionicons name="person" size={24} color="#4A8D3D" />
                </View>
                <View style={styles.farmerInfo}>
                  <Text style={styles.farmerName}>{trackedProduct.farmer.name}</Text>
                  <Text style={styles.farmerLocation}>{trackedProduct.farmer.location}</Text>
                </View>
                <TouchableOpacity style={styles.viewProfileButton}>
                  <Text style={styles.viewProfileText}>View Profile</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
            
            <Animated.View
              style={styles.timelineSection}
              entering={FadeInDown.delay(400).duration(600)}
            >
              <Text style={styles.sectionTitle}>Product Journey</Text>
              <TraceTimeline events={trackedProduct.timeline} />
            </Animated.View>
            
            <Animated.View
              style={styles.certificateSection}
              entering={FadeInDown.delay(500).duration(600)}
            >
              <View style={styles.certificateContainer}>
                <View style={styles.certificateIconContainer}>
                  <Ionicons name="shield-checkmark" size={24} color="#4A8D3D" />
                </View>
                <View style={styles.certificateInfo}>
                  <Text style={styles.certificateTitle}>GI Certified</Text>
                  <Text style={styles.certificateText}>
                    This product has been verified as an authentic Geographical Indication product.
                  </Text>
                </View>
              </View>
            </Animated.View>
            
            <TouchableOpacity 
              style={styles.backButton}
              onPress={resetSearch}
            >
              <Text style={styles.backButtonText}>Track Another Product</Text>
            </TouchableOpacity>
          </View>
        )}
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
    marginBottom: 5,
  },
  searchSection: {
    paddingHorizontal: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#e6f7ec',
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#4A8D3D',
  },
  scanSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  scanInstructions: {
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
  },
  codeSection: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  trackButton: {
    backgroundColor: '#4A8D3D',
    borderRadius: 8,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  recentSearches: {
    marginBottom: 30,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  recentIcon: {
    marginRight: 10,
  },
  recentText: {
    fontSize: 14,
    color: '#333',
  },
  resultSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  productHeader: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  verifiedBadge: {
    backgroundColor: '#4A8D3D',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  productDetail: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  farmerSection: {
    marginBottom: 25,
  },
  farmerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
  },
  farmerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e6f7ec',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  farmerInfo: {
    flex: 1,
  },
  farmerName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  farmerLocation: {
    fontSize: 13,
    color: '#666',
  },
  viewProfileButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: '#4A8D3D',
  },
  viewProfileText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  timelineSection: {
    marginBottom: 25,
  },
  certificateSection: {
    marginBottom: 30,
  },
  certificateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f7ec',
    borderRadius: 8,
    padding: 15,
  },
  certificateIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  certificateInfo: {
    flex: 1,
  },
  certificateTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A8D3D',
    marginBottom: 4,
  },
  certificateText: {
    fontSize: 13,
    color: '#555',
  },
  backButton: {
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#4A8D3D',
    fontWeight: '600',
  },
});

export default Track;
