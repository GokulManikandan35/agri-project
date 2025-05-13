import React, { useEffect, useState } from 'react';
import { View, Image, ActivityIndicator, StyleSheet, Linking, TouchableOpacity, Text } from 'react-native';

export default function FarmerQRDetailsPage() {
  const [qrBase64, setQrBase64] = useState(null);
  const [redirectUrl, setRedirectUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQR() {
      try {
        const res = await fetch('http://4.247.169.244:8080/get_data/?id=100');
        const data = await res.json();
        setQrBase64(data.qr_code);
        setRedirectUrl(data.url);
      } catch (e) {
        setQrBase64(null);
        setRedirectUrl(null);
      } finally {
        setLoading(false);
      }
    }
    fetchQR();
  }, []);

  const handlePress = () => {
    if (redirectUrl) {
      Linking.openURL(redirectUrl);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!qrBase64) {
    return (
      <View style={styles.center}>
        <Text>QR code not available</Text>
      </View>
    );
  }

  return (
    <View style={styles.center}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <Image
          source={{ uri: `data:image/png;base64,${qrBase64}` }}
          style={{ width: 300, height: 300 }}
          resizeMode="contain"
        />
        <Text style={styles.linkText}>Tap QR to view details</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  linkText: {
    marginTop: 18,
    color: '#1976D2',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});
