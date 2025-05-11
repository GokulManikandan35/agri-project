import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  Animated,
  TextInput
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import useAccordionAnimation from '../../farmer/hooks/useAccordionAnimation';

export default function FarmerDetailsPage() {
  const [procurementData, setProcurementData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedProcurement, setExpandedProcurement] = useState(false);
  const [expandedPacking, setExpandedPacking] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [packingAvgPrice, setPackingAvgPrice] = useState('');
  const [procurementDate, setProcurementDate] = useState(new Date());
  const [procurementQuantity, setProcurementQuantity] = useState('');
  const [procurementPrice, setProcurementPrice] = useState('');
  const [procurementPhotoUris, setProcurementPhotoUris] = useState([]);
  const [farmerQuantity, setFarmerQuantity] = useState('');
  const [showProcDatePicker, setShowProcDatePicker] = useState(false);
  const [packingDate, setPackingDate] = useState(new Date());
  const [packingQuantity, setPackingQuantity] = useState('');
  const [showPackingDatePicker, setShowPackingDatePicker] = useState(false);
  const [packingPhotoUris, setPackingPhotoUris] = useState([]);

  const procurementAnimation = useAccordionAnimation(expandedProcurement);
  const packingAnimation = useAccordionAnimation(expandedPacking);

  useEffect(() => {
    async function loadData() {
      try {
        const procurement = await AsyncStorage.getItem('ProcurementFormData');
        const packing = await AsyncStorage.getItem('drychilliesevent');
        
        const parsedProcurement = procurement ? JSON.parse(procurement) : {};
        const parsedPacking = packing ? JSON.parse(packing) : {};
        
        const combinedData = {
          procurement: parsedProcurement,
          packing: parsedPacking
        };
        
        console.log('Loaded procurement data:', combinedData.procurement);
        
        setProcurementData(combinedData);
        if (Object.keys(combinedData.procurement).length > 0) {
          const proc = combinedData.procurement;
          setProcurementDate(proc.date ? new Date(proc.date) : new Date());
          setProcurementPrice(proc.pricePerKg || '');
          setProcurementQuantity(proc.quantity || '');
          setFarmerQuantity(proc.farmerQuantity || proc.quantity || '');
          setProcurementPhotoUris(proc.photoUris || []);
        }
        if (combinedData.packing) {
          if (combinedData.packing.avgPricePerKg)
            setPackingAvgPrice(combinedData.packing.avgPricePerKg);
          setPackingDate(combinedData.packing.date ? new Date(combinedData.packing.date) : new Date());
          setPackingQuantity('');
          setPackingPhotoUris(combinedData.packing.photoUris || []);
        }
      } catch (error) {
        console.error("Error loading data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const captureProcurementImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.status !== 'granted') {
        alert("Camera permission is required to capture an image.");
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setProcurementPhotoUris([...procurementPhotoUris, uri]);
      }
    } catch (error) {
      alert("Error capturing image: " + error.message);
    }
  };

  const capturePackingImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.status !== 'granted') {
        alert("Camera permission is required to capture an image.");
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setPackingPhotoUris([...packingPhotoUris, uri]);
      }
    } catch (error) {
      alert("Error capturing packing image: " + error.message);
    }
  };

  const saveProcurement = async () => {
    try {
      const newProcurement = {
        farmerName: procurementData?.procurement?.farmerName || '',
        seedVariety: procurementData?.procurement?.seedVariety || '',
        date: procurementDate,
        quantity: procurementQuantity || farmerQuantity,
        pricePerKg: procurementPrice,
        photoUris: procurementPhotoUris,
        farmerQuantity: farmerQuantity,
        isSaved: true,
      };
      await AsyncStorage.setItem('ProcurementFormData', JSON.stringify(newProcurement));
      setProcurementData(prev => ({ ...prev, procurement: newProcurement }));
      alert("Procurement data saved successfully");
    } catch (error) {
      alert("Error saving procurement data: " + error.message);
    }
  };

  const cancelProcurement = () => {
    if (procurementData && procurementData.procurement) {
      setProcurementQuantity('');
      setProcurementPrice('');
      setProcurementPhotoUris(procurementData.procurement.photoUris || []);
      setFarmerQuantity(procurementData.procurement.farmerQuantity || procurementData.procurement.quantity || '');
    } else {
      setProcurementQuantity('');
      setProcurementPrice('');
      setProcurementPhotoUris([]);
      setFarmerQuantity('');
    }
  };

  const savePacking = async () => {
    try {
      const newPacking = {
        date: packingDate.toISOString(),
        quantity: packingQuantity,
        avgPricePerKg: packingAvgPrice,
        photoUris: packingPhotoUris,
        isSaved: true,
      };
      await AsyncStorage.setItem('drychilliesevent', JSON.stringify(newPacking));
      alert("Packing data saved successfully");
    } catch (error) {
      alert("Error saving packing data: " + error.message);
    }
  };

  const cancelPacking = () => {
    if (procurementData && procurementData.packing) {
      setPackingAvgPrice(procurementData.packing.avgPricePerKg || '');
      setPackingDate(procurementData.packing.date || '');
      setPackingQuantity('');
    } else {
      setPackingAvgPrice('');
      setPackingDate('');
      setPackingQuantity('');
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  const renderProcurementDetails = () => {
    return (
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Farmer Name:</Text>
          <Text style={styles.detailValue}>{procurementData?.procurement?.farmerName || 'Munusamy'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Seed Variety:</Text>
          <Text style={styles.detailValue}>
            {procurementData?.procurement?.seedVariety || procurementData?.packing?.seedVariety || ''}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Farmer Quantity:</Text>
          <Text style={styles.detailValue}>
            {farmerQuantity || procurementData?.procurement?.quantity || procurementData?.packing?.quantity || ''}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date of Procurement:</Text>
          <TouchableOpacity onPress={() => setShowProcDatePicker(true)} style={{width: '60%'}}>
            <Text style={[styles.detailValue, {borderWidth:1, borderColor:'#CCC', padding:4, borderRadius:4}]}>
              {procurementDate ? procurementDate.toDateString() : 'Not specified'}
            </Text>
          </TouchableOpacity>
          {showProcDatePicker && (
            <DateTimePicker
              value={procurementDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowProcDatePicker(false);
                if (selectedDate) setProcurementDate(selectedDate);
              }}
            />
          )}
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Procurement Quantity:</Text>
          <TextInput
            style={[styles.detailValue, styles.inputField]}
            value={procurementQuantity}
            placeholder="Enter quantity"
            onChangeText={setProcurementQuantity}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Price Per kg:</Text>
          <TextInput
            style={[styles.detailValue, styles.inputField]}
            value={procurementPrice}
            placeholder="Enter price"
            onChangeText={setProcurementPrice}
            keyboardType="numeric"
          />
        </View>
        <Text style={styles.label}>Photos (Geo-tagged)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
          {procurementPhotoUris.length === 0 ? (
            <View style={styles.squarePlaceholder}>
              <Text style={styles.imagePlaceholder}>No images captured</Text>
            </View>
          ) : (
            procurementPhotoUris.map((uri, idx) => (
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
        <TouchableOpacity style={styles.captureButton} onPress={captureProcurementImage}>
          <Text style={styles.captureButtonText}>Capture Image</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderPackingDetails = () => {
    return (
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Lot id:</Text>
          <Text style={styles.detailValue}>{procurementData?.packing?.lotId || 'LOT84729'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Packing Date:</Text>
          <TouchableOpacity onPress={() => setShowPackingDatePicker(true)} style={{width: '60%'}}>
            <Text style={[styles.detailValue, {borderWidth:1, borderColor:'#CCC', padding:4, borderRadius:4}]}>
              {packingDate ? packingDate.toDateString() : 'Select Date'}
            </Text>
          </TouchableOpacity>
        </View>
        {showPackingDatePicker && (
          <DateTimePicker
            value={packingDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowPackingDatePicker(false);
              if (selectedDate) setPackingDate(selectedDate);
            }}
          />
        )}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Quantity:</Text>
          <TextInput
            style={[styles.detailValue, styles.inputField]}
            value={packingQuantity}
            placeholder="Enter quantity"
            onChangeText={setPackingQuantity}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Average price in kg:</Text>
          <TextInput
            style={[styles.detailValue, styles.inputField]}
            value={packingAvgPrice}
            placeholder="Enter average price"
            onChangeText={setPackingAvgPrice}
            keyboardType="numeric"
          />
        </View>
        <Text style={styles.label}>Packing Photos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
          {packingPhotoUris.length === 0 ? (
            <View style={styles.squarePlaceholder}>
              <Text style={styles.imagePlaceholder}>No images captured</Text>
            </View>
          ) : (
            packingPhotoUris.map((uri, idx) => (
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
        <TouchableOpacity style={styles.captureButton} onPress={capturePackingImage}>
          <Text style={styles.captureButtonText}>Capture Packing Image</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Farmer Details</Text>
      
      <View style={styles.card}>
        <TouchableOpacity 
          style={styles.header} 
          onPress={() => setExpandedProcurement(!expandedProcurement)}
        >
          <MaterialCommunityIcons 
            name="shopping-outline" 
            size={24} 
            color="white" 
            style={styles.headerIcon} 
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Procurement</Text>
          </View>
          {procurementData?.procurement?.isSaved && (
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Completed</Text>
            </View>
          )}
          <Animated.View 
            style={{ transform: [{ rotate: procurementAnimation.rotateArrow }] }}
          >
            <Ionicons name="chevron-down" size={22} color="#4CAF50" />
          </Animated.View>
        </TouchableOpacity>

        {expandedProcurement && (
          <Animated.View 
            style={[styles.body, procurementAnimation.getBodyStyle()]}
          >
            {renderProcurementDetails()}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={saveProcurement}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={cancelProcurement}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </View>
      
      <View style={styles.card}>
        <TouchableOpacity 
          style={styles.header} 
          onPress={() => setExpandedPacking(!expandedPacking)}
        >
          <MaterialCommunityIcons 
            name="package-variant-closed" 
            size={24} 
            color="white" 
            style={styles.headerIcon} 
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Packing of Dry Chillies</Text>
          </View>
          {procurementData?.packing?.isSaved && (
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Completed</Text>
            </View>
          )}
          <Animated.View 
            style={{ transform: [{ rotate: packingAnimation.rotateArrow }] }}
          >
            <Ionicons name="chevron-down" size={22} color="#4CAF50" />
          </Animated.View>
        </TouchableOpacity>

        {expandedPacking && (
          <Animated.View 
            style={[styles.body, packingAnimation.getBodyStyle()]}
          >
            {renderPackingDetails()}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={savePacking}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={cancelPacking}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </View>

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
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </ScrollView>
  );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4A8D3D',
  },
  card: {
    marginBottom: 16,
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
  detailsContainer: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  detailLabel: {
    fontWeight: '600',
    color: '#333',
    width: '40%',
    fontSize: 15,
  },
  detailValue: {
    color: '#666',
    width: '60%',
    fontSize: 15,
  },
  inlineValue: {
    fontSize: 15,
    color: '#666',
    marginLeft: 10,
  },
  inlineText: {
    fontSize: 15,
    color: '#666',
    flexShrink: 1,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#CCC',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  noDataText: {
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 20,
  },
  photoScroll: {
    marginTop: 8,
    marginBottom: 16,
  },
  squareImageBox: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
    backgroundColor: '#F5F5F5',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
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
    borderColor: '#CCC',
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: screenWidth * 0.9,
    height: screenWidth * 0.9,
    borderRadius: 12,
  },
  modalClose: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  saveButton: {
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  cancelButton: {
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
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
});
