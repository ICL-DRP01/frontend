import React, { useState , useEffect} from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert} from 'react-native';
import { Ionicons,  MaterialIcons } from '@expo/vector-icons';
import { scale } from 'react-native-size-matters';


const NUM_ROWS = 6;
const SEATS_PER_ROW = 5;
const COMPUTER_SEATS = [0,1,2,3,4]; // positions of computer seats
const BREAK_SEATS = [0, 9, 29]

const OCCUPIED_API = "https://libraryseat-62c310e5e91e.herokuapp.com/";
const CLAIM_API = "https://libraryseat-62c310e5e91e.herokuapp.com/claim";
const LEAVE_API = "https://libraryseat-62c310e5e91e.herokuapp.com/leave"

const Reserve = () => {
  const [occupiedSeats, setOccupiedSeats] = useState<number[]>([]); // Track occupied seats
  // the seats that are on break
  const [timedWaitSeats, setTimedWaitSeats] = useState<number[]>(BREAK_SEATS); // Track seats in timed wait state
  // temp solution before ownership is added to db
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null) // currently selected seat
  // flagged seats
  const [flaggedSeats, setFlaggedSeats] = useState<number[]>([]);

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

  const handlePress = (index: number) => {
    if (timedWaitSeats.includes(index) && index === selectedSeat) {
      Alert.alert("Options",
        "Do you want to take get back or leave?",
        [
          {text: "get back", onPress: () => claimSeat(index)},
          {text: "leave", onPress: () => leaveSeat(index)},
          { text: "Cancel", style: "cancel" }
        ]
      );
    } else if ((timedWaitSeats.includes(index) || occupiedSeats.includes(index)) && selectedSeat !== index)  {
      Alert.alert("Options",
        "Do you want to flag this seat?",
        [
          {text: "flag", onPress: () => flagSeat(index)},
          { text: "Cancel", style: "cancel" }
        ]
      );
    }
    else if (selectedSeat === index) {
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
          setSelectedSeat(null);  // Reset selected seat
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
    if (occupiedSeats.includes(index)) {
      setTimedWaitSeats(timedWaitSeats.filter(seat => seat !== index));
      setSelectedSeat(index); // Select the seat
      Alert.alert('Success', 'Seat claimed successfully.');
      return;
    }
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
        setSelectedSeat(index);  // Set the selected seat
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

  const flagSeat = (index: number) => {
    // You can implement the logic to add a flag to the seat button here
    // For simplicity, let's assume there's a state to keep track of flagged seats
    if (!flaggedSeats.includes(index))
      setFlaggedSeats([...flaggedSeats, index]);

    console.log(flaggedSeats);

    // implement notification
    // show alert to the flagging user for now
    Alert.alert('Notification Sent', 'Notification to the owner has been sent.');
  };

  const renderSeat = ({ index }) => {
    const seatType = COMPUTER_SEATS.includes(index) ? 'computer' : 'regular';
    const occupied = occupiedSeats.includes(index);
    const isInTimedWait = timedWaitSeats.includes(index);

    const isDisabled = (selectedSeat !== null && selectedSeat !== index && !timedWaitSeats.includes(index) && !occupiedSeats.includes(index))

    const isFlagged = flaggedSeats.includes(index);
    const isSelected = selectedSeat === index;

    return (
      <TouchableOpacity
        style={[
          styles.seat,
          seatType === 'computer' && styles.computerSeat,
          occupied && styles.occupied,
          isInTimedWait && styles.timedWaitSeat,
          isDisabled && styles.disabledSeat,
          isSelected && styles.selectedSeat,
        ]}
        onPress={() => !isDisabled && handlePress(index)}
                disabled={isDisabled}
      >
        {isFlagged && (
          <MaterialIcons name="flag" size={20} color="black" style={styles.flagIcon} />
        )}
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
      <Text style={styles.selectedSeatText}>
        {selectedSeat !== null ? `Selected Seat: ${selectedSeat}` : ""}
      </Text>
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
    paddingTop: 100, // Adjust the top padding here
    paddingHorizontal: 45,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
  },
  seatsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  seat: {
    width: scale(40),
    height: scale(40),
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    backgroundColor: 'green',
  },
  computerSeat: {
    backgroundColor: '#1AB502', // Color for computer seats
  },
  occupied: {
    backgroundColor: '#F5513F', // Color for occupied
  },
  timedWaitSeat: {
    backgroundColor: '#E2A30F', // Color for seats in timed wait state
  },
  disabledSeat: {
    opacity: 0.5, // Make disabled seats semi-transparent
  },
  seatText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectedSeat: {
    borderWidth: 5,
    borderColor: 'black', // Adjust the color of the border as needed
  },
  selectedSeatText: {
    fontSize: 25,
    fontWeight: 'bold',
    margin : 20,
  },

});

export default Reserve;
