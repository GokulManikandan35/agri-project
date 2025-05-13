import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Animated,
  ScrollView,
  Modal,
  Dimensions,
  Image,
  ActivityIndicator, // Import ActivityIndicator for loading spinner
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system"; // Import FileSystem
import useAccordionAnimation from "../hooks/useAccordionAnimation"; // Assuming this hook exists
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const fertilizerTypes = ["Urea", "DAP", "Potash", "Compost", "Vermicompost"];

export default function LandPreparationForm() {
  const [expanded, setExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [fertilizer, setFertilizer] = useState("");
  const [quantity, setQuantity] = useState("");
  const [cultivationArea, setCultivationArea] = useState(""); // NEW
  // photoUris will now store Base64 strings instead of URIs
  const [photoBase64s, setPhotoBase64s] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  // selectedImage will now store the Base64 string for display
  const [selectedImageBase64, setSelectedImageBase64] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // New loading state

  // Use the custom accordion animation hook
  const { rotateArrow, getBodyStyle } = useAccordionAnimation(expanded); // Assuming this hook is correctly implemented

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
      (date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() < date2.getMonth()) ||
      (date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() <= date2.getDate())
    );
  }

  // Load data from AsyncStorage on component mount
  useEffect(() => {
    const loadFormData = async () => {
      try {
        const data = await AsyncStorage.getItem("LandPreparationFormData");
        if (data) {
          const saved = JSON.parse(data);
          // Assuming saved data contains Base64 strings
          setSelectedDate(new Date(saved.selectedDate));
          setFertilizer(saved.fertilizer);
          setQuantity(saved.quantity);
          setCultivationArea(saved.cultivation_area || ""); // NEW
          // Load Base64 strings into photoBase64s
          setPhotoBase64s(saved.photoBase64s || []);
          setIsSaved(saved.isSaved);
          console.log("Loaded LandPreparationFormData", saved);
        }
      } catch (err) {
        console.log("Error loading LandPreparationFormData", err);
      } finally {
        setIsLoading(false); // Set loading to false after attempt
      }
    };

    loadFormData();
  }, []); // Empty dependency array means this effect runs once on mount

  const handleSave = async () => {
    const today = new Date();

    if (isLoading || (isSaved && isSameDay(selectedDate, today))) {
      if (isLoading) {
        Alert.alert("Info", "Form is currently loading. Please wait.");
      } else if (isSaved && isSameDay(selectedDate, today)) {
        Alert.alert(
          "Info",
          "Land Preparation form is already marked as completed for today."
        );
      }
      return;
    }

    try {
      if (!quantity || isNaN(parseFloat(quantity))) {
        throw new Error("Please enter a valid numeric quantity.");
      }
      if (!cultivationArea) {
        throw new Error("Please enter the cultivation area.");
      }

      // Prepare data to send - match backend field names
      const payload = {
        farmer_name: "munusamy (FAR5949)", // Placeholder, replace with actual farmer name
        date: selectedDate.toISOString().split("T")[0], // 'YYYY-MM-DD'
        fertilizer: fertilizer.substring(0, 100), // Trim to 100 chars
        quantity,
        cultivation_area: cultivationArea, // NEW
        photo: photoBase64s[0] || "", // Only send the first photo as 'photo'
      };

      console.log(
        "Payload being sent to backend:",
        JSON.stringify(payload, null, 2)
      );

      const response = await axios.post(
        "http://4.247.169.244:8080/create_landprep/",
        payload,
        {
          headers: { "Content-Type": "application/json" },
          params: { id: 100 },
        }
      );

      console.log("Backend response status:", response.status);
      console.log("Backend response data:", response.data);

      // Save data to AsyncStorage using backend field names
      await AsyncStorage.setItem(
        "LandPreparationFormData",
        JSON.stringify({ ...payload })
      );

      setIsSaved(true);
      Alert.alert("Success", "Data saved and sent to backend successfully.");
    } catch (error) {
      console.log("Axios request error:", error); // Log the full error object

      let errorMessage = "Failed to save/send data."; // Default error message

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("Error response data:", error.response.data);
        console.log("Error response status:", error.response.status);
        console.log("Error response headers:", error.response.headers);
        errorMessage =
          error.response.data?.error ||
          `Server responded with status ${error.response.status}`; // Use error.response.data?.error
      } else if (error.request) {
        // The request was made but no response was received
        console.log("Error request:", error.request);
        errorMessage =
          "No response received from server. Check network connection and server status.";
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
        {
          text: "Yes",
          onPress: () => {
            // Reset form fields to initial values
            setSelectedDate(new Date());
            setFertilizer("");
            setQuantity("");
            setCultivationArea(""); // Reset cultivation area
            setPhotoBase64s([]); // Reset Base64 array
            setIsSaved(false);
            setExpanded(false);
          },
        },
      ]
    );
  };

  const handleCaptureImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Camera permission is required to capture an image."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true, // Keep allowsEditing if needed, but be aware it might affect metadata
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
            Alert.alert(
              "Encoding Failed",
              "ImagePicker did not provide Base64 data."
            );
            console.error("ImagePicker result missing base64:", asset);
          }
        } else {
          Alert.alert(
            "Capture Failed",
            "No image asset found in the capture result."
          );
        }
      }
    } catch (error) {
      Alert.alert(
        "Capture Error",
        "Failed to capture or encode image: " + error.message
      );
      console.error("Image capture/encoding error:", error);
    }
  };

  // Helper function to format Base64 for Image component source
  const formatBase64ForImage = (base64) => {
    // ImagePicker provides Base64 without the data URI prefix
    // Add the prefix expected by the Image component
    return `data:image/jpeg;base64,${base64}`; // Assuming JPEG, adjust if needed
  };

  const today = new Date();
  const isCompleted = isSaved && isSameOrBefore(selectedDate, today);
  const isPending = !isCompleted;

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
      >
        {/* Add header icon here */}
        <View style={styles.headerIcon}>
          <MaterialCommunityIcons
            name="tractor-variant"
            size={20}
            color="#fff"
          />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Land Preparation</Text>
        </View>
        {/* Status badge */}
        {!isLoading &&
          (isCompleted ? (
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Completed</Text>
            </View>
          ) : (
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: "#FFF9C4", borderColor: "#FBC02D" },
              ]}
            >
              <Text style={[styles.statusText, { color: "#F57F17" }]}>
                Pending
              </Text>
            </View>
          ))}

        <Animated.View style={{ transform: [{ rotate: rotateArrow }] }}>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={24}
            color="green"
          />
        </Animated.View>
      </TouchableOpacity>

      {expanded && (
        <Animated.View style={[styles.body, getBodyStyle()]}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#4CAF50" />
          ) : (
            <>
              <Text style={styles.label}>Date of Ploughing & Fertilizing</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.dateInput}
              >
                <Text style={styles.dateText}>
                  {selectedDate.toDateString()}
                </Text>
                <Ionicons name="calendar" size={20} color="green" />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) setSelectedDate(selectedDate);
                  }}
                />
              )}

              <Text style={styles.label}>Fertilizer Type</Text>
              <View style={styles.dropdownContainer}>
                <Picker
                  selectedValue={fertilizer}
                  onValueChange={(itemValue) => setFertilizer(itemValue)}
                  style={styles.picker}
                  dropdownIconColor="#4CAF50"
                  mode="dropdown"
                >
                  <Picker.Item
                    label="Select Fertilizer"
                    value=""
                    color="#888"
                  />
                  {fertilizerTypes.map((type) => (
                    <Picker.Item
                      key={type}
                      label={type}
                      value={type}
                      color="#222"
                    />
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

              <Text style={styles.label}>Cultivation Area (Acre/Hectare)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter cultivation area"
                value={cultivationArea}
                onChangeText={setCultivationArea}
                keyboardType="default"
              />

              <Text style={styles.label}>Photos (Geo-tagged)</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginVertical: 8 }}
              >
                {photoBase64s.length === 0 ? (
                  <View style={styles.squarePlaceholder}>
                    <Text style={styles.imagePlaceholder}>
                      No images captured
                    </Text>
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
                      <Image
                        source={{ uri: formatBase64ForImage(base64) }}
                        style={styles.squareImage}
                      />
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
                  <TouchableOpacity
                    style={styles.modalClose}
                    onPress={() => setModalVisible(false)}
                  >
                    <Ionicons name="close-circle" size={40} color="#fff" />
                  </TouchableOpacity>
                  {/* Modal image source using data URI */}
                  {selectedImageBase64 && (
                    <Image
                      source={{
                        uri: formatBase64ForImage(selectedImageBase64),
                      }}
                      style={styles.modalImage}
                      resizeMode="contain"
                    />
                  )}
                </View>
              </Modal>

              <TouchableOpacity
                style={styles.captureButton}
                onPress={handleCaptureImage}
              >
                <Text style={styles.captureButtonText}>Capture Image</Text>
              </TouchableOpacity>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCancel}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                {/* Disable Save button while loading or if completed today */}
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.saveButton,
                    (isLoading ||
                      (isSaved && isSameOrBefore(selectedDate, today))) &&
                      styles.disabledButton,
                  ]}
                  onPress={handleSave}
                  disabled={
                    isLoading ||
                    (isSaved && isSameOrBefore(selectedDate, today))
                  }
                >
                  <Text style={styles.saveButtonText}>
                    {isLoading ? "Saving..." : "Save"}
                  </Text>
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

const screenWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  card: {
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#4CAF50",
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
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
  statusBadge: {
    backgroundColor: "#C8E6C9",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: "#2E7D32",
    fontWeight: "500",
  },
  body: {
    padding: 16,
  },
  label: {
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
    color: "#333",
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  dateText: {
    fontWeight: "600",
    color: "#2E7D32",
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 8,
    marginTop: 6,
    marginBottom: 6,
    overflow: "hidden",
    backgroundColor: "#F8FFF8",
    minHeight: 44,
    justifyContent: "center",
  },
  picker: {
    height: 54,
    width: "100%",
    color: "#222",
    backgroundColor: "transparent",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    backgroundColor: "#fff",
  },
  squareImageBox: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CCC",
    backgroundColor: "#F5F5F5",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
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
    borderColor: "#CCC",
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  imagePlaceholder: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    padding: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: screenWidth * 0.9,
    height: screenWidth * 0.9, // Maintain aspect ratio based on width
    borderRadius: 12,
  },
  modalClose: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 2,
  },
  captureButton: {
    marginTop: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  captureButtonText: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  cancelButtonText: {
    color: "#555",
    fontWeight: "500",
  },
  modifyButton: {
    marginTop: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  buttonText: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#A5D6A7", // Lighter green for disabled save button
    borderColor: "#A5D6A7",
  },
});
