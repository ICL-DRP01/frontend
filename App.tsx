import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Reserve from './src/screens/Reserve';
import Scanner from './src/screens/Scanner';

// to not show deprecated warnings in the app - barcode - or update it - comment out when testing
// import { LogBox } from 'react-native';
//
// LogBox.ignoreAllLogs(true);


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Reserve" component={Reserve} />
         <Stack.Screen name="Scanner" component={Scanner} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
