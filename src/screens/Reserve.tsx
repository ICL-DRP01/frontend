import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NUM_ROWS = 5;
const SEATS_PER_ROW = 6;
const OCCUPIED = [2, 7, 14, 20, 29]; // Initial occupied seats - get this from db
const COMPUTER_SEATS = [0, 5, 6, 11, 12, 17, 18, 23, 24, 29]; // Position indices of computer seats

const Reserve = () => {
  const [occupiedSeats, setOccupiedSeats] = useState<number[]>(OCCUPIED); // Track occupied seats
  const [timedWaitSeats, setTimedWaitSeats] = useState<number[]>([]); // Track seats in timed wait state

  const handlePress = (index: number) => {
    if (timedWaitSeats.includes(index)) {
      Alert.alert("Options",
        "Do you want to take get back or leave?",
        [
          {text: "claim", onPress: () => claimSeat(index)},
          {text: "leave", onPress: () => leaveSeat(index)},
          { text: "Cancel", style: "cancel" }
          ]
        );
    }
    else if (occupiedSeats.includes(index)) {
      Alert.alert("Options",
      "Do you want to take break or leave",
      [
        {text: "break", onPress: () => breakSeat(index)},
        {text: "leave", onPress: () => leaveSeat(index)},
        { text: "Cancel", style: "cancel" }
        ]
      );
    } else {
      Alert.alert(
          "Options",
          "Do you want to claim this seat?",
          [
            { text: "Claim", onPress: () => claimSeat(index) },
            { text: "Cancel", style: "cancel" }
          ]
        );
    }
  };

  const leaveSeat = (index: number) => {
    if (timedWaitSeats.includes(index))
      setTimedWaitSeats(timedWaitSeats.filter(seat => seat !== index));
    if (occupiedSeats.includes(index))
      setOccupiedSeats(occupiedSeats.filter(seat => seat !== index));
  }

  const claimSeat = (index: number) => {
    setOccupiedSeats([...occupiedSeats, index]);
  };

  const breakSeat = (index: number) => {
    setTimedWaitSeats([...timedWaitSeats, index]);
  };

  const renderSeat = ({ index }) => {
    const seatType = COMPUTER_SEATS.includes(index) ? 'computer' : 'regular';
    const occupied = occupiedSeats.includes(index);
    const isInTimedWait = timedWaitSeats.includes(index);

    return (
      <TouchableOpacity
        style={[
          styles.seat,
          seatType === 'computer' && styles.computerSeat,
          occupied && styles.occupied,
          isInTimedWait && styles.timedWaitSeat,
        ]}
        onPress={() => handlePress(index)}
      >
        {seatType === 'computer' ? (
          <>
            <Ionicons name="laptop-outline" size={24} color="white" />
            <Text style={styles.seatText}>{index + 1}</Text>
          </>
        ) : (
          <Text style={styles.seatText}>{index + 1}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reserve Your Seat</Text>
      <View style={styles.seatsContainer}>
        <FlatList
          data={Array(NUM_ROWS * SEATS_PER_ROW).fill(null)}
          renderItem={renderSeat}
          keyExtractor={(item, index) => index.toString()}
          numColumns={SEATS_PER_ROW}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 45,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  seatsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  seat: {
    width: 50,
    height: 50,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    backgroundColor: 'green',
  },
  computerSeat: {
    backgroundColor: 'lightgreen', // Color for computer seats
  },
  occupied: {
    backgroundColor: '#F5513F', // Color for pre-reserved seats
  },
  timedWaitSeat: {
    backgroundColor: '#E2A30F', // Color for seats in timed wait state
  },
  seatText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Reserve;
