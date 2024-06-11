import { StyleSheet, Text, View, Pressable } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { PRIMARY_COLOUR } from './Constants.ts';

const Selector = ({ expoPushToken }) => {

  const navigation = useNavigation();

  const makeButton = ( text, press ) => (
    <View style={{ alignItems: 'center' }}>
      <Pressable style={styles.button} onPress={press}>
        <Text style={styles.text}>{text}</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={{ justifyContent: 'center', flex: 1 }}>
        {makeButton("Student View", () => navigation.navigate("Seat Finder", {expoPushToken}))}
        <View style={{ height: 50 }} />
        {makeButton("Librarian View", () => navigation.navigate("Librarian"))}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 15,
    width: 300,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY_COLOUR
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 26,
  },
});

export default Selector;
