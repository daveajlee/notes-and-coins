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
import CreditDebitScreen from "./screens/CreditDebitScreen.tsx";
import CategoriesScreen from './screens/CategoriesScreen.tsx';
import HistoryScreen from './screens/HistoryScreen.tsx';
import SettingsScreen from './screens/SettingsScreen.tsx';
import { init } from './utilities/sqlite';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@react-native-vector-icons/ionicons';

function App() {

  // Define tab navigation
  const Tab = createBottomTabNavigator();

  const MyDefaultTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#A2574F',
      primary: 'black'
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
          <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Credit / Debit') {
            iconName = focused
              ? 'cash'
              : 'cash-outline';
          } else if (route.name === 'Categories') {
            iconName = focused ? 'folder' : 'folder-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: { position: 'absolute', backgroundColor: '#f2d6d3ff', },
        headerShown: false,
      })}>
            <Tab.Screen name="Credit / Debit" component={CreditDebitScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Categories" component={CategoriesScreen} options={{ headerShown: false }} />
            <Tab.Screen name="History" component={HistoryScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
  );
}

export default App;
