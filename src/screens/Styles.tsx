import { StyleSheet } from 'react-native';
import { scale, moderateScale } from 'react-native-size-matters';
import { PRIMARY_COLOUR, SECONDARY_COLOUR, GREY_COLOUR } from './Constants.ts';

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
  list: {
    borderWidth: 1,
    flexDirection: 'column',
    alignItems: 'center',
    borderColor: GREY_COLOUR,
  },
  footer: {
    flex: 29,
    //     backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center'
  },

  title: {
    fontSize: moderateScale(30),
    fontWeight: 'bold',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    borderColor: PRIMARY_COLOUR,
    borderWidth: 3,
  },
  computerSeat: {
    backgroundColor: '#1AB502', // Color for computer seats
  },
  occupied: {
    backgroundColor: PRIMARY_COLOUR, // Color for occupied
  },
  timedWaitSeat: {
    backgroundColor: SECONDARY_COLOUR, // Color for seats in timed wait state
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
    color: PRIMARY_COLOUR,
  },
  timerText: {
    color: 'black',
    fontSize: moderateScale(20),
    marginBottom: 10,
    textAlign: 'center'
  },

  dialogButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
    marginBottom: 10,
  },

  dialogButton: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    paddingVertical: 10,
  },
  dialogButtonYes: {
    backgroundColor: PRIMARY_COLOUR,
  },
  dialogButtonCancel: {
    backgroundColor: 'white',
    borderColor: PRIMARY_COLOUR,
    borderWidth: 1,

  },
  dialogButtonTextCancle: {
    color: PRIMARY_COLOUR,
    fontSize: 16,
    fontWeight: 'bold',
  },

  dialogButtonTextYes: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black', // Ensure the text color is not blending with the background
  },

});

export default styles