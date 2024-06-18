import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Button, Alert, } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import Dialog from 'react-native-dialog';

import { claimSeat } from './SeatManagement';
import { NUM_ROWS, SEATS_PER_ROW, PRIMARY_COLOUR, SECONDARY_COLOUR } from './Constants';

export default function Scanner({ route, navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [seatData, setSeatData] = useState(null);

  const {ws ,occupiedSeats, timedWaitSeats, flaggedSeats, setOccupiedSeats, setSelectedSeat, setTimedWaitSeats, setFlaggedSeats} = route.params;
  console.log("in camera")
  console.log(occupiedSeats, timedWaitSeats, flaggedSeats, setOccupiedSeats, setSelectedSeat, setTimedWaitSeats, setFlaggedSeats)


  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);

    const index = parseInt(data)

    // Invalid if not QR code, or value out of seat range
    const invalid_value = isNaN(index) || index < 0 || index >= NUM_ROWS * SEATS_PER_ROW;
    const invalid_android_type = typeof type === "number" && type !== 256;
    const invalid_ios_type = typeof type === "string" && type !== "org.iso.QRCode";
    const isClaimed = timedWaitSeats.includes(index) || occupiedSeats.includes(index);
    if (invalid_android_type || invalid_ios_type || invalid_value) {
      setSeatData({ message: 'Invalid Code', description: 'Please scan a library seat QR code', tryAgain: true });
      setIsDialogVisible(true);
      return;
    }

    if (isClaimed) {
      setSeatData({ message: 'Already claimed', description: 'This seat is already claimed, choose another seat', tryAgain: true });
      setIsDialogVisible(true);
      return;
    }

    // Successful QR scan
    setSeatData({ message: `Seat Number ${data} scanned`, description: 'Do you want to claim this seat?', index });
    setIsDialogVisible(true);
  };


  const renderDialog = () => (
    <Dialog.Container visible={isDialogVisible}>
      <Dialog.Description style={styles.dialogTitle}>{seatData?.message}</Dialog.Description>
      <Dialog.Description>{seatData?.description}</Dialog.Description>
      <View style={styles.dialogButtonContainer}>
        {seatData?.tryAgain ? (
          <TouchableOpacity
            style={[styles.dialogButton, styles.dialogButtonYes]}
            onPress={() => {navigation.navigate('LibraSeat Student')}}
          >
            <Text style={styles.dialogButtonTextCancle}>Try Again</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.dialogButton, styles.dialogButtonCancel]}
              onPress={() => {navigation.navigate('LibraSeat Student')}}
            >
              <Text style={styles.dialogButtonTextCancle}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dialogButton, styles.dialogButtonYes]}
              onPress={handleClaim}
            >
              <Text style={styles.dialogButtonTextYes}>Claim</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </Dialog.Container>
  );



  const handleClaim = () => {
    const { index } = seatData;
    claimSeat(ws, index, occupiedSeats, timedWaitSeats, flaggedSeats, setOccupiedSeats, setSelectedSeat, setTimedWaitSeats, setFlaggedSeats);
    setIsDialogVisible(false);
    navigation.navigate('LibraSeat Student');
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
      {renderDialog()}
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
  dialogButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 5,
      marginBottom: 10,
    },
    dialogButton: {
      flex: 1,
      marginHorizontal: 10,
      borderRadius: 5,
      alignItems: 'center',
      paddingVertical: 10,
    },
    dialogButtonYes: {
      backgroundColor: PRIMARY_COLOUR,
    },
    dialogButtonCancel: {
      backgroundColor: 'white',
      borderColor: PRIMARY_COLOUR,
      borderWidth: 1,

    },
    dialogButtonTextCancle: {
      color: PRIMARY_COLOUR,
      fontSize: 16,
      fontWeight: 'bold',
    },

    dialogButtonTextYes: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    dialogTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'black', // Ensure the text color is not blending with the background
    },
});