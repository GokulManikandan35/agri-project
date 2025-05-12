import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  StyleSheet, 
  Alert, 
  Animated, 
  ScrollView, 
  Modal,
  ActivityIndicator 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import useAccordionAnimation from '../hooks/useAccordionAnimation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const seedVarieties = ['K1', 'K2'];

export default function TransplantingForm({ seedVariety, setSeedVariety }) {
  const [expanded, setExpanded] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [photoBase64s, setPhotoBase64s] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageBase64, setSelectedImageBase64] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use the custom accordion animation hook
  const { rotateArrow, getBodyStyle } = useAccordionAnimation(expanded);

  // Helper function to format Base64 for Image component source
  const formatBase64ForImage = (base64) => {
    // ImagePicker provides Base64 without the data URI prefix
    // Add the prefix expected by the Image component
    return `data:image/jpeg;base64,${base64}`; // Assuming JPEG, adjust if needed
  };

  // Load saved data from AsyncStorage on component mount
  useEffect(() => {
    const loadFormData = async () => {
      try {
        const data = await AsyncStorage.getItem('TransplantingFormData');
        if (data) {
          const saved = JSON.parse(data);
          setDate(new Date(saved.date));
          setSeedVariety(saved.seedVariety);
          setQuantity(saved.quantity);
          setPhotoBase64s(saved.photoBase64s || []);
          setIsSaved(saved.isSaved);
          console.log("Loaded TransplantingFormData", saved);
        }
      } catch (err) {
        console.log("Error loading TransplantingFormData", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFormData();
  }, []);

  // Helper function to compare only date part (ignoring time)
  function isSameDay(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  function isSameOrBefore(date1, date2) {
    return (
      date1.getFullYear() < date2.getFullYear() ||
      (date1.getFullYear() === date2.getFullYear() && date1.getMonth() < date2.getMonth()) ||
      (date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() <= date2.getDate())
    );
  }

  const handleSave = async () => {
    const today = new Date();

    // Prevent saving if still loading or if already saved and completed today
    if (isLoading || (isSaved && isSameDay(date, today))) {
      if (isLoading) {
        Alert.alert("Info", "Form is currently loading. Please wait.");
      } else if (isSaved && isSameDay(date, today)) {
        Alert.alert("Info", "Transplanting form is already marked as completed for today.");
      }
      return;
    }

    try {
      if (!quantity || isNaN(parseFloat(quantity))) {
        throw new Error("Please enter a valid numeric quantity.");
      }
      if (!seedVariety) {
        throw new Error("Please select a seed variety.");
      }

      // Prepare data to send - including Base64 images
      const payload = {
        date: date.toISOString(), // convert to string
        seedVariety,
        quantity,
        photoBase64s, // Now sending the array of Base64 strings
        isSaved: true, // Mark as saved upon successful save
      };

      console.log("Payload being sent to backend:", JSON.stringify(payload, null, 2)); // Log the payload just before sending

      // Send data to backend
      const response = await axios.post(
        'http://4.247.169.244:8080/generate-qr/',
        payload, // Pass the payload object directly
        { headers: { 'Content-Type': 'application/json' } } // Explicitly set Content-Type
      );

      console.log("Backend response status:", response.status); // Log response status
      console.log("Backend response data:", response.data); // Log response data

      // Save data to AsyncStorage only upon successful backend response
      // Ensure you save photoBase64s instead of photoUris
      await AsyncStorage.setItem(
        'TransplantingFormData',
        JSON.stringify({ ...payload, photoBase64s: photoBase64s }) // Save the Base64 data
      );

      setIsSaved(true); // Update isSaved state after successful save and AsyncStorage update
      Alert.alert("Success", "Data saved and sent to backend successfully.");
      setExpanded(false); // Collapse the form after saving
    } catch (error) {
      console.log("Axios request error:", error); // Log the full error object

      let errorMessage = "Failed to save/send data."; // Default error message

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("Error response data:", error.response.data);
        console.log("Error response status:", error.response.status);
        console.log("Error response headers:", error.response.headers);
        errorMessage = error.response.data?.error || `Server responded with status ${error.response.status}`; // Use error.response.data?.error
      } else if (error.request) {
        // The request was made but no response was received
        console.log("Error request:", error.request);
        errorMessage = "No response received from server. Check network connection and server status.";
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error message:", error.message);
        errorMessage = error.message;
      }

      Alert.alert("Save Error", errorMessage);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      "Discard Changes",
      "Are you sure you want to discard your changes?",
      [
        { text: "No", style: "cancel" },
        { text: "Yes", onPress: () => {
            // Reset form fields to initial values
            setDate(new Date());
            setSeedVariety('');
            setQuantity('');
            setPhotoBase64s([]);
            setIsSaved(false);
            setExpanded(false);
        }}
      ]
    );
  };

  const handleCaptureImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.status !== 'granted') {
        Alert.alert("Permission Denied", "Camera permission is required to capture an image.");
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.7,
        base64: true, // Request Base64 directly from ImagePicker
      });
      
      if (!result.canceled) {
        if (result.assets && result.assets.length > 0) {
          const asset = result.assets[0];
          if (asset.base64) {
            // Store the Base64 string provided by ImagePicker
            setPhotoBase64s([...photoBase64s, asset.base64]);
            Alert.alert("Success", "Image captured and encoded successfully!");
          } else {
            // Fallback or error if base64 is not provided (shouldn't happen if base64: true)
            Alert.alert("Encoding Failed", "ImagePicker did not provide Base64 data.");
            console.error("ImagePicker result missing base64:", asset);
          }
        } else {
          Alert.alert("Capture Failed", "No image asset found in the capture result.");
        }
      }
    } catch (error) {
      Alert.alert("Capture Error", "Failed to capture or encode image: " + error.message);
      console.error("Image capture/encoding error:", error);
    }
  };

  const today = new Date();
  const isCompleted = isSameOrBefore(date, today);
  const isPending = !isCompleted;

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.header} onPress={() => setExpanded(!expanded)}>
        <View style={styles.headerIcon}>
          <MaterialCommunityIcons name="seed-outline" size={20} color="white" />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Transplanting</Text>
        </View>
        {/* Status badge */}
        {!isLoading && (
          isCompleted ? (
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Completed</Text>
            </View>
          ) : (
            <View style={[styles.statusBadge, { backgroundColor: '#FFF9C4', borderColor: '#FBC02D' }]}>
              <Text style={[styles.statusText, { color: '#F57F17' }]}>Pending</Text>
            </View>
          )
        )}
        <Animated.View style={{ transform: [{ rotate: rotateArrow }] }}>
          <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={24} color="#4CAF50" />
        </Animated.View>
      </TouchableOpacity>

      {expanded && (
        <Animated.View style={[styles.body, getBodyStyle()]}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#4CAF50" />
          ) : (
            <>
              <Text style={styles.label}>Date of Transplanting</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
                <Text style={styles.dateText}>{date.toDateString()}</Text>
                <Ionicons name="calendar" size={20} color="green" />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) setDate(selectedDate);
                  }}
                />
              )}

              <Text style={styles.label}>Seed Variety</Text>
              <View style={styles.dropdownContainer}>
                <Picker
                  selectedValue={seedVariety}
                  onValueChange={(itemValue) => setSeedVariety(itemValue)}
                  style={styles.picker}
                  dropdownIconColor="#4CAF50"
                  mode="dropdown"
                >
                  <Picker.Item label="Select Seed Variety" value="" color="#888" />
                  {seedVarieties.map((type) => (
                    <Picker.Item key={type} label={type} value={type} color="#222" />
                  ))}
                </Picker>
              </View>

              <Text style={styles.label}>Quantity (Kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter quantity"
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
              />

              <Text style={styles.label}>Photos (Geo-tagged)</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
                {photoBase64s.length === 0 ? (
                  <View style={styles.squarePlaceholder}>
                    <Text style={styles.imagePlaceholder}>No images captured</Text>
                  </View>
                ) : (
                  // Render images from Base64 strings
                  photoBase64s.map((base64, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.squareImageBox}
                      onPress={() => {
                        setSelectedImageBase64(base64); // Store Base64 for modal
                        setModalVisible(true);
                      }}
                    >
                      {/* Image source using data URI */}
                      <Image source={{ uri: formatBase64ForImage(base64) }} style={styles.squareImage} />
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
              <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
              >
                <View style={styles.modalContainer}>
                  <TouchableOpacity style={styles.modalClose} onPress={() => setModalVisible(false)}>
                    <Ionicons name="close-circle" size={40} color="#fff" />
                  </TouchableOpacity>
                  {/* Modal image source using data URI */}
                  {selectedImageBase64 && (
                    <Image 
                      source={{ uri: formatBase64ForImage(selectedImageBase64) }} 
                      style={styles.modalImage} 
                      resizeMode="contain" 
                    />
                  )}
                </View>
              </Modal>

              <TouchableOpacity style={styles.captureButton} onPress={handleCaptureImage}>
                <Text style={styles.captureButtonText}>Capture Image</Text>
              </TouchableOpacity>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                {/* Disable Save button while loading or if completed today */}
                <TouchableOpacity 
                  style={[styles.button, styles.saveButton, (isLoading || (isSaved && isSameOrBefore(date, today))) && styles.disabledButton]} 
                  onPress={handleSave}
                  disabled={isLoading || (isSaved && isSameOrBefore(date, today))}
                >
                  <Text style={styles.saveButtonText}>{isLoading ? 'Saving...' : 'Save'}</Text>
                </TouchableOpacity>
              </View>

              {isSaved && (
                <TouchableOpacity style={styles.modifyButton}>
                  <Text style={styles.buttonText}>Request Modification</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4CAF50',
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 14,
    borderBottomWidth: 1,
    borderColor: '#C8E6C9',
  },
  headerIcon: {
    backgroundColor: '#4CAF50',
    padding: 6,
    borderRadius: 16,
    marginRight: 10,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#2E7D32',
  },
  statusBadge: {
    backgroundColor: '#C8E6C9',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '500',
  },
  body: {
    padding: 16,
  },
  label: {
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
    color: '#333',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dateText: {
    fontWeight: '600',
    color: '#2E7D32',
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    marginTop: 6,
    marginBottom: 6,
    overflow: 'hidden',
    backgroundColor: '#F8FFF8',
    minHeight: 44,
    justifyContent: 'center',
  },
  picker: {
    height: 54,
    width: '100%',
    color: '#222',
    backgroundColor: 'transparent',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  tag: {
    backgroundColor: '#EEE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 4,
  },
  selectedTag: {
    backgroundColor: '#A5D6A7',
  },
  tagText: {
    color: '#555',
  },
  selectedTagText: {
    color: 'white',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    backgroundColor: '#fff',
  },
  imageBox: {
    height: 100,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    marginTop: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imagePlaceholder: {
    color: '#AAA',
    fontSize: 12,
    textAlign: 'center',
    padding: 5,
  },
  captureButton: {
    marginTop: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  captureButtonText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#555',
    fontWeight: '500',
  },
  modifyButton: {
    marginTop: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  buttonText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  squarePlaceholder: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginRight: 10,
  },
  squareImageBox: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  squareImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 2,
  },
  modalImage: {
    width: '90%',
    height: '70%',
    borderRadius: 12,
  },
  disabledButton: {
    backgroundColor: '#A5D6A7', // Lighter green for disabled save button
    borderColor: '#A5D6A7',
  },
});
