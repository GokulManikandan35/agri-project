import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';

const QR_URL = 'http://4.247.169.244:8080/display_data_html/?id=100&html=1';

export default function QRCodeDisplay() {
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerateQR = () => {
    setLoading(true);
    setTimeout(() => {
      setShowQR(true);
      setLoading(false);
    }, 800);
  };

  const handleQRPress = () => {
    Linking.openURL(QR_URL);
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
        onPress={handleGenerateQR}
        disabled={loading}
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
      {loading && (
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      )}
      {showQR && !loading && (
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <TouchableOpacity onPress={handleQRPress} activeOpacity={0.8}>
            <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 12, elevation: 2 }}>
              <QRCode value={QR_URL} size={180} />
            </View>
          </TouchableOpacity>
          <Text style={{ marginTop: 8, color: '#1976D2', fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>
            Tap QR to open link
          </Text>
        </View>
      )}
    </View>
  );
}