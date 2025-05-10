import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For calendar icon
import LandPreparationForm from "../components/LandPreparationForm";
import TransplantingForm from "../components/TransplantingForm";
import FertilizerPesticideForm from "../components/FertilizerPesticideForm";
import HarvestDryingPackingForm from "../components/HarvestDryingPackingForm"; // Now just Harvest
import PackingForm from "../components/PackingForm"; // New component

const getCurrentDate = () => {
  const options = { month: "short", day: "numeric", year: "numeric" };
  return new Date().toLocaleDateString("en-US", options);
};

export default function HomeScreen() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
    >
      {/* Header */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.farmerText}>Munusamy</Text>
        </View>
        <View style={styles.dateChip}>
          <Ionicons name="calendar-outline" size={16} color="gray" />
          <Text style={styles.dateText}>{getCurrentDate()}</Text>
        </View>
      </View>
      {/* New divider */}
      <View style={styles.divider} />
      {/* Title + Subtext */}
      <Text style={styles.title}>GI Traceability Dashboard</Text>
      <Text style={styles.subtitle}>
        Track and record farming events for virudhunagar samba chillies
      </Text>

      {/* Forms */}
      <LandPreparationForm />
      <TransplantingForm />
      <FertilizerPesticideForm />
      <HarvestDryingPackingForm />
      <PackingForm /> {/* Add the new packing form */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
  },
  welcomeText: {
    fontSize: 16,
    color: "#555",
  },
  farmerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },
  dateChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  dateText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#555",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "green",
    marginTop: 30,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginVertical: 10,
  },
});
