import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, Alert, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import useAccordionAnimation from '../hooks/useAccordionAnimation';

// Added seed varieties constant
const VARIETIES = ["K1", "K2"];

export default function PackingForm() {
  const [expanded, setExpanded] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [selectedVariety, setSelectedVariety] = useState(''); // Added state for seed variety
  const [photoUri, setPhotoUri] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  
  // Use the custom accordion animation hook
  const { rotateArrow, getBodyStyle } = useAccordionAnimation(expanded);

  const handleSave = () => {
    try {
      if (!selectedVariety) throw new Error("Please select a seed variety."); // Added validation
      if (!quantity || isNaN(parseFloat(quantity))) throw new Error("Please enter a valid quantity.");
      if (!photoUri) throw new Error("Please capture a photo of the packed product.");

      setIsSaved(true);
      Alert.alert("Success", "Packing event recorded successfully.");
      setExpanded(false);
    } catch (error) {
      Alert.alert("Error", error.message);
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
            setSelectedVariety(''); // Reset variety
            setPhotoUri(null);
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
      });
      if (!result.canceled) {
        setPhotoUri(result.assets[0].uri);
        Alert.alert("Image Captured", "Your photo has been captured successfully.");
      }
    } catch (error) {
      Alert.alert("Capture Error", "Failed to capture image: " + error.message);
    }
  };

  const today = new Date().toDateString();
  const isCompleted = isSaved && date.toDateString() === today;

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.header} onPress={() => setExpanded(!expanded)}>
        <MaterialCommunityIcons name="package-variant-closed" size={24} color="white" style={styles.headerIcon} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Packing</Text>
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
          {/* Add Seed Variety Selection */}
          <Text style={styles.label}>Seed Variety</Text>
          <View style={styles.tags}>
            {VARIETIES.map((variety) => (
              <TouchableOpacity
                key={variety}
                onPress={() => setSelectedVariety(variety)}
                style={[styles.tag, selectedVariety === variety && styles.selectedTag]}
              >
                <Text style={[styles.tagText, selectedVariety === variety && styles.selectedTagText]}>
                  {variety}
                </Text>
              </TouchableOpacity>
            ))}
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
            placeholder="Enter quantity"
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />

          <Text style={styles.label}>Photos (Geo-tagged)</Text>
          <View style={styles.imageBox}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.photo} />
            ) : (
              <Text style={styles.imagePlaceholder}>Image Preview</Text>
            )}
          </View>

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
  // Add styles for tags
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
});
