import React, { useState , useEffect} from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert} from 'react-native';
import { Ionicons,  MaterialIcons } from '@expo/vector-icons';


import styles from './Styles'
import Seat from './Seat'
import Timer from './Timer'
import Button from './Button'
import { flagSeat, claimSeat, leaveSeat, breakSeat } from './SeatManagement';
import SeatInfo from './SeatInfo';

const NUM_ROWS = 6;
const SEATS_PER_ROW = 5;
const OCCUPIED_API = "https://libraryseat-62c310e5e91e.herokuapp.com/"; // duplicated - maybe constants file

const BREAK_SEATS = [0, 9, 29];
const DURATION = 1000; // minutes for now

const Reserve = () => {
  const [occupiedSeats, setOccupiedSeats] = useState<number[]>([]); // Track occupied seats
  // the seats that are on break
  const [timedWaitSeats, setTimedWaitSeats] = useState<number[]>(BREAK_SEATS); // Track seats in timed wait state
  // temp solution before ownership is added to db
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null) // currently selected seat
  // flagged seats
  const [flaggedSeats, setFlaggedSeats] = useState<number[]>([]);

  // timer
  const [timer, setTimer] = useState<{ [key: number]: number }>({}); // Timer state for seats

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
    if (timedWaitSeats.includes(index) && index === selectedSeat) {
      Alert.alert("Options",
        "Do you want to take get back or leave?",
        [
          {text: "get back", onPress: () => claimSeat(index, occupiedSeats, timedWaitSeats, setOccupiedSeats, setSelectedSeat, setTimedWaitSeats)},
          {text: "leave", onPress: () => leaveSeat(index, timedWaitSeats, setTimedWaitSeats, occupiedSeats, setOccupiedSeats, setSelectedSeat)},
          { text: "Cancel", style: "cancel" }
        ]
      );
    } else if ((timedWaitSeats.includes(index) || occupiedSeats.includes(index)) && selectedSeat !== index)  {
      Alert.alert("Options",
        "Do you want to flag this seat?",
        [
          {text: "flag", onPress: () => flagSeat(index, flaggedSeats, setFlaggedSeats)},
          { text: "Cancel", style: "cancel" }
        ]
      );
    }
    else if (selectedSeat === index) {
      Alert.alert("Options",
        "Do you want to take break or leave",
        [
          {text: "break", onPress: () => breakSeat(index, timedWaitSeats, setTimedWaitSeats, timer, setTimer)},
          {text: "leave", onPress: () => leaveSeat(index, timedWaitSeats, setTimedWaitSeats, occupiedSeats, setOccupiedSeats, setSelectedSeat)},
          { text: "Cancel", style: "cancel" }
        ]
      );
    } else {
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
          <Text style={styles.title}>Reserve Your Seat</Text>
          <Text style={styles.selectedSeatText}>
            {selectedSeat !== null ? `Selected Seat: ${selectedSeat}` : ""}
          </Text>

      </View>

      {SeatInfo()}
      <Text></Text>

      {/* Map */}
      <View style={styles.map}>
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
