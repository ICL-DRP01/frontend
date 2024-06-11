import { Alert } from 'react-native';
import { OCCUPIED_API, CLAIM_API, LEAVE_API, BREAK_API, UNBREAK_API } from './Constants'


// this works but this can be made better
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


const flagSeat = async (ws : WebSocket, index: number, flaggedSeats: number[], setFlaggedSeats: Function, setOccupiedSeats: Function, setTimedWaitSeats : Function) => {
    if (!flaggedSeats.includes(index)) {
        ws.send("flag " + index);
//         ws.send("unbreak " + index);
//         ws.send("unbook " + index);
        ws.onmessage = (e) => {
           console.log(e.data);
            if (e.data.startsWith("error")) {
              Alert.alert('Error', 'Failed to flag seat.');
              console.log("ERROR");

            } else {
                const result = parseMessage(e.data);
                setFlaggedSeats(result.flagged);

            }
        };
    }
    console.log(flaggedSeats);
};

const unflagSeat = async (ws : WebSocket, index: number, flaggedSeats: number[], setFlaggedSeats: Function) => {
    if (!flaggedSeats.includes(index)) {
        ws.send("unflag " + index);
        ws.send("unbreak " + index);
        ws.send("unbook " + index);  // maybe move it later
        ws.onmessage = (e) => {
           console.log(e.data);
            if (e.data.startsWith("error")) {
              Alert.alert('Error', 'Failed to unflag seat.');
              console.log("ERROR");

            } else {
                const result = parseMessage(e.data);
                setFlaggedSeats(result.flagged);

            }

        };
    }
};

const claimSeat = async (
    ws : WebSocket,
    index: number,
    occupiedSeats: number[],
    timedWaitSeats: number[],
    setOccupiedSeats: Function,
    setSelectedSeat: Function,
    setTimedWaitSeats: Function
) => {
    if (occupiedSeats.includes(index)) {
    // not sure
//         try {

//         } catch (error) {
//             console.error(error);
//             Alert.alert('Error', 'An error occurred while unbreaking the seat.');
//         }
        ws.send("unbreak " + index);
        ws.onmessage = (e) => {
           console.log(e.data);
            if (e.data.startsWith("error")) {
              console.log("ERROR");

            } else {
                const result = parseMessage(e.data);
                setTimedWaitSeats(result.break);
                setSelectedSeat(index)
            }

        };

        ; // Select the seat
        return;
    }
    
    ws.send("book " + index);
    ws.onmessage = (e) => {
       console.log(e.data);
        if (e.data.startsWith("error")) {
          Alert.alert('Error', 'Failed to claim seat.');
          console.log("ERROR");

        } else {
            const result = parseMessage(e.data);
            setOccupiedSeats(result.booked);
            console.log("setting seat!")
            setSelectedSeat(index);
        }

    };

};

const leaveSeat = async (
    ws : WebSocket,
    index: number,
    timedWaitSeats: number[],
    setTimedWaitSeats: Function,
    occupiedSeats: number[],
    setOccupiedSeats: Function,
    setSelectedSeat: Function
) => {


    if (timedWaitSeats.includes(index)) {
        ws.send("unbreak " + index);
        setTimedWaitSeats(timedWaitSeats.filter(seat => seat !== index));
    }

    if (occupiedSeats.includes(index)) {
        ws.send("unbook " + index);
        ws.onmessage = (e) => {
           console.log(e.data);
            if (e.data.startsWith("error")) {
              Alert.alert('Error', 'Failed to leave seat.');
              console.log("ERROR");

            } else {
                const result = parseMessage(e.data);
                setOccupiedSeats(result.booked);
                console.log("unsetting seat!")
                setSelectedSeat(null);
            }
        };
    }
};

const breakSeat = async (
    ws : WebSocket,
    index: number,
    timedWaitSeats: number[],
    setTimedWaitSeats: Function,
    timer: { [key: number]: number },
    setTimer: Function
) => {
    setTimedWaitSeats([...timedWaitSeats, index]);
    setTimer({ ...timer, [index]: 120 }); // 2 minutes = 120 seconds

    ws.send("break " + index);
    ws.onmessage = (e) => {
       console.log(e.data);
        if (e.data.startsWith("error")) {
          Alert.alert('Error', 'Failed to break seat.');
          console.log("ERROR");

        } else {
            const result = parseMessage(e.data);
            setTimedWaitSeats([...timedWaitSeats, index]);
            setTimer({ ...timer, [index]: 30 });
        }


    };
};


export { flagSeat, unflagSeat, claimSeat, leaveSeat, breakSeat };




