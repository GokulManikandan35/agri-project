import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, Alert, Animated, ScrollView, Modal } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import useAccordionAnimation from '../hooks/useAccordionAnimation';
import { Picker } from '@react-native-picker/picker';
import ImageGallery from './ImageGallery';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Constants
const VARIETIES = ["K1", "K2"];
const EVENT_TYPES = ["Harvest"];
const seedVarieties = ["K1", "K2"];

export default function HarvestDryingPackingForm({ seedVariety }) {
  // State variables
  const [expanded, setExpanded] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedVariety, setSelectedVariety] = useState('');
  const [photoUris, setPhotoUris] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [records, setRecords] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Use the custom accordion animation hook
  const { rotateArrow, getBodyStyle } = useAccordionAnimation(expanded);

  // Load saved data from AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem('HarvestDryingPackingFormData')
      .then(data => {
        if (data) {
          const saved = JSON.parse(data);
          setDate(new Date(saved.date));
          setSelectedVariety(saved.seedVariety);
          setPhotoUris(saved.photoUris || []);
          setIsSaved(saved.isSaved);
          console.log("Loaded saved Harvest:", saved);
        }
      })
      .catch(err => console.log("Error loading HarvestDryingPackingFormData", err));
  }, []);

  // Helper function to compare only date part (ignoring time)
  function isSameDay(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  // Function to handle saving data
  const handleSave = async () => {
    try {
      // Validation
      // if (!selectedVariety) throw new Error("Please select a seed variety.");
      if (photoUris.length === 0) throw new Error("Please capture at least one photo of the harvest.");

      // Create record object
      const newRecord = {
        id: Date.now(),
        date: date.toDateString(),
        variety: selectedVariety,
        photoUris,
        timestamp: new Date(),
      };

      setRecords([...records, newRecord]);
      setIsSaved(true);
      await AsyncStorage.setItem('HarvestDryingPackingFormData', JSON.stringify({
        date, seedVariety: selectedVariety, photoUris, isSaved: true
      }));
      Alert.alert("Success", "Harvest event recorded successfully.");
      setExpanded(false);
      
      // Reset form for next entry
      resetForm();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setSelectedVariety('');
    setDate(new Date());
    setPhotoUris([]);
  };

  // Function to handle cancel
  const handleCancel = () => {
    Alert.alert(
      "Discard Changes",
      "Are you sure you want to discard your changes?",
      [
        { text: "No", style: "cancel" },
        { text: "Yes", onPress: () => {
            resetForm();
            setIsSaved(false);
            setExpanded(false);
          }
        }
      ]
    );
  };

  // Function to capture image
  const handleCaptureImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.status !== 'granted') {
        Alert.alert("Permission Denied", "Camera permission is required.");
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled) {
        setPhotoUris([...photoUris, result.assets[0].uri]);
        Alert.alert("Success", "Image captured successfully!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to capture image: " + error.message);
    }
  };

  // Check if completed today
  const today = new Date();
  const isCompleted = isSaved && isSameDay(date, today);

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.header} onPress={() => setExpanded(!expanded)}>
        <MaterialCommunityIcons name="barley" size={24} color="white" style={styles.headerIcon} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Harvest</Text>
        </View>
        {isCompleted && (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Completed</Text>
          </View>
        )}
        <Animated.View style={{ transform: [{ rotate: rotateArrow }] }}>
          <Ionicons name="chevron-down" size={22} color="#4CAF50" />
        </Animated.View>
      </TouchableOpacity>
      
      <View style={styles.accentLine} />

      {expanded && (
        <Animated.View style={[styles.body, getBodyStyle()]}>
          {/* Seed Variety Selection */}
          <Text style={styles.label}>Seed Variety</Text>
          <View style={styles.disabledField}>
            <Text style={styles.disabledText}>
              {seedVariety ? seedVariety : "Not selected"}
            </Text>
          </View>

          {/* Date Selection */}
          <Text style={styles.label}>Date of Harvest</Text>
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

          {/* Photo Capture */}
          <Text style={styles.label}>Photos (Geo-tagged)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
            {photoUris.length === 0 ? (
              <View style={styles.squarePlaceholder}>
                <Text style={styles.imagePlaceholder}>No images captured</Text>
              </View>
            ) : (
              photoUris.map((uri, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.squareImageBox}
                  onPress={() => {
                    setSelectedImage(uri);
                    setModalVisible(true);
                  }}
                >
                  <Image source={{ uri }} style={styles.squareImage} />
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
                <Image source={{ uri: selectedImage }} style={styles.modalImage} resizeMode="contain" />
              )}
            </View>
          </Modal>

          <TouchableOpacity style={styles.captureButton} onPress={handleCaptureImage}>
            <Text style={styles.captureButtonText}>Capture Image</Text>
          </TouchableOpacity>

          {/* Previous Records Summary (if any) */}
          {records.length > 0 && (
            <View style={styles.recordsContainer}>
              <Text style={styles.recordsTitle}>Previous Records</Text>
              <ScrollView style={styles.recordsList} nestedScrollEnabled={true}>
                {records.map(record => (
                  <View key={record.id} style={styles.recordItem}>
                    <Text style={styles.recordType}>
                      {record.variety ? `Variety: ${record.variety}` : ''}
                    </Text>
                    <Text style={styles.recordDate}>
                      {record.date}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>

          {isSaved && (
            <TouchableOpacity style={styles.modifyButton}>
              <Text style={styles.buttonText}>Request Modification</Text>
            </TouchableOpacity>
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
  accentLine: {
    height: 3,
    backgroundColor: '#A5D6A7',
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
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#EEE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 4,
  },
  selectedTag: {
    backgroundColor: '#4CAF50',
    borderLeftWidth: 3,
    borderLeftColor: '#A5D6A7',
  },
  tagText: {
    color: '#555',
  },
  selectedTagText: {
    color: 'white',
    fontWeight: '600',
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
  recordsContainer: {
    marginTop: 20,
    marginBottom: 16,
  },
  recordsTitle: {
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  recordsList: {
    maxHeight: 120,
  },
  recordItem: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  recordType: {
    fontWeight: '600',
  },
  recordDate: {
    color: '#666',
    fontSize: 12,
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
  },
  buttonText: {
    color: '#4CAF50',
    fontWeight: '600',
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
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  squareImageBox: {
    width: 100,
    height: 100,
    marginRight: 8,
    borderRadius: 8,
    overflow: 'hidden',
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
    zIndex: 1,
  },
  modalImage: {
    width: '90%',
    height: '70%',
  },
});
