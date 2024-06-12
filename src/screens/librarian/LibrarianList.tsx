import { Text, View } from "react-native";
import React, { useState , useEffect, useRef} from 'react';
import { useNavigation } from "@react-navigation/native";

import Button from '../Button';
import styles from "../Styles";
import { FLAG_API } from "../Constants";

export default function LibrarianList(){


  const [flaggedSeats, setFlaggedSeats] = useState<number[]>([]);


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


  return (
    // texts can be better formatted
    <View style={styles.container}>
        <Text>Select a flagged seat to clear</Text>
        {flaggedSeats.length > 0 ? (
          <View style={styles.list}>
            {flaggedSeats.map((seat) => (
              <Button key={seat} label={`Seat #${seat}`} press={() => navigation.navigate("Librarian Map", { seat })} />
            ))}
          </View>
        ) : (
          <Text>No seats to clear</Text>
        )}
      </View>

  )
}

export default LibrarianList