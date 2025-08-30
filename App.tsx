/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, useColorScheme } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import HomeScreen from "./screens/HomeScreen.tsx";
import { initializeDatabase } from './utilities/sqlite';
import { SQLiteProvider } from 'expo-sqlite';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
      <SQLiteProvider databaseName="test.db" onInit={initializeDatabase}>
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <HomeScreen/>
    </SafeAreaProvider>
          </SQLiteProvider>
  );
}

export default App;
