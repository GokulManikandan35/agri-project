import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, Alert, Animated, ScrollView, Modal } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import useAccordionAnimation from '../hooks/useAccordionAnimation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const seedVarieties = ['K1', 'K2'];

export default function TransplantingForm({ seedVariety, setSeedVariety }) {
  const [expanded, setExpanded] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [photoUris, setPhotoUris] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Use the custom accordion animation hook
  const { rotateArrow, getBodyStyle } = useAccordionAnimation(expanded);

  // Load saved data from AsyncStorage on component mount
  useEffect(() => {
    AsyncStorage.getItem('TransplantingFormData')
      .then(data => {
        if (data) {
          const saved = JSON.parse(data);
          setDate(new Date(saved.date));
          setSeedVariety(saved.seedVariety);
          setQuantity(saved.quantity);
          setPhotoUris(saved.photoUris || []);
          setIsSaved(saved.isSaved);
          console.log("Loaded TransplantingFormData", saved);
        }
      })
      .catch(err => console.log("Error loading TransplantingFormData", err));
  }, []);

  // Helper function to compare only date part (ignoring time)
  function isSameDay(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  const handleSave = async () => {
    try {
      if (!quantity || isNaN(parseFloat(quantity))) {
        throw new Error("Please enter a valid numeric quantity.");
      }
      if (!seedVariety) {
        throw new Error("Please select a seed variety.");
      }
      setIsSaved(true);
      await AsyncStorage.setItem('TransplantingFormData', JSON.stringify({
        date, seedVariety, quantity, photoUris, isSaved: true
      }));
      Alert.alert("Success", "Transplanting event recorded successfully.");
      setExpanded(false);
    } catch (error) {
      Alert.alert("Save Error", error.message);
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
            setPhotoUris([]);
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
      });
      if (!result.canceled) {
        setPhotoUris([...photoUris, result.assets[0].uri]);
        Alert.alert("Image Captured", "Your photo has been captured successfully.");
      }
    } catch (error) {
      Alert.alert("Capture Error", "Failed to capture image: " + error.message);
    }
  };

  const today = new Date();
  const isCompleted = isSaved && isSameDay(date, today);

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.header} onPress={() => setExpanded(!expanded)}>
        <MaterialCommunityIcons name="seed-outline" size={24} color="white" style={styles.headerIcon} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Transplanting</Text>
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

      {expanded && (
        <Animated.View style={[styles.body, getBodyStyle()]}>
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
  },
  modalImage: {
    width: '90%',
    height: '70%',
  },
});
