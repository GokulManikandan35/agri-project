import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function QRCodeDisplay() {
  const [showQR, setShowQR] = useState(false);
  const [qrUrl, setQrUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchQrUrl = async () => {
    setLoading(true);
    try {
      // Send an empty object as JSON to satisfy backend's expectation for JSON body
      const res = await axios.post('http://4.247.169.244:8080/generate-qr/', {});
      console.log("QR backend response:", res);
      // Defensive: check if res.data.url exists and is a string
      if (res && res.data && typeof res.data.url === 'string' && res.data.url.startsWith('http')) {
        setQrUrl(res.data.url);
      } else {
        setQrUrl(null);
        console.log("No valid url in backend response:", res.data);
      }
    } catch (e) {
      setQrUrl(null);
      if (e.response) {
        // Backend responded with error
        console.log("Backend error response:", e.response.data);
      } else if (e.request) {
        // No response received
        console.log("No response received:", e.request);
      } else {
        // Other error
        console.log("Error:", e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleShowQR = async () => {
    if (!showQR) {
      await fetchQrUrl();
    }
    setShowQR(!showQR);
  };

  const handlePressQR = () => {
    if (qrUrl) {
      Linking.openURL(qrUrl);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#4CAF50',
          paddingVertical: 14,
          borderRadius: 8,
          marginTop: 24,
          marginBottom: 32,
          marginHorizontal: 16,
          elevation: 2,
        }}
        onPress={handleShowQR}
      >
        <Ionicons name="qr-code-outline" size={22} color="#fff" />
        <Text style={{
          color: '#fff',
          fontWeight: 'bold',
          fontSize: 16,
          marginLeft: 8,
        }}>
          Generate QR
        </Text>
      </TouchableOpacity>
      {showQR && (
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          {loading ? (
            <ActivityIndicator size="large" color="#4CAF50" />
          ) : qrUrl ? (
            <TouchableOpacity onPress={handlePressQR} activeOpacity={0.8}>
              <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 12, elevation: 2 }}>
                <QRCode value={qrUrl} size={180} />
              </View>
              <Text style={{ marginTop: 8, color: '#1976D2', fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>
                Tap QR to view details
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={{ color: 'red', marginTop: 16 }}>Failed to fetch QR URL</Text>
          )}
        </View>
      )}
    </View>
  );
}
