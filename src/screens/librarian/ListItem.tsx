import { StyleSheet, View, Pressable, Text } from 'react-native';
import { PRIMARY_COLOUR, GREY_COLOUR } from '../Constants.ts';

export default function ListItem({ id, press }) {
  return (<>
    <View style={styles.container}>
      <Text style={styles.id}>Seat #{id}</Text>
      <View style={styles.verticleLine} />
      <Pressable style={styles.button} onPress={press}>
        <Text style={styles.text}>Go to this seat</Text>
      </Pressable>
    </View>
    <View style={styles.horizontalLine} />
  </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 64,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  button: {
    borderRadius: 10,
    width: 150,
    height: 45,
    marginRight: 35,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: PRIMARY_COLOUR
  },
  id: {
    color: 'black',
    fontSize: 16,
    marginLeft: 40
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  verticleLine: {
    height: '100%',
    width: 1,
    backgroundColor: GREY_COLOUR,
  },
  horizontalLine: {
    width: '100%',
    height: 1,
    backgroundColor: GREY_COLOUR,
  }
});
