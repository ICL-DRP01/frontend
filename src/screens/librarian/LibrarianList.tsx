import { FlatList, Text, View } from "react-native"
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import FreeSeatMap from "./FreeSeatMap";
import Button from '../Button'
import styles from "../Styles"
import { flagSeat, unflagSeat } from "../SeatManagement";
import { FLAG_API } from "../Constants";

const LibrarianList = () => {
  const [flaggedSeats, setFlaggedSeats] = useState<number[]>([])

  const navigation = useNavigation();

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
    <View style={styles.container}>
      <View style={styles.list}>
        {
          flaggedSeats.map((seat) => (
            <Button label={`Seat number ${seat}`} press={() => FreeSeatMap(seat)} />
          ))
        }
      </View>
      <Button label="(test) goto map" press={() => navigation.navigate("Librarian Map")} />
    </View>
  )
}

export default LibrarianList