import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

const SignupForm = ({ onSubmit, userType, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    photo: '',
    dob: new Date(),
    district: '',
    block: '',
    village: '',
    landSize: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);
  
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.phone || 
        !formData.password || !formData.confirmPassword) {
      alert("Please fill in all fields");
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return false;
    }
    
    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      return false;
    }
    
    if (formData.phone.length < 10) {
      alert("Please enter a valid phone number");
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.dob;
    setShowDatePicker(Platform.OS === 'ios');
    handleChange('dob', currentDate);
  };

  const formatDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required', 
          'Sorry, we need camera roll permissions to upload photos!'
        );
        return false;
      }
    }
    return true;
  };
  
  const handlePhotoSelect = async () => {
    const permissionGranted = await requestPermissions();
    
    if (!permissionGranted) return;
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        setPhotoUri(selectedAsset.uri);
        handleChange('photo', selectedAsset.uri);
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Error', 'Failed to select photo. Please try again.');
    }
  };

  const renderUserTypeFields = () => {
    switch (userType) {
      case 'farmer':
        return (
          <>
            <View style={styles.inputContainer}>
              <Ionicons name="camera-outline" size={20} color="#666" style={styles.inputIcon} />
              <TouchableOpacity 
                style={styles.photoButton}
                onPress={handlePhotoSelect}
              >
                <Text style={styles.photoButtonText}>
                  {photoUri ? 'Change Photo' : 'Upload Farmer Photo'}
                </Text>
              </TouchableOpacity>
              {photoUri && (
                <View style={styles.photoPreviewContainer}>
                  <Image 
                    source={{ uri: photoUri }} 
                    style={styles.photoPreview} 
                  />
                </View>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="calendar-outline" size={20} color="#666" style={styles.inputIcon} />
              <TouchableOpacity
                style={styles.dobButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dobText}>
                  {formData.dob ? formatDate(formData.dob) : 'Select Date of Birth'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {showDatePicker && (
              <DateTimePicker
                value={formData.dob || new Date()}
                mode="date"
                display="default"
                onChange={onDateChange}
                maximumDate={new Date()}
              />
            )}

            <View style={styles.inputContainer}>
              <Ionicons name="map-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="District"
                value={formData.district}
                onChangeText={(value) => handleChange('district', value)}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="business-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Block"
                value={formData.block}
                onChangeText={(value) => handleChange('block', value)}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="home-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Village"
                value={formData.village}
                onChangeText={(value) => handleChange('village', value)}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="resize-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Land Size (acres)"
                value={formData.landSize}
                onChangeText={(value) => handleChange('landSize', value)}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Farm Location"
                onChangeText={(value) => handleChange('location', value)}
                autoCapitalize="words"
              />
            </View>
          </>
        );
      case 'fpo':
        return (
          <View style={styles.inputContainer}>
            <Ionicons name="people-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="FPO Name"
              onChangeText={(value) => handleChange('organizationName', value)}
              autoCapitalize="words"
            />
          </View>
        );
      case 'processor':
        return (
          <View style={styles.inputContainer}>
            <Ionicons name="business-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Company Name"
              onChangeText={(value) => handleChange('companyName', value)}
              autoCapitalize="words"
            />
          </View>
        );
      default:
        return null;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={formData.name}
          onChangeText={(value) => handleChange('name', value)}
          autoCapitalize="words"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={formData.email}
          onChangeText={(value) => handleChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={formData.phone}
          onChangeText={(value) => handleChange('phone', value)}
          keyboardType="phone-pad"
        />
      </View>
      
      {renderUserTypeFields()}
      
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={formData.password}
          onChangeText={(value) => handleChange('password', value)}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#666" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChangeText={(value) => handleChange('confirmPassword', value)}
          secureTextEntry={!showConfirmPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
          <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#666" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.privacyText}>
        By signing up, you agree to our{' '}
        <Text style={styles.linkText}>Terms of Service</Text> and{' '}
        <Text style={styles.linkText}>Privacy Policy</Text>
      </Text>
      
      <TouchableOpacity 
        style={styles.signupButton} 
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.signupButtonText}>Create Account</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    color: '#333',
  },
  inputIcon: {
    marginLeft: 5,
  },
  eyeIcon: {
    padding: 10,
  },
  photoButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  photoButtonText: {
    color: '#4A8D3D',
  },
  dobButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  dobText: {
    color: '#333',
  },
  privacyText: {
    color: '#666',
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  linkText: {
    color: '#4A8D3D',
    fontWeight: '500',
  },
  signupButton: {
    backgroundColor: '#4A8D3D',
    borderRadius: 8,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  photoPreviewContainer: {
    marginLeft: 10,
    marginRight: 5,
  },
  photoPreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4A8D3D',
  },
});

export default SignupForm;
