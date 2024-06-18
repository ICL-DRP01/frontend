import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';


import Dialog from 'react-native-dialog';

import styles from '../Styles'
import Seat from '../Seat'
import { NUM_ROWS, SEATS_PER_ROW, PRIMARY_COLOUR, } from '../Constants';
import { unflagSeat } from '../SeatManagement';

const LibrarianMap = () => {

  // new web socket - get warning if passed and
  var ws = useRef(new WebSocket('wss://libraryseat-62c310e5e91e.herokuapp.com')).current;


  const [flaggedSeats, setFlaggedSeats] = useState<number[]>([]);

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [selectedSeatIndex, setSelectedSeatIndex] = useState<number | null>(null);

  const navigation = useNavigation();

  // duplicate - remove when refactoring
  const parseMessage = (message) => {
    const result = {
      booked: [],
      flagged: [],
      break: []
    };

    const bookedMatch = message.match(/booked: \{([^\}]*)\}/);
    const flaggedMatch = message.match(/flagged: \{([^\}]*)\}/);
    const breakMatch = message.match(/break: \{([^\}]*)\}/);

    if (bookedMatch && bookedMatch[1]) {
      result.booked = bookedMatch[1].split(', ').map(Number);
    }

    if (flaggedMatch && flaggedMatch[1]) {
      result.flagged = flaggedMatch[1].split(', ').map(Number);
    }

    if (breakMatch && breakMatch[1]) {
      result.break = breakMatch[1].split(', ').map(Number);
    }

    return result;
  };


  // API call to fetch occupiedSeats
  useEffect(() => {
    const fetchBreakSeats = async () => {
      ws.onmessage = (e) => {
        console.log(e.data);

        const result = parseMessage(e.data);

        // Update the state
        setFlaggedSeats(result.flagged);

      };
    };
    fetchBreakSeats();
  }, []);

  const handlePress = (index) => {
    if (flaggedSeats.includes(index)) {
      setSelectedSeatIndex(index);
      setIsDialogVisible(true);
    }
  };

  // Start of JSX code

  const renderDialog = () => (
      <Dialog.Container visible={isDialogVisible}>
        <Dialog.Title>Clearing Seat #{selectedSeatIndex}</Dialog.Title>
        <Dialog.Description>
          Do you want to clear seat #{selectedSeatIndex}?
        </Dialog.Description>
        <View style={styles.dialogButtonContainer}>
          <TouchableOpacity
            style={[styles.dialogButton, styles.dialogButtonCancel]}
            onPress={() => setIsDialogVisible(false)}
          >
            <Text style={styles.dialogButtonTextCancle}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.dialogButton, styles.dialogButtonYes]}
            onPress={() => {
              unflagSeat(ws, selectedSeatIndex, flaggedSeats, setFlaggedSeats);
              setIsDialogVisible(false);
            }}
          >
            <Text style={styles.dialogButtonTextYes}>Yes</Text>
          </TouchableOpacity>
        </View>
      </Dialog.Container>
    );

  const drawSeat = (index) => (
    <Seat
      isLibrarian={true}
      index={index}
      selectedSeat={index}
      timedWaitSeats={[]}
      occupiedSeats={flaggedSeats}
      flaggedSeats={[]}
      handlePress={() => handlePress(index)}
    />
  );

  const drawKey = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 20, height: 20, backgroundColor: PRIMARY_COLOUR, borderRadius: 5 }} />
      <Text style={{ marginLeft: 5 }}>Flagged seat</Text>
    </View>
  );

  // Top-Level JSX

  const drawHeader = () => (
    <Text style={[styles.title, { textAlign: 'center' }]}>
      Press seats{'\n'} once cleared
    </Text >
  );

  const drawMap = () => (<>
    {drawKey()}
    <FlatList
      data={Array(NUM_ROWS * SEATS_PER_ROW).fill(null)}
      renderItem={({ index }) => drawSeat(index)}
      keyExtractor={(_, index) => index.toString()}
      numColumns={SEATS_PER_ROW}
    />
  </>);

  const drawFooter = () => (
    <Text style={extraStyles.guide}>
      1. Go to any flagged seat{'\n'}
      2. Take belongings to lost property{'\n'}
      3. Press the seat to remove its flag
    </Text>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>{drawHeader()}</View>
      <View style={styles.map}>{drawMap()}</View>
      <View style={styles.footer}>{drawFooter()}</View>
      {renderDialog()}
    </View>
  );
};

const extraStyles = StyleSheet.create({
  guide: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    width: '70%',
  }
});

export default LibrarianMap;
