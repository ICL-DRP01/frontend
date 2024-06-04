import { StyleSheet, View, Pressable, Text } from 'react-native';

export default function Button({ label, press }) {
  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={press}>
        <Text style={styles.text}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 220,
    height: 64,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'grey'
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
