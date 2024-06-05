import { StyleSheet, View, Pressable, Text, Image } from 'react-native';

export default function QRButton({ press }) {
  return (
    <View style={styles.qrbuttonContainer}>
      <Pressable style={styles.button} onPress={press}>
        <Image source={require('./../../assets/qr-icon.png')} style={styles.image} />
        <Text style={styles.text}>Open Scanner</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  qrbuttonContainer: {
    width: 130,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: '#173d70'
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 10
  }
});
