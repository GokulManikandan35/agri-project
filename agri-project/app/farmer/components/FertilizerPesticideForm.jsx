import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, Alert, Animated, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import useAccordionAnimation from '../hooks/useAccordionAnimation';
import { Picker } from '@react-native-picker/picker';
import ImageGallery from './ImageGallery';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AppTypes = ["Fertilizer", "Pesticide"];
const seedVarieties = ["K1", "K2"];

// Add farm calendar event tracking
const getCurrentEventStatus = (date) => {
  const today = new Date();

  // Simple example of event tracking logic - customize based on your crop cycle
  const eventPhases = [
    {
      name: "Current Phase",
      start: new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 5
      ),
      end: new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 5
      ),
    },
    {
      name: "Next Phase",
      start: new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 6
      ),
      end: new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 15
      ),
    },
    // Add more phases as needed
  ];

  for (const phase of eventPhases) {
    if (date >= phase.start && date <= phase.end) {
      return phase.name;
    }
  }

  return null;
};

export default function FertilizerPesticideForm({ seedVariety }) {
  const [expanded, setExpanded] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [photoBase64s, setPhotoBase64s] = useState([]); // Store Base64 strings instead of URIs
  const [isSaved, setIsSaved] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  // Use the custom accordion animation hook
  const { rotateArrow, getBodyStyle } = useAccordionAnimation(expanded);

  useEffect(() => {
    const status = getCurrentEventStatus(new Date());
    setCurrentEvent(status);
  }, []);

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const data = await AsyncStorage.getItem('FertilizerPesticideFormData')
        if (data) {
          const saved = JSON.parse(data);
          setDate(new Date(saved.date));
          setSelectedType(saved.selectedType);
          setQuantity(saved.quantity);
          setPhotoBase64s(saved.photoBase64s || []); // Load Base64 strings
          setIsSaved(saved.isSaved);
          console.log("Loaded saved FertilizerPesticideFormData", saved);
        }
      } catch (err) {
        console.log("Error loading FertilizerPesticideFormData", err);
      } finally {
        setIsLoading(false); // Set loading to false after attempt
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

  // Helper function to format Base64 for Image component source
  const formatBase64ForImage = (base64) => {
    return `data:image/jpeg;base64,${base64}`;
  };

  const handleSave = async () => {
    const today = new Date();

    // Exit if still loading or if already saved and completed today
    if (isLoading || (isSaved && isSameDay(date, today))) {
      if (isLoading) {
        Alert.alert("Info", "Form is currently loading. Please wait.");
      } else if (isSaved && isSameDay(date, today)) {
        Alert.alert("Info", "Fertilizer & Pesticide form is already marked as completed for today.");
      }
      return;
    }

    try {
      // Form validation
      if (!selectedType) {
        Alert.alert("Validation Error", "Please select an application type.");
        return;
      }
      if (!seedVariety) {
        Alert.alert("Validation Error", "Please select a seed variety.");
        return;
      }
      if (!quantity || isNaN(parseFloat(quantity))) {
        Alert.alert("Validation Error", "Please enter a valid quantity.");
        return;
      }
      if (photoBase64s.length === 0) {
        Alert.alert("Validation Error", "Please capture at least one photo.");
        return;
      }
      
      // Show loading indicator
      setIsLoading(true);
      
      // Prepare data to send to backend - including Base64 images
      const payload = {
        date: date.toISOString().split("T")[0], // 'YYYY-MM-DD'
        application_type: selectedType,         // Use snake_case to match model
        quantity,
        photo: photoBase64s[0] || "",           // Only send the first photo as 'photo'
      };

      console.log("Preparing to send data to backend...", JSON.stringify(payload, null, 2));

      // Send data to backend
      const response = await axios.post(
        'http://4.247.169.244:8080/create_fertilizer/',
        payload,
        { headers: { 'Content-Type': 'application/json' }, params: { id: 100 } }
      );

      console.log("Backend response status:", response.status);
      console.log("Backend response data:", response.data);

      // Save data to AsyncStorage only upon successful backend response
      await AsyncStorage.setItem('FertilizerPesticideFormData', JSON.stringify(payload));
      
      setIsSaved(true);
      Alert.alert("Success", "Event recorded successfully.");
      setExpanded(false);
    } catch (error) {
      console.log("Axios request error:", error);

      let errorMessage = "Failed to save/send data.";

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("Error response data:", error.response.data);
        console.log("Error response status:", error.response.status);
        console.log("Error response headers:", error.response.headers);
        errorMessage = error.response.data?.error || `Server responded with status ${error.response.status}`;
      } else if (error.request) {
        // The request was made but no response was received
        console.log("Error request:", error.request);
        errorMessage = "No response received from server. Check network connection and server status.";
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error message:", error.message);
        errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage);
    } finally {
      // Always reset loading state regardless of success or failure
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      "Discard Changes",
      "Are you sure you want to discard your changes?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes", onPress: () => {
            setDate(new Date());
            setSelectedType('');
            setQuantity('');
            setPhotoBase64s([]);
            setIsSaved(false);
            setExpanded(false);
          }
        }
      ]
    );
  };

  const pickPhoto = async () => {
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (perm.status !== "granted") {
        Alert.alert("Permission needed", "Camera permission is required to capture an image.");
        return;
      }
      
      const res = await ImagePicker.launchCameraAsync({
        quality: 0.7,
        base64: true, // Get Base64 directly from ImagePicker
      });
      
      if (!res.canceled) {
        if (res.assets && res.assets.length > 0) {
          const asset = res.assets[0];
          if (asset.base64) {
            setPhotoBase64s([...photoBase64s, asset.base64]);
            Alert.alert("Success", "Image captured and encoded successfully!");
          } else {
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
  const isCompleted = isSaved && isSameOrBefore(date, today);
  const isPending = !isCompleted;

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.header} onPress={() => setExpanded(!expanded)}>
        <MaterialCommunityIcons name="bottle-tonic" size={24} color="white" style={styles.headerIcon} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Fertilizer & Pesticide</Text>
        </View>
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
          <Ionicons name="chevron-down" size={22} color="#4CAF50" />
        </Animated.View>
      </TouchableOpacity>

      {expanded && (
        <Animated.View style={[styles.body, getBodyStyle()]}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#4CAF50" />
          ) : (
            <>
              <Text style={styles.label}>Application Type</Text>
              <View style={styles.tags}>
                {AppTypes.map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setSelectedType(t)}
                    style={[styles.tag, selectedType === t && styles.selectedTag]}
                  >
                    <Text
                      style={[
                        styles.tagText,
                        selectedType === t && styles.selectedTagText,
                      ]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Seed Variety</Text>
              <View style={styles.disabledField}>
                <Text style={styles.disabledText}>
                  {seedVariety ? seedVariety : "Not selected"}
                </Text>
              </View>

              <Text style={styles.label}>Date of Application</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>{date.toDateString()}</Text>
                <Ionicons name="calendar" size={20} color="green" />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={(e, d) => {
                    setShowDatePicker(false);
                    d && setDate(d);
                  }}
                />
              )}

              <Text style={styles.label}>
                Quantity ({selectedType === "Pesticide" ? "ml/gm" : "Kg"})
              </Text>
              <TextInput
                value={quantity}
                onChangeText={setQuantity}
                style={styles.input}
                keyboardType="numeric"
                placeholder="Enter quantity"
              />

              <Text style={styles.label}>Photo (Geo‑tagged)</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
                {photoBase64s.length === 0 ? (
                  <View style={styles.squarePlaceholder}>
                    <Text style={styles.imagePlaceholder}>No images captured</Text>
                  </View>
                ) : (
                  photoBase64s.map((base64, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.squareImageBox}
                      onPress={() => {
                        setSelectedImage(base64);
                        setModalVisible(true);
                      }}
                    >
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
                  {selectedImage && (
                    <Image source={{ uri: formatBase64ForImage(selectedImage) }} style={styles.modalImage} resizeMode="contain" />
                  )}
                </View>
              </Modal>

              <TouchableOpacity style={styles.captureButton} onPress={pickPhoto}>
                <Text style={styles.captureButtonText}>Capture Image</Text>
              </TouchableOpacity>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCancel}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
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
    borderColor: "#4CAF50",
    backgroundColor: "#fff",
    overflow: "hidden",
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#C8E6C9",
  },
  headerIcon: {
    backgroundColor: "#4CAF50",
    padding: 6,
    borderRadius: 16,
    marginRight: 10,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerText: {
    fontWeight: "600",
    fontSize: 16,
    color: "#2E7D32",
  },
  currentEventText: {
    fontSize: 12,
    color: "#616161",
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: "#C8E6C9",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 8,
  },
  statusText: { fontSize: 12, color: "#2E7D32", fontWeight: "500" },
  body: { padding: 16 },
  label: { fontWeight: "600", marginTop: 12, marginBottom: 4, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  tags: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
  tag: {
    backgroundColor: "#EEE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 4,
  },
  selectedTag: { backgroundColor: "#A5D6A7" },
  tagText: { color: "#555" },
  selectedTagText: { color: "#fff", fontWeight: "600" },
  dateInput: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dateText: { fontWeight: "600", color: "#2E7D32" },
  imageBox: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
    marginBottom: 12,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  imagePlaceholder: { color: "#AAA" },
  captureButton: {
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  captureButtonText: { color: "#4CAF50", fontWeight: "600" },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    marginRight: 8,
  },
  saveButtonText: { color: "#fff", fontWeight: "600" },
  cancelButtonText: { color: "#555", fontWeight: "500" },
  modifyButton: {
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#4CAF50", fontWeight: "600" },
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
  disabledField: {
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
  },
  disabledText: {
    color: '#666',
    fontSize: 15,
  },
  squarePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  squareImageBox: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 8,
  },
  squareImage: {
    width: '100%',
    height: '100%',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  modalImage: {
    width: '90%',
    height: '70%',
  },
  disabledButton: {
    backgroundColor: '#A5D6A7', // Lighter green for disabled save button
    borderColor: '#A5D6A7',
  },
});
