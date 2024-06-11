import {FlatList, Text, View } from "react-native"
import styles from "./Styles"
import { useEffect, useState } from "react";
import Button from './Button'
import { flagSeat, unflagSeat } from "./SeatManagement";
import FreeSeatMap from "./FreeSeatMap";

const FLAG_API = "https://libraryseat-62c310e5e91e.herokuapp.com/flag";

const FreeSeatList = () => {
  const [flaggedSeats, setFlaggedSeats] = useState<number[]>([])
  useEffect(() => {
    const fetchToFlaggedSeats = async () => {
      try {
        const response = await fetch(FLAG_API);
        if (!response.ok) {
          throw new Error('Failed to fetch occupied seats');
        }
        const data = await response.json(); // what we get form the API
        const flagged = data.results.map(seat => parseInt(seat.seat_number));
        console.log(flagged);
        setFlaggedSeats(flagged);
      } catch (err) {
        console.log(err);
      }
    };
    fetchToFlaggedSeats();
  }, []);
  return (
    <View style = {styles.container}>
      <View style = {styles.list}>
        {
          flaggedSeats.map((seat) => (
            <Button label={`Seat number ${seat}`} press={() => FreeSeatMap(seat)}/>
          ))
        }
      </View>
    </View>
  )
}

export default FreeSeatList