
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import styles from './Styles';

const COMPUTER_SEATS = [0,1,2,3,4]; // positions of computer seats

const Seat = ({ index, selectedSeat, timedWaitSeats, occupiedSeats, flaggedSeats, handlePress, timer }) => {
  const seatType = COMPUTER_SEATS.includes(index) ? 'computer' : 'regular';
  const occupied = occupiedSeats.includes(index);
  const isInTimedWait = timedWaitSeats.includes(index);
  const isDisabled = (selectedSeat !== null && selectedSeat !== index && !timedWaitSeats.includes(index) && !occupiedSeats.includes(index))
  const isFlagged = flaggedSeats.includes(index);
  const isSelected = selectedSeat === index;

  const textStyle = () => {
    if (occupied || isInTimedWait) 
      return styles.seatText;
    return styles.freeSeatText;
  }

  return (
    <TouchableOpacity
      style={[
        styles.seat,
        seatType === 'computer' && styles.computerSeat,
        occupied && styles.occupied,
        !occupied && !isInTimedWait && styles.freeSeat,
        isInTimedWait && styles.timedWaitSeat,
        isDisabled && styles.disabledSeat,
        isSelected && styles.selectedSeat,
      ]}
      onPress={() => !isDisabled && handlePress(index)}
              disabled={isDisabled}
    >
      {isFlagged && (
        <MaterialIcons name="flag" size={20} color="black"/>
      )}
      {seatType === 'computer' ? (
        <>
          <Ionicons name="laptop-outline" size={20} style={textStyle()} />
          <Text style={textStyle()}> {index}</Text>
        </>
      ) : (
        <Text style={textStyle()}>{index}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Seat;