import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from '../Styles'
import Seat from '../Seat'
import Button from '../Button'
import { NUM_ROWS, SEATS_PER_ROW, OCCUPIED_API, BREAK_SEATS, PRIMARY_COLOUR, FLAGGED_SEATS } from '../Constants';

const LibrarianMap = ({ route }) => {
  const { seat } = route.params;

  const [occupiedSeats, setOccupiedSeats] = useState<number[]>([]); // Track occupied seats
  const [timedWaitSeats, setTimedWaitSeats] = useState<number[]>(BREAK_SEATS); // Track seats in timed wait state
  const [_, setFlaggedSeats] = useState<number[]>([]);
  let flaggedSeats = FLAGGED_SEATS; // TODO: Remove when API done

  const navigation = useNavigation();

  // API call to fetch occupiedSeats
  useEffect(() => {
    const fetchOccupiedSeats = async () => {
      try {
        const response = await fetch(OCCUPIED_API);
        if (!response.ok) {
          throw new Error('Failed to fetch occupied seats');
        }
        const data = await response.json(); // what we get form the API
        const occupied = data.results.map(item => parseInt(item.seat_number));
        console.log(occupied);
        setOccupiedSeats(occupied);
        const breakSeats = data.results.filter(item => item.on_break).map(item => parseInt(item.seat_number));
        setTimedWaitSeats(breakSeats);
      } catch (err) {
        console.log(err);
      }
    };
    fetchOccupiedSeats();
  }, []);

  // Start of JSX code

  const drawSeat = (index) => (
    <Seat
      index={index}
      selectedSeat={seat}
      timedWaitSeats={[]}
      occupiedSeats={flaggedSeats}
      flaggedSeats={[]}
      handlePress={() => null}
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
    <Text style={styles.title}>Clear seat {seat}</Text>
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
    <View>
      <Button label="Seat cleared" press={() => null} />
      <Button label="Ignore flag" press={() => null} />
    </View>
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
