import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, Alert, Animated, ScrollView, Modal, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import useAccordionAnimation from '../hooks/useAccordionAnimation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const seedVarieties = ["K1", "K2"];

export default function PackingForm({ seedVariety }) {
  const [expanded, setExpanded] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [Quantity, setQuantity] = useState('');
  const [photoBase64s, setPhotoBase64s] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { rotateArrow, getBodyStyle } = useAccordionAnimation(expanded);

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const data = await AsyncStorage.getItem('PackingFormData');
        if (data) {
          const saved = JSON.parse(data);
          console.log("Loaded PackingFormData", saved);
          if (saved.date) {
            setDate(new Date(saved.date));
          } else {
            setDate(new Date());
          }
          setQuantity(saved.Quantity);
          setPhotoBase64s(saved.photoBase64s || []);
          setIsSaved(saved.isSaved);
        } else {
          console.log("No PackingFormData found.");
        }
      } catch (err) {
        console.log("Error loading PackingFormData", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadFormData();
  }, []);

  function isSameDay(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  function isSameOrBefore(date1, date2) {
    // Returns true if date1 <= date2 (ignoring time)
    return (
      date1.getFullYear() < date2.getFullYear() ||
      (date1.getFullYear() === date2.getFullYear() && date1.getMonth() < date2.getMonth()) ||
      (date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() <= date2.getDate())
    );
  }

  const formatBase64ForImage = (base64) => {
    return `data:image/jpeg;base64,${base64}`;
  };

  const handleSave = async () => {
    const today = new Date();

    if (isLoading || (isSaved && isSameOrBefore(date, today))) {
      if (isLoading) {
        Alert.alert("Info", "Form is currently loading. Please wait.");
      } else if (isSaved && isSameOrBefore(date, today)) {
        Alert.alert("Info", "Packing form is already marked as completed for today.");
      }
      return;
    }

    try {
      if (!seedVariety) {
        Alert.alert("Validation Error", "Please select a seed variety.");
        return;
      }
      if (!Quantity || isNaN(parseFloat(Quantity))) {
        Alert.alert("Validation Error", "Please enter a valid Quantity.");
        return;
      }
      if (photoBase64s.length === 0) {
        Alert.alert("Validation Error", "Please capture at least one photo of the packed product.");
        return;
      }

      setIsLoading(true);

      const payload = {
        date: date.toISOString(),
        seedVariety,
        Quantity,
        photoBase64s,
        isSaved: true,
        formType: 'packing'
      };

      console.log("Preparing to send data to backend...");

      const response = await axios.post(
        'http://4.247.169.244:8080/generate-qr/',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log("Backend response status:", response.status);
      console.log("Backend response data:", response.data);

      await AsyncStorage.setItem('PackingFormData', JSON.stringify(payload));

      setIsSaved(true);
      Alert.alert("Success", "Packing event recorded successfully.");
      setExpanded(false);
    } catch (error) {
      console.log("Axios request error:", error);

      let errorMessage = "Failed to save/send data.";

      if (error.response) {
        console.log("Error response data:", error.response.data);
        console.log("Error response status:", error.response.status);
        console.log("Error response headers:", error.response.headers);
        errorMessage = error.response.data?.error || `Server responded with status ${error.response.status}`;
      } else if (error.request) {
        console.log("Error request:", error.request);
        errorMessage = "No response received from server. Check network connection and server status.";
      } else {
        console.log("Error message:", error.message);
        errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      "Discard Changes",
      "Are you sure you want to discard your changes?",
      [
        { text: "No", style: "cancel" },
        { text: "Yes", onPress: () => {
            setQuantity('');
            setPhotoBase64s([]);
            setIsSaved(false);
            setExpanded(false);
          }
        }
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
        base64: true,
      });

      if (!result.canceled) {
        if (result.assets && result.assets.length > 0) {
          const asset = result.assets[0];
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
        <MaterialCommunityIcons name="package-variant-closed" size={24} color="white" style={styles.headerIcon} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Packing</Text>
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
              <Text style={styles.label}>Seed Variety</Text>
              <View style={styles.disabledField}>
                <Text style={styles.disabledText}>
                  {seedVariety ? seedVariety : "Not selected"}
                </Text>
              </View>

              <Text style={styles.label}>Date of Packing</Text>
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

              <Text style={styles.label}>Quantity (Kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Quantity"
                keyboardType="numeric"
                value={Quantity}
                onChangeText={setQuantity}
              />

              <Text style={styles.label}>Photos (Geo-tagged)</Text>
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
                    <Image
                      source={{ uri: formatBase64ForImage(selectedImage) }}
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

const screenWidth = Dimensions.get('window').width;

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
    marginBottom: 12,
  },
  dateText: {
    fontWeight: '600',
    color: '#2E7D32',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    marginBottom: 12,
  },
  squareImageBox: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
    backgroundColor: '#F5F5F5',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  squareImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  squarePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  imagePlaceholder: {
    color: '#AAA',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: screenWidth * 0.9,
    height: screenWidth * 0.9,
    borderRadius: 12,
  },
  modalClose: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 2,
  },
  captureButton: {
    marginTop: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
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
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    marginTop: 6,
    marginBottom: 6,
    overflow: 'hidden',
    backgroundColor: '#F8FFF8',
    minHeight: 50,
    justifyContent: 'center',
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
  picker: {
    height: 54,
    width: '100%',
    color: '#222',
    backgroundColor: 'transparent',
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
  disabledButton: {
    backgroundColor: '#A5D6A7',
    borderColor: '#A5D6A7',
  },
});
