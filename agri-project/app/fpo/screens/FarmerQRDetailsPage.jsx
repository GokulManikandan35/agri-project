import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const DATA_KEYS = [
  { key: 'ProcurementFormData', label: 'Procurement Data' },
  { key: 'drychilliesevent', label: 'Packing (Dry Chillies) Data' },
  { key: 'PackingFormData', label: 'Packing Form Data' },
  { key: 'Harvest', label: 'Harvest Data' },
  { key: 'FertilizerPesticideFormData', label: 'Fertilizer/Pesticide Data' },
  { key: 'TransplantingFormData', label: 'Transplanting Data' },
  { key: 'LandPreparationFormData', label: 'Land Preparation Data' },
];

// Helper to render any value (recursively for objects/arrays)
function renderField(key, value) {
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string' && value[0].startsWith('file')) {
    // Render images for any array of file URIs
    return (
      <View key={key} style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 4 }}>
        {value.map((uri, idx) => (
          <Image
            key={idx}
            source={{ uri }}
            style={{ width: 80, height: 80, borderRadius: 8, marginRight: 8, marginBottom: 8 }}
          />
        ))}
      </View>
    );
  }
  if (Array.isArray(value)) {
    return (
      <View key={key} style={{ marginLeft: 10 }}>
        <Text style={styles.key}>{key}:</Text>
        {value.map((v, i) => (
          <View key={i} style={{ marginLeft: 10 }}>
            {renderField(`${key}[${i}]`, v)}
          </View>
        ))}
      </View>
    );
  }
  if (typeof value === 'object' && value !== null) {
    return (
      <View key={key} style={{ marginLeft: 10 }}>
        <Text style={styles.key}>{key}:</Text>
        {Object.entries(value).map(([k, v]) => renderField(k, v))}
      </View>
    );
  }
  // Format booleans and dates for readability
  let displayValue = value;
  if (typeof value === 'boolean') displayValue = value ? 'Yes' : 'No';
  if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T/)) {
    // ISO date string
    displayValue = new Date(value).toLocaleString();
  }
  return (
    <Text key={key} style={styles.item}>
      <Text style={styles.key}>{key}:</Text> {String(displayValue)}
    </Text>
  );
}

export default function FarmerQRDetailsPage() {
  const [allData, setAllData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      const result = {};
      const allKeys = await AsyncStorage.getAllKeys();
      console.log('All AsyncStorage keys:', allKeys);

      for (const { key } of DATA_KEYS) {
        const value = await AsyncStorage.getItem(key);
        console.log(`Fetched key "${key}":`, value);
        result[key] = value ? JSON.parse(value) : null;
      }
      setAllData(result);
      setLoading(false);
    }
    fetchAll();
  }, []);

  // Share/export logic
  const handleShare = async () => {
    try {
      const json = JSON.stringify(allData, null, 2);
      const fileUri = FileSystem.cacheDirectory + 'farmer_data.json';
      await FileSystem.writeAsStringAsync(fileUri, json, { encoding: FileSystem.EncodingType.UTF8 });
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Share Farmer Data',
      });
    } catch (err) {
      Alert.alert('Error', 'Could not share data: ' + err.message);
    }
  };

  if (loading) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <TouchableOpacity
        style={{
          backgroundColor: '#4CAF50',
          padding: 14,
          borderRadius: 8,
          margin: 16,
          alignItems: 'center',
        }}
        onPress={handleShare}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Share Data</Text>
      </TouchableOpacity>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {DATA_KEYS.map(({ key, label }) => {
          const data = allData[key];
          if (!data) return null;
          return (
            <View key={key} style={styles.card}>
              <Text style={styles.title}>{label}</Text>
              {Object.entries(data).map(([k, v]) => renderField(k, v))}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 8,
    color: '#2E7D32',
  },
  item: {
    fontSize: 15,
    marginBottom: 2,
    color: '#333',
  },
  key: {
    fontWeight: '600',
    color: '#4CAF50',
  },
});
