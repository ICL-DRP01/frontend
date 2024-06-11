import React, { useState , useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert} from 'react-native';
import { Ionicons,  MaterialIcons } from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';


import styles from './Styles'
import Seat from './Seat'
import Timer from './Timer'
import Button from './Button'
import QRButton from './QRButton'
import { flagSeat, claimSeat, leaveSeat, breakSeat } from './SeatManagement';
import SeatInfo from './SeatInfo';
import Scanner from './Scanner'
import { NUM_ROWS, SEATS_PER_ROW, OCCUPIED_API, BREAK_SEATS, DURATION } from './Constants';

async function sendPushNotification(expoPushToken: string, seatNumber: number, timeRemaining: number) {

  const finishTime = new Date();
  finishTime.setSeconds(finishTime.getSeconds() + timeRemaining);

  const message = {
    to: expoPushToken,
    sound: 'default',
    title: seatNumber === null ? 'Get back to your seat!' : `Get back to seat ${seatNumber}!`,
    body: `Your break finishes at ${finishTime.getHours() + ":" + finishTime.getMinutes()}`,
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


const Reserve = ({ route, expoPushToken }) => {
//   const { expoPushToken } = route.params;
//   const [expoToken, setExpoPushToken] = useState<string | null>(expoPushToken);
  console.log("Token is: " + expoPushToken)
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
        const breakSeats = data.results.filter(item => item.on_break).map(item => parseInt(item.seat_number));
        setTimedWaitSeats(breakSeats);
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
          // for testing - send notification 5 seconds in
          if (newTimers[selectedSeat] === 115) {
            sendPushNotification(expoPushToken, selectedSeat, newTimers[selectedSeat]);
          }
          if (newTimers[selectedSeat] == 0) {
            flagSeat(selectedSeat, flaggedSeats, setFlaggedSeats);
          }
        }
        return newTimers;
      });
    }, DURATION);

    return () => clearInterval(interval);
  }, [selectedSeat, timer]);

  const handlePress = (index: number) => {
    if (selectedSeat === null) {
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

  // Start of JSX code

  const hasSeat = () => selectedSeat !== null;
  const awayFromDesk = () => hasSeat() && timedWaitSeats.includes(selectedSeat);

  const navToCamera = () => {
    console.log("Loading camera");
    navigation.navigate("Scanner", {
      occupiedSeats : occupiedSeats,
      timedWaitSeats : timedWaitSeats,
      setOccupiedSeats : setOccupiedSeats,
      setSelectedSeat : setSelectedSeat,
      setTimedWaitSeats : setTimedWaitSeats,
    });
  };

  const drawSeat = ( index ) => (
    <Seat
      index={index}
      selectedSeat={selectedSeat}
      timedWaitSeats={timedWaitSeats}
      occupiedSeats={occupiedSeats}
      flaggedSeats={flaggedSeats}
      handlePress={handlePress}
      timer={timer}
    />
  );

  const drawTimer = () => (
    awayFromDesk()
      ? <Timer remainingTime={timer[selectedSeat]} />
      : <Text style={styles.timerText} />
  );

  const drawLeaveButton = () => (
    <Button
      label="Leave your seat"
      press={ () => leaveSeat(selectedSeat, timedWaitSeats, setTimedWaitSeats, occupiedSeats, setOccupiedSeats, setSelectedSeat) }
    />
  );

  const drawBreakButton = () => (
    awayFromDesk()
      ? <Button label={"Return from break"} press={() => claimSeat(selectedSeat, occupiedSeats, timedWaitSeats, setOccupiedSeats, setSelectedSeat, setTimedWaitSeats)} />
      : <Button label={"Take a break"} press={() => breakSeat(selectedSeat, timedWaitSeats, setTimedWaitSeats, timer, setTimer)} />
  )

  // Top-Level JSX

  const drawHeader = () => (<>
    <Text style={styles.title}>Scan Your Seat</Text>
    <Text style={styles.selectedSeatText}>
      {hasSeat() ? `Selected Seat: ${selectedSeat}` : ""}
    </Text>
  </>);

  const drawMap = () => (<>
    {SeatInfo()}
    <FlatList
      data={Array(NUM_ROWS * SEATS_PER_ROW).fill(null)}
      renderItem={({ index }) => drawSeat(index)}
      keyExtractor={(item, index) => index.toString()}
      numColumns={SEATS_PER_ROW}
    />
  </>);

  const drawFooter = () => (
    hasSeat()
      ? <View>
          {drawTimer()}
          {drawLeaveButton()}
          {drawBreakButton()}
        </View>
      : <QRButton press={() => navToCamera()} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>{drawHeader()}</View>
      <View style={styles.map}>{drawMap()}</View>
      <View style={styles.footer}>{drawFooter()}</View>
    </View>
  );
};


export default Reserve;
