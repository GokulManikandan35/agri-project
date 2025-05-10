import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

const Profile = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [language, setLanguage] = useState('English');
  
  const handleLogin = () => {
    // Debug: check if router exists and has push
    if (router && typeof router.push === 'function') {
      router.push('farmer/auth/login');
    } else {
      console.log('Router not available or push not a function', router);
      // Optionally, fallback to navigation if using React Navigation:
      // navigation.navigate('Login');
    }
  };
  
  const handleSignup = () => {
    router.push('/auth/signup');
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
  };
  
  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };
  
  const toggleDarkMode = () => {
    setDarkModeEnabled(!darkModeEnabled);
  };

  const renderLoggedOutState = () => (
    <Animated.View 
      style={styles.loginPrompt}
      entering={FadeInDown.delay(200).duration(600)}
    >
      <Text style={styles.loginText}>
        Sign in to track your favorite products and connect with farmers
      </Text>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.loginButton, styles.signupButton]} 
          onPress={handleSignup}
        >
          <Text style={[styles.loginButtonText, styles.signupButtonText]}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
  
  const renderLoggedInState = () => (
    <Animated.View 
      style={styles.userInfoContainer}
      entering={FadeInDown.delay(200).duration(600)}
    >
      <Image 
        source={require('../../../assets/images/farmer1.jpg')} 
        style={styles.userImage} 
      />
      
      <View style={styles.userInfo}>
        <Text style={styles.userName}>John Doe</Text>
        <Text style={styles.userEmail}>johndoe@example.com</Text>
      </View>
      
      <TouchableOpacity style={styles.editButton}>
        <Ionicons name="pencil" size={18} color="#4A8D3D" />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={styles.header}
        entering={FadeIn.duration(600)}
      >
        <Text style={styles.title}>My Profile</Text>
      </Animated.View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {isLoggedIn ? renderLoggedInState() : renderLoggedOutState()}
        
        {/* Settings Section */}
        <Animated.View 
          style={styles.settingsSection}
          entering={FadeInDown.delay(300).duration(600)}
        >
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications-outline" size={20} color="#555" style={styles.settingIcon} />
              <Text style={styles.settingText}>Push Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#d1d1d1', true: '#bcdfc1' }}
              thumbColor={notificationsEnabled ? '#4A8D3D' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon-outline" size={20} color="#555" style={styles.settingIcon} />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#d1d1d1', true: '#bcdfc1' }}
              thumbColor={darkModeEnabled ? '#4A8D3D' : '#f4f3f4'}
            />
          </View>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="language" size={20} color="#555" style={styles.settingIcon} />
              <Text style={styles.settingText}>Language</Text>
            </View>
            <View style={styles.settingAction}>
              <Text style={styles.settingValue}>{language}</Text>
              <Ionicons name="chevron-forward" size={18} color="#999" />
            </View>
          </TouchableOpacity>
        </Animated.View>
        
        {/* Preferences Section */}
        <Animated.View 
          style={styles.preferencesSection}
          entering={FadeInDown.delay(400).duration(600)}
        >
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="heart-outline" size={20} color="#555" style={styles.settingIcon} />
              <Text style={styles.settingText}>Saved Products</Text>
            </View>
            <View style={styles.settingAction}>
              <Text style={styles.settingValue}>3 items</Text>
              <Ionicons name="chevron-forward" size={18} color="#999" />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="leaf-outline" size={20} color="#555" style={styles.settingIcon} />
              <Text style={styles.settingText}>Favorite Farmers</Text>
            </View>
            <View style={styles.settingAction}>
              <Text style={styles.settingValue}>2 farmers</Text>
              <Ionicons name="chevron-forward" size={18} color="#999" />
            </View>
          </TouchableOpacity>
        </Animated.View>
        
        {/* Support Section */}
        <Animated.View 
          style={styles.supportSection}
          entering={FadeInDown.delay(500).duration(600)}
        >
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="help-circle-outline" size={20} color="#555" style={styles.settingIcon} />
              <Text style={styles.settingText}>Help Center</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="chatbubble-ellipses-outline" size={20} color="#555" style={styles.settingIcon} />
              <Text style={styles.settingText}>Contact Us</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="document-text-outline" size={20} color="#555" style={styles.settingIcon} />
              <Text style={styles.settingText}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
        </Animated.View>
        
        {isLoggedIn && (
          <Animated.View 
            entering={FadeInDown.delay(600).duration(600)}
            style={styles.logoutContainer}
          >
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={18} color="#fff" style={styles.logoutIcon} />
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
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
    marginBottom: 10,
  },
  loginPrompt: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
  },
  loginText: {
    fontSize: 15,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loginButton: {
    flex: 1,
    backgroundColor: '#4A8D3D',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  signupButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4A8D3D',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signupButtonText: {
    color: '#4A8D3D',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 20,
  },
  userImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e6f7ec',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsSection: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  preferencesSection: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  supportSection: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 15,
    color: '#333',
  },
  settingAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: '#999',
    marginRight: 5,
  },
  logoutContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  logoutButton: {
    backgroundColor: '#ff5252',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  versionInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
  }
});

export default Profile;
