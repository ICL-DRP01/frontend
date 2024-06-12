import { Text, View } from "react-native";
import React, { useState , useEffect, useRef} from 'react';
import { useNavigation } from "@react-navigation/native";

import Button from '../Button';
import styles from "../Styles";
import { FLAG_API } from "../Constants";

const LibrarianList = () => {
  const [flaggedSeats, setFlaggedSeats] = useState<number[]>([]);
  //flaggedSeats = FLAGGED_SEATS; // TODO: Remove when API done

  const navigation = useNavigation();

  // duplicated need to fix
  var ws = useRef(new WebSocket('ws://libraryseat-62c310e5e91e.herokuapp.com')).current;


  useEffect(() => {
    const connectWebSocket = () => {
      ws.onopen = () => {
        console.log("connected to server");
      };
      ws.onclose = (e) => {
        console.log("Closing connection + reconnecting ");
        console.log(e);
        connectWebSocket();
      };
      ws.onerror = (e) => {
        console.log("Error, " + e)
      };
      ws.onmessage = (e) => {
        console.log(e.data);

        const result = parseMessage(e.data);

        setFlaggedSeats(result.flagged);
        console.log(result.flagged);

      };


    }
    connectWebSocket();
    }, []
  )

  // duplicate - should remove when refactoring
  const parseMessage = (message) => {
      const result = {
        booked: [],
        flagged: [],
        break: []
      };

      const bookedMatch = message.match(/booked: \{([^\}]*)\}/);
      const flaggedMatch = message.match(/flagged: \{([^\}]*)\}/);
      const breakMatch = message.match(/break: \{([^\}]*)\}/);

      if (bookedMatch && bookedMatch[1]) {
        result.booked = bookedMatch[1].split(', ').map(Number);
      }

      if (flaggedMatch && flaggedMatch[1]) {
        result.flagged = flaggedMatch[1].split(', ').map(Number);
      }

      if (breakMatch && breakMatch[1]) {
        result.break = breakMatch[1].split(', ').map(Number);
      }

      return result;
    };


//   useEffect(() => {
//     const fetchToFlaggedSeats = async () => {
//       try {
//         const response = await fetch(FLAG_API);
//         if (!response.ok) {
//           throw new Error('Failed to fetch occupied seats');
//         }
//         const data = await response.json(); // what we get form the API
//         const flagged = data.results.map(seat => parseInt(seat.seat_number));
//         console.log(flagged);
//         setFlaggedSeats(flagged);
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     fetchToFlaggedSeats();
//   }, []);

  return (
    <View style={styles.container}>
      <Text>Select a flagged seat to go clear</Text>
      <View style={styles.list}>
        {
          flaggedSeats.map((seat) => (
            <Button label={`Seat #${seat}`} press={() => navigation.navigate("Librarian Map", { seat })} />
          ))
        }
      </View>
      {/* <Button label="(test) goto map" press={() => navigation.navigate("Librarian Map")} /> */}
    </View>
  )
}

export default LibrarianList