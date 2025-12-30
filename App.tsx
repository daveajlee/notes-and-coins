/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useEffect } from 'react';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import HomeScreen from "./screens/HomeScreen.tsx";
import { init } from './utilities/sqlite';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

function App() {

  // Define stack navigation
  const Stack = createNativeStackNavigator();

  const MyDefaultTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#A2574F',
      primary: 'black',
    },
  };

  useEffect(() => {
    async function prepare() {
      try {
        init().then(() => {
          console.log('DB Initialized');
        })
      } catch (err) {
        console.log(err);
      }
    }

    prepare();
  }, []);

  return (
      <SafeAreaProvider>
        <NavigationContainer theme={MyDefaultTheme}>
          <Stack.Navigator initialRouteName="HomeScreen">
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
  );
}

export default App;
