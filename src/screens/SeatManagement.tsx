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
    console.log("unflag seat")
    if (flaggedSeats.includes(index)) {
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
    flaggedSeats : number[],
    setOccupiedSeats: Function,
    setSelectedSeat: Function,
    setTimedWaitSeats: Function,
    setFlaggedSeats : Function
) => {
    if (occupiedSeats.includes(index)) {
      console.log("in claim seat!!")
    // not sure
//         try {

//         } catch (error) {
//             console.error(error);
//             Alert.alert('Error', 'An error occurred while unbreaking the seat.');
//         }
        if (timedWaitSeats.includes(index))
          ws.send("unbreak " + index);
        if (flaggedSeats.includes(index))
          ws.send("unflag " + index);
        ws.onmessage = (e) => {
           console.log(e.data);
            if (e.data.startsWith("error")) {
              console.log("ERROR");

            } else {
                const result = parseMessage(e.data);
                setOccupiedSeats(result.booked)
                setTimedWaitSeats(result.break);
                setFlaggedSeats(result.flagged)
                setSelectedSeat(index)
            }

        };

        ; // Select the seat
        return;
    }

    console.log("in claim seat")
    ws.send("book " + index);
    console.log("sent book")
    ws.onmessage = (e) => {
      console.log("here")
      console.log(e);
       console.log(e.data);

        if (e.data.startsWith("error")) {
          Alert.alert('Error', 'Failed to claim seat.');
          console.log("ERROR");

        } else {
            setSelectedSeat(index);
            const result = parseMessage(e.data);
            console.log(result);
            setOccupiedSeats(result.booked);
            console.log("setting seat!")

        }

    };

};

const leaveSeat = async (
    ws : WebSocket,
    index: number,
    timedWaitSeats: number[],
    setTimedWaitSeats: Function,
    flaggedSeats : number[],
    occupiedSeats: number[],
    setOccupiedSeats: Function,
    setSelectedSeat: Function,
    setFlaggedSeats : Function
) => {

    setSelectedSeat(null);


    if (timedWaitSeats.includes(index)) {
        ws.send("unbreak " + index);
        setTimedWaitSeats(timedWaitSeats.filter(seat => seat !== index));
    }

    if (flaggedSeats.includes(index)) {
        ws.send("unflag " + index);
        setFlaggedSeats(flaggedSeats.filter(seat => seat !== index))

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
                setFlaggedSeats(result.flagged);
                setTimedWaitSeats(result.break);
                console.log("unsetting seat!")

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
    setTimer({ ...timer, [index]: 10 });

    ws.send("break " + index);
    ws.onmessage = (e) => {
       console.log(e.data);
        if (e.data.startsWith("error")) {
          Alert.alert('Error', 'Failed to break seat.');
          console.log("ERROR");

        } else {
            const result = parseMessage(e.data);
            setTimedWaitSeats([...timedWaitSeats, index]);
            setTimer({ ...timer, [index]: 10 });
        }


    };
};


export { flagSeat, unflagSeat, claimSeat, leaveSeat, breakSeat };




