import React, { useState, useEffect, useRef } from 'react';
import { Text, View, FlatList, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from '../Styles'
import Seat from '../Seat'
import Button from '../Button'
import { NUM_ROWS, SEATS_PER_ROW, OCCUPIED_API, BREAK_SEATS, PRIMARY_COLOUR, FLAGGED_SEATS } from '../Constants';
import { unflagSeat } from '../SeatManagement';

const LibrarianMap = () => {

  // new web socket - get warning if passed and
  var ws = useRef(new WebSocket('ws://libraryseat-62c310e5e91e.herokuapp.com')).current;


  const [flaggedSeats, setFlaggedSeats] = useState<number[]>([]);

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
        console.log("it is a flagged seat")
        Alert.alert(
          "Options",
          "Do you want to clear this seat #" + index + "?",
          [
            { text: "Clear", onPress: () => unflagSeat(ws, index, flaggedSeats, setFlaggedSeats)},
            { text: "Cancel", style: "cancel" }
          ]
        );
    }
  };

  // Start of JSX code

  const drawSeat = (index) => (
    <Seat
      isLibrarian={true}
      index={index}
      selectedSeat={index}
      timedWaitSeats={[]}
      occupiedSeats={flaggedSeats}
      flaggedSeats={[]}
      handlePress={() => handlePress(index) }
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
    <Text style={styles.title}>Clear seat </Text>
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
      <></>

  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>{drawHeader()}</View>
      <View style={styles.map}>{drawMap()}</View>
      <View style={styles.footer}>{drawFooter()}</View>
    </View>
  );
};


export default LibrarianMap;
