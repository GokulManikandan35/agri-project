import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';

export default function QRCodeDisplay({ procurementData }) {
  const [showQR, setShowQR] = useState(false);

  // Generate a unique QR value based on procurementData
  const qrValue = procurementData?.procurement?.farmerName
    ? `https://yourapp.com/farmer-details?id=${encodeURIComponent(procurementData.procurement.farmerName)}`
    : 'https://yourapp.com/farmer-details';

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
        onPress={() => setShowQR(!showQR)}
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
          <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 12, elevation: 2 }}>
            <QRCode value={qrValue} size={180} />
          </View>
          <Text style={{ marginTop: 8, color: '#666', fontSize: 12 }}>
            Scan this QR to view farmer details
          </Text>
        </View>
      )}
    </View>
  );
}
