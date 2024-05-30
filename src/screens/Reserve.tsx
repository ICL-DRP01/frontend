import React, { useState , useEffect} from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NUM_ROWS = 5;
const SEATS_PER_ROW = 6;
const COMPUTER_SEATS = [0, 5, 6, 11, 12, 17, 18, 23, 24, 29]; // Position indices of computer seats

const OCCUPIED_API = "https://libraryseat-62c310e5e91e.herokuapp.com/";
const CLAIM_API = "http://libraryseat-62c310e5e91e.herokuapp.com/claim";
const LEAVE_API = "http://libraryseat-62c310e5e91e.herokuapp.com/leave"

const Reserve = () => {
  const [occupiedSeats, setOccupiedSeats] = useState<number[]>([]); // Track occupied seats
  const [timedWaitSeats, setTimedWaitSeats] = useState<number[]>([]); // Track seats in timed wait state

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
        console.log(data);
        setOccupiedSeats(occupied);
      } catch (err) {
        console.log(err);
      }
    };
    fetchOccupiedSeats();
  }, []);

  const handlePress = (index: number) => {
    if (timedWaitSeats.includes(index)) {
      Alert.alert("Options",
        "Do you want to take get back or leave?",
        [
          {text: "get back", onPress: () => claimSeat(index)},
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

  const leaveSeat = async (index: number) => {
    // in the future - this will be API call as well
    if (timedWaitSeats.includes(index))
      setTimedWaitSeats(timedWaitSeats.filter(seat => seat !== index));

//     if (occupiedSeats.includes(index))
//       setOccupiedSeats(occupiedSeats.filter(seat => seat !== index));

    if (occupiedSeats.includes(index)) {
      try {
        const response = await fetch(LEAVE_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ seat_number: index.toString() }),
        });
        if (response.ok) {
          // Fetch updated list of occupied seats
          const updatedResponse = await fetch(OCCUPIED_API);
          if (!updatedResponse.ok) {
            throw new Error('Failed to fetch updated occupied seats');
          }
          const data = await updatedResponse.json();
          const updated= data.results.map(item => parseInt(item.seat_number));
          setOccupiedSeats(updated);
          Alert.alert('Success', 'Seat left successfully.');
        } else {
          Alert.alert('Error', 'Failed to leave seat.');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'An error occurred while claiming the seat.');
      }
    }
  }

  const claimSeat = async (index: number) => {
    try {
      const response = await fetch(CLAIM_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ seat_number: index.toString() }),
      });
      if (response.ok) {
        // Fetch updated list of occupied seats
        const updatedResponse = await fetch(OCCUPIED_API);
        if (!updatedResponse.ok) {
          throw new Error('Failed to fetch updated occupied seats');
        }
        const data = await updatedResponse.json();
        const updated= data.results.map(item => parseInt(item.seat_number));
        setOccupiedSeats(updated);
        Alert.alert('Success', 'Seat claimed successfully.');
      } else {
        Alert.alert('Error', 'Failed to claim seat.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while claiming the seat.');
    }
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
            <Text style={styles.seatText}>{index}</Text>
          </>
        ) : (
          <Text style={styles.seatText}>{index}</Text>
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
