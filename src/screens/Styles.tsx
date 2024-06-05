
import { StyleSheet } from 'react-native';
import { scale,  moderateScale } from 'react-native-size-matters';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    padding: 10,
  },
  header: {
    flex: 20,
//     backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center'
  },
  map: {
    flex: 50,
//     backgroundColor: 'darkorange',
    alignItems: 'center',
    justifyContent: 'center'
  },
  footer: {
    flex: 30,
//     backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center'
  },


  title: {
    fontSize: moderateScale(30),
    fontWeight: 'bold',
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
    padding: 10,
  },
  freeSeat: {
    backgroundColor: 'white',
    borderColor: '#173d70',
    borderWidth: 3,
  },
  computerSeat: {
    backgroundColor: '#1AB502', // Color for computer seats
  },
  occupied: {
    backgroundColor: '#173d70', // Color for occupied
  },
  timedWaitSeat: {
    backgroundColor: '#7aaaff', // Color for seats in timed wait state
  },
  disabledSeat: {
    opacity: 0.5, // Make disabled seats semi-transparent
  },
  seatText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectedSeatText: {
    fontSize: moderateScale(25),
    fontWeight: 'bold',
  },
  freeSeatText: {
    fontWeight: 'bold',
    color: '#173d70',
  },
  timerText: {
    color: 'black',
    fontSize: moderateScale(20),
    marginBottom: 10,
    textAlign: 'center'
  },


});

export default styles