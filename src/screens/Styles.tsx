
import { StyleSheet } from 'react-native';
import { scale,  moderateScale } from 'react-native-size-matters';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: 45,
  },
  title: {
    fontSize: moderateScale(30),
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
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
  selectedSeat: {
    borderWidth: 5,
    borderColor: 'black', // Adjust the color of the border as needed
  },
  selectedSeatText: {
    fontSize: moderateScale(25),
    fontWeight: 'bold',
    margin : 20,
  },
  freeSeatText: {
    fontWeight: 'bold',
    color: '#173d70',
  },
  timerText: {
    color: 'black',
    fontSize: moderateScale(20),
    marginTop: 4,
    marginBottom: 10,
  },


});

export default styles