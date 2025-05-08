import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
  FadeIn,
  FadeInDown,
  FadeInUp
} from 'react-native-reanimated';

// Local components
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import TimelineStep from '../components/TimelineStep';
import TestimonialCard from '../components/TestimonialCard';
import SectionTitle from '../components/SectionTitle';

const { width } = Dimensions.get('window');

const Home = () => {
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // Hero section animated styles
  const heroAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [0, 200],
        [1, 0.8],
        Extrapolate.CLAMP
      ),
      transform: [
        { 
          translateY: interpolate(
            scrollY.value,
            [0, 200],
            [0, -50],
            Extrapolate.CLAMP
          ) 
        }
      ]
    };
  });

  // Featured products data
  const featuredProducts = [
    {
      id: '1',
      name: 'Madurai Jasmine',
      region: 'Tamil Nadu',
      image: require('../../assets/images/madurai-jasmine.jpeg'),
      verified: true
    },
    {
      id: '2',
      name: 'Darjeeling Tea',
      region: 'West Bengal',
      image: require('../../assets/images/dargeling-tea.jpg'),
      verified: true
    },
    {
      id: '3',
      name: 'Alphonso Mangoes',
      region: 'Maharashtra',
      image: require('../../assets/images/alphonso-mango.jpg'),
      verified: true
    },
    {
      id: '4',
      name: 'Coorg Oranges',
      region: 'Karnataka',
      image: require('../../assets/images/coorg-orange.jpg'),
      verified: true
    }
  ];

  // Testimonial data
  const testimonials = [
    {
      id: '1',
      name: 'Ramesh Kumar',
      role: 'Farmer, Tamil Nadu',
      image: require('../../assets/images/farmer1.jpg'),
      text: 'GI certification helped me get 30% better prices for my jasmine flowers. Buyers now trust the authenticity of my produce.'
    },
    {
      id: '2',
      name: 'Priya Sharma',
      role: 'Exporter, Delhi',
      image: require('../../assets/images/farmer2.jpeg'),
      text: 'The traceability feature gives our international buyers confidence about the origin and quality of Indian agricultural products.'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <Animated.View style={[styles.heroSection, heroAnimatedStyle]}>
          <Image
            source={require('../../assets/images/hero-bg.jpeg')}
            style={styles.heroBg}
          />
          <View style={styles.heroOverlay} />
          <Animated.View entering={FadeIn.delay(200).duration(1000)}>
            <Text style={styles.heroTitle}>Trace the Origin of Your Food</Text>
          </Animated.View>
          <Animated.View entering={FadeIn.delay(400).duration(1000)}>
            <Text style={styles.heroSubtitle}>
              Ensuring authentic, high-quality produce directly from verified farms
            </Text>
          </Animated.View>
          <Animated.View 
            style={styles.ctaContainer}
            entering={FadeInUp.delay(600).duration(800)}
          >
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>Explore GI Products</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.ctaButton, styles.secondaryCta]}>
              <Ionicons name="scan" size={20} color="#fff" style={styles.ctaIcon} />
              <Text style={styles.ctaButtonText}>Scan to Trace</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        {/* Search Section */}
        <Animated.View 
          style={styles.searchSection}
          entering={FadeInDown.delay(300).duration(800)}
        >
          <SearchBar />
          <TouchableOpacity style={styles.scanButton}>
            <Ionicons name="scan-outline" size={24} color="#4A8D3D" />
          </TouchableOpacity>
        </Animated.View>

        {/* Featured GI Products Section */}
        <View style={styles.section}>
          <SectionTitle title="Featured GI Products" subtitle="Geographical Indication certified products" />
          
          <FlatList
            data={featuredProducts}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
            renderItem={({ item, index }) => (
              <Animated.View
                entering={FadeInUp.delay(400 + (index * 100)).duration(800)}
              >
                <ProductCard product={item} />
              </Animated.View>
            )}
          />
        </View>

        {/* Traceability Timeline Section */}
        <View style={styles.section}>
          <SectionTitle 
            title="Product Journey" 
            subtitle="Follow the path from farm to your table" 
          />
          
          <Animated.View 
            style={styles.timelineContainer}
            entering={FadeIn.delay(600).duration(1000)}
          >
            <View style={styles.timelineLine} />
            
            <TimelineStep 
              icon="leaf-outline"
              title="Farm"
              description="Harvested by verified farmers following sustainable practices"
              delay={700}
            />
            
            <TimelineStep 
              icon="cart-outline"
              title="Collection Center"
              description="Quality check and aggregation at local collection centers"
              delay={900}
            />
            
            <TimelineStep 
              icon="cube-outline"
              title="Processing"
              description="Cleaning, sorting and packaging with minimal processing"
              delay={1100}
            />
            
            <TimelineStep 
              icon="globe-outline"
              title="Export"
              description="Shipped to domestic and international markets with care"
              delay={1300}
              isLast
            />
          </Animated.View>
        </View>

        {/* Why GI Matters Section */}
        <View style={styles.section}>
          <SectionTitle 
            title="Why GI Matters?" 
            subtitle="Geographical Indication is more than a label" 
          />
          
          <View style={styles.giInfoContainer}>
            <Animated.View 
              style={styles.giInfoCard}
              entering={FadeInUp.delay(800).duration(800)}
            >
              <View style={styles.giIconContainer}>
                <MaterialCommunityIcons name="shield-check" size={24} color="#4A8D3D" />
              </View>
              <Text style={styles.giInfoTitle}>Prevents Fraud</Text>
              <Text style={styles.giInfoText}>
                Protects authentic products from imitations and counterfeit goods
              </Text>
            </Animated.View>
            
            <Animated.View 
              style={styles.giInfoCard}
              entering={FadeInUp.delay(900).duration(800)}
            >
              <View style={styles.giIconContainer}>
                <FontAwesome5 name="hand-holding-usd" size={20} color="#4A8D3D" />
              </View>
              <Text style={styles.giInfoTitle}>Fair Price</Text>
              <Text style={styles.giInfoText}>
                Ensures farmers receive fair compensation for their specialized products
              </Text>
            </Animated.View>
            
            <Animated.View 
              style={styles.giInfoCard}
              entering={FadeInUp.delay(1000).duration(800)}
            >
              <View style={styles.giIconContainer}>
                <Ionicons name="heart" size={24} color="#4A8D3D" />
              </View>
              <Text style={styles.giInfoTitle}>Preserves Heritage</Text>
              <Text style={styles.giInfoText}>
                Promotes and protects traditional knowledge and cultural practices
              </Text>
            </Animated.View>
          </View>
        </View>

        {/* Testimonials Section */}
        <View style={styles.section}>
          <SectionTitle 
            title="What People Say" 
            subtitle="Hear from our farmers and exporters" 
          />
          
          <FlatList
            data={testimonials}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.testimonialsList}
            renderItem={({ item, index }) => (
              <Animated.View
                entering={FadeInUp.delay(1100 + (index * 100)).duration(800)}
              >
                <TestimonialCard testimonial={item} />
              </Animated.View>
            )}
          />
        </View>

        {/* Footer Section */}
        <View style={styles.footer}>
          <Animated.View 
            style={styles.footerTop}
            entering={FadeIn.delay(1200).duration(800)}
          >
            <Image
              source={require('../../assets/images/agri_logo.jpg')}
              style={styles.footerLogo}
            />
            <Text style={styles.footerText}>
              Connecting farmers, buyers and consumers through transparency and traceability
            </Text>
          </Animated.View>
          
          <View style={styles.footerLinks}>
            <TouchableOpacity>
              <Text style={styles.footerLink}>About Us</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Admin Login</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.footerBottom}>
            <Text style={styles.copyright}>© 2023 Agri Traceability</Text>
            <View style={styles.socialLinks}>
              <TouchableOpacity style={styles.socialIcon}>
                <Ionicons name="logo-facebook" size={20} color="#4A8D3D" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon}>
                <Ionicons name="logo-twitter" size={20} color="#4A8D3D" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon}>
                <Ionicons name="logo-instagram" size={20} color="#4A8D3D" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heroSection: {
    height: 400,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 30,
    marginBottom: 30,
  },
  ctaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  ctaButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#4A8D3D',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 10,
  },
  secondaryCta: {
    backgroundColor: '#345C8B',
  },
  ctaButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  ctaIcon: {
    marginRight: 6,
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: -25,
    marginBottom: 20,
    alignItems: 'center',
  },
  scanButton: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  productsList: {
    paddingVertical: 10,
  },
  timelineContainer: {
    position: 'relative',
    paddingVertical: 10,
    paddingLeft: 30,
  },
  timelineLine: {
    position: 'absolute',
    left: 36,
    top: 40,
    bottom: 40,
    width: 2,
    backgroundColor: '#4A8D3D',
  },
  giInfoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  giInfoCard: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  giIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e6f7ec',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  giInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  giInfoText: {
    fontSize: 13,
    color: '#666',
  },
  testimonialsList: {
    paddingVertical: 10,
  },
  footer: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  footerTop: {
    alignItems: 'center',
    marginBottom: 20,
  },
  footerLogo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 15,
  },
  footerText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginHorizontal: 20,
  },
  footerLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  footerLink: {
    color: '#4A8D3D',
    fontSize: 14,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  footerBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 20,
  },
  copyright: {
    color: '#666',
    fontSize: 12,
  },
  socialLinks: {
    flexDirection: 'row',
  },
  socialIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
});

export default Home;
