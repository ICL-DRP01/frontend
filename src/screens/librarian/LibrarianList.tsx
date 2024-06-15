import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from "@react-navigation/native";

import ListItem from './ListItem';
import styles from "../Styles";
import { FLAG_API } from "../Constants";

export default function LibrarianList() {


  const [flaggedSeats, setFlaggedSeats] = useState<number[]>([]);


  const navigation = useNavigation();

  // duplicated need to fix
  var ws = useRef(new WebSocket('wss://libraryseat-62c310e5e91e.herokuapp.com')).current;


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
    <View style={[styles.container, { padding: 20 }]}>
      <Text style={tempStyles.textTip}>
        Select a seat to go to its location on the map.{'\n\n'}
        From there, take the belongings to lost property and clear the flag, or ignore the flag.
      </Text>
      {flaggedSeats.length > 0 ? (
        <View style={styles.list}>
          {flaggedSeats.map((seat) => (
            <ListItem key={seat} id={seat} press={() => navigation.navigate("Librarian Map", { seat })} />
          ))}
        </View>
      ) : (
        <Text>No seats to clear</Text>
      )}
    </View>

  )
}

const tempStyles = StyleSheet.create({
  textTip: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20
  }
});

export default LibrarianList