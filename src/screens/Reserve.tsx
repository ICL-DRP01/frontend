import React, { useState , useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert} from 'react-native';
import { Ionicons,  MaterialIcons } from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';


import styles from './Styles'
import Seat from './Seat'
import Timer from './Timer'
import Button from './Button'
import { flagSeat, claimSeat, leaveSeat, breakSeat } from './SeatManagement';
import SeatInfo from './SeatInfo';
import Scanner from './Scanner'

const NUM_ROWS = 6;
const SEATS_PER_ROW = 5;
const OCCUPIED_API = "https://libraryseat-62c310e5e91e.herokuapp.com/"; // duplicated - maybe constants file

const BREAK_SEATS = [0, 9, 29];
const DURATION = 1000; // minutes for now

async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}


const Reserve = ({ expoPushToken }) => {
  console.log(expoPushToken);
  const [occupiedSeats, setOccupiedSeats] = useState<number[]>([]); // Track occupied seats
  // the seats that are on break
  const [timedWaitSeats, setTimedWaitSeats] = useState<number[]>(BREAK_SEATS); // Track seats in timed wait state
  // temp solution before ownership is added to db
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null) // currently selected seat
  // flagged seats
  const [flaggedSeats, setFlaggedSeats] = useState<number[]>([]);

  // timer
  const [timer, setTimer] = useState<{ [key: number]: number }>({}); // Timer state for seats

  // navigation
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
      } catch (err) {
        console.log(err);
      }
    };
    fetchOccupiedSeats();
  }, []);

  // timer implementation
  useEffect(() => {
    if (selectedSeat === null) return;
    const interval = setInterval(() => {
      setTimer(prevTimers => {
        const newTimers = { ...prevTimers };
        if (newTimers[selectedSeat] > 0) {
          newTimers[selectedSeat] -= 1;
        }
        return newTimers;
      });
    }, DURATION);

    return () => clearInterval(interval);
  }, [selectedSeat, timer]);

  const handlePress = (index: number) => {
    if (selectedSeat === null) {
      sendPushNotification(expoPushToken);
      Alert.alert(
        "Options",
        "Do you want to claim this seat?",
        [
          { text: "Claim", onPress: () => claimSeat(index, occupiedSeats, timedWaitSeats, setOccupiedSeats, setSelectedSeat, setTimedWaitSeats)},
          { text: "Cancel", style: "cancel" }
        ]
      );
    }
  };

  const loadCamera = () => {
    console.log("Loading camera");
    navigation.navigate("Scanner");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
          <Text style={styles.title}>Choose Your Seat</Text>
          <Text style={styles.selectedSeatText}>
            {selectedSeat !== null ? `Selected Seat: ${selectedSeat}` : ""}
          </Text>
      {/* show scan QR when seat is not chosen */}
      { selectedSeat === null && <Button label="Scan QR code" press={() => loadCamera()} /> }
      </View>

      {/* Map */}
      <View style={styles.map}>
        {SeatInfo()}
        <FlatList
          data={Array(NUM_ROWS * SEATS_PER_ROW).fill(null)}
          renderItem={({ index }) => (
            <Seat
              index={index}
              selectedSeat={selectedSeat}
              timedWaitSeats={timedWaitSeats}
              occupiedSeats={occupiedSeats}
              flaggedSeats={flaggedSeats}
              handlePress={handlePress}
              timer={timer}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          numColumns={SEATS_PER_ROW}
        />
         {selectedSeat !== null && timedWaitSeats.includes(selectedSeat) && (
            <Timer remainingTime={timer[selectedSeat]} />
         )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {selectedSeat !== null && <Button label="Leave your seat" press={() => leaveSeat(selectedSeat, timedWaitSeats, setTimedWaitSeats, occupiedSeats, setOccupiedSeats, setSelectedSeat)}/>}
        {selectedSeat !== null &&
           <Button
             label={
               timedWaitSeats.includes(selectedSeat)
                 ? "Return from break"
                 : "Take a break"}
             press={
               timedWaitSeats.includes(selectedSeat)
                ? () => claimSeat(selectedSeat, occupiedSeats, timedWaitSeats, setOccupiedSeats, setSelectedSeat, setTimedWaitSeats)
                : () => breakSeat(selectedSeat, timedWaitSeats, setTimedWaitSeats, timer, setTimer)}/>}
      </View>
    </View>
  );
};



export default Reserve;
