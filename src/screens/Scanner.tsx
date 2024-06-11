import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Button, Alert} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';

import { claimSeat } from './SeatManagement';
import { NUM_ROWS, SEATS_PER_ROW } from './Constants';

export default function Scanner({ route, navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const {ws , occupiedSeats, timedWaitSeats, setOccupiedSeats, setSelectedSeat, setTimedWaitSeats} = route.params;
  console.log(occupiedSeats, timedWaitSeats, setOccupiedSeats, setSelectedSeat, setTimedWaitSeats)


  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const press = (ws , index , occupiedSeats, timedWaitSeats, setOccupiedSeats, setSelectedSeat, setTimedWaitSeats) => {
    console.log(ws);
    claimSeat(ws , index , occupiedSeats, timedWaitSeats, setOccupiedSeats, setSelectedSeat, setTimedWaitSeats);
    navigation.navigate("Seat Finder")
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);

    const index = parseInt(data)

    // Invalid if not QR code, or value out of seat range
    const invalid_value = isNaN(index) || index < 0 || index >= NUM_ROWS * SEATS_PER_ROW;
    const invalid_android_type = typeof type === "number" && type !== 256;
    const invalid_ios_type = typeof type === "string" && type !== "org.iso.QRCode";
    const isClaimed = timedWaitSeats.includes(index) || occupiedSeats.includes(index);
    if (invalid_android_type || invalid_ios_type || invalid_value) {
      Alert.alert(
        'Invalid Code',
        'Please scan a library seat QR code',
        [ { text: 'Try Again', onPress: () => setScanned(false) } ]
      );
      return;
    }

    if (isClaimed) {
      Alert.alert(
        'Already claimed',
        'This seat is already claimed, choose another seat',
        [ { text: 'Try Again', onPress: () => setScanned(false) } ]
      );
      return;
    }

    // Successful QR scan
    Alert.alert(
      `Seat Number ${data} scanned`,
      "Do you want to claim this seat?",
      [
        { text: "Claim", onPress: () => press(ws, index , occupiedSeats, timedWaitSeats, setOccupiedSeats, setSelectedSeat, setTimedWaitSeats)},
        { text: "Try Again", onPress: () => setScanned(false)}
      ]
    );
  };

  const renderCamera = () => {
    return (
      <View style={styles.cameraContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.camera}
        />
      </View>
    );
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera permission not granted</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan your seat number</Text>
      {renderCamera()}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 40,
  },
  cameraContainer: {
    width: '120%',
    aspectRatio: 1,
    overflow: 'hidden',
    borderRadius: 10,
    marginBottom: 40,
  },
  camera: {
    flex: 1,
  },
  button: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});