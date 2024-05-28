import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const HelloWorldApp = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello world!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#87CEEB', // Light sky blue
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000000', // Black color for text
  },
});

export default HelloWorldApp;
