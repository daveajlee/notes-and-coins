/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, useColorScheme } from 'react-native';
import { useEffect } from 'react';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import HomeScreen from "./screens/HomeScreen.tsx";
import { init } from './utilities/sqlite';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

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
        <HomeScreen/>
      </SafeAreaProvider>
  );
}

export default App;
