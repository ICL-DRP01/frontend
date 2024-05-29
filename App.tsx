import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Reserve from './src/screens/Reserve';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Reserve" component={Reserve} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
