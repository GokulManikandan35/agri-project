import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, Alert, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import useAccordionAnimation from '../hooks/useAccordionAnimation';

const AppTypes = ["Fertilizer", "Pesticide"];
const SeedVarieties = ["K1", "K2"]; // Added seed varieties

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

export default function FertilizerPesticideForm() {
  const [expanded, setExpanded] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [selectedSeedVariety, setSelectedSeedVariety] = useState(''); // Added state for seed variety
  const [quantity, setQuantity] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  // Use the custom accordion animation hook
  const { rotateArrow, getBodyStyle } = useAccordionAnimation(expanded);

  useEffect(() => {
    const status = getCurrentEventStatus(new Date());
    setCurrentEvent(status);
  }, []);

  const handleSave = () => {
    try {
      if (!selectedType) throw new Error("Select application type.");
      if (!selectedSeedVariety) throw new Error("Select seed variety."); // Added validation
      if (!quantity || isNaN(parseFloat(quantity)))
        throw new Error("Enter valid quantity.");
      if (!photoUri) throw new Error("Capture a photo.");
      setIsSaved(true);
      Alert.alert("Success", "Event saved.");
      setExpanded(false);
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  const handleCancel = () => {
    setDate(new Date());
    setSelectedType('');
    setSelectedSeedVariety(''); // Reset seed variety
    setQuantity('');
    setPhotoUri(null);
    setIsSaved(false);
    setExpanded(false);
  };

  const pickPhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (perm.status !== "granted") return Alert.alert("Permission needed");
    const res = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!res.canceled) setPhotoUri(res.assets[0].uri);
  };

  const today = new Date().toDateString();
  const isCompleted = isSaved && date.toDateString() === today;

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.header} onPress={() => setExpanded(!expanded)}>
        <MaterialCommunityIcons name="bottle-tonic" size={24} color="white" style={styles.headerIcon} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Fertilizer & Pesticide</Text>
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

          {/* Added Seed Variety Selection */}
          <Text style={styles.label}>Seed Variety</Text>
          <View style={styles.tags}>
            {SeedVarieties.map((variety) => (
              <TouchableOpacity
                key={variety}
                onPress={() => setSelectedSeedVariety(variety)}
                style={[styles.tag, selectedSeedVariety === variety && styles.selectedTag]}
              >
                <Text
                  style={[
                    styles.tagText,
                    selectedSeedVariety === variety && styles.selectedTagText,
                  ]}
                >
                  {variety}
                </Text>
              </TouchableOpacity>
            ))}
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
          <View style={styles.imageBox}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.photo} />
            ) : (
              <Text style={styles.imagePlaceholder}>No photo</Text>
            )}
          </View>
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
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
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
});
