/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useEffect } from 'react';
import { SafeAreaProvider, } from 'react-native-safe-area-context';
import CreditDebitScreen from "./screens/CreditDebitScreen.tsx";
import CategoriesScreen from './screens/CategoriesScreen.tsx';
import HistoryScreen from './screens/HistoryScreen.tsx';
import SettingsScreen from './screens/SettingsScreen.tsx';
import { init } from './utilities/sqlite';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import AddCategoryScreen from './screens/AddCategoryScreen.tsx';
import IconButton from './components/IconButton.tsx';
import AddHistoryScreen from './screens/AddHistoryScreen.tsx';
import { View } from 'react-native';

type NavigationStackParams = {
  navigate: Function;
}

function App() {

  // Define stack navigation
  const Stack = createNativeStackNavigator();

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

function RootStack() {

  // Navigation hook
  const navigation = useNavigation<NavigationStackParams>();

  return (
    <Stack.Navigator screenOptions={{ headerStyle: {
            backgroundColor: '#f2d6d3ff'}, headerTitleStyle: {
            fontWeight: 'bold',
          }, headerTitleAlign: 'center'}}>
      <Stack.Screen
        name="Credit / Debit"
        component={CreditDebitScreen}
        options={{ title: 'Credit & Debit', headerRight: () => <><View style={{marginRight: 10}}><IconButton onPress={() => navigation.navigate('HistoryScreen')} iconName='list-outline' color="black" /></View><View style={{marginRight: 10}}><IconButton onPress={() => navigation.navigate('SettingsScreen')} iconName='settings-outline' color="black" /></View></> }}
      />
      <Stack.Screen
        name="AddCategoryScreen"
        component={AddCategoryScreen}
        options={{ title: 'Add Category' }}
      />
      <Stack.Screen
        name="AddHistoryScreen"
        component={AddHistoryScreen}
        options={{ title: 'Add History' }}
      />
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen
        name="HistoryScreen"
        component={HistoryScreen}
        options={{title: 'History'}}
      />
      <Stack.Screen
        name="CategoriesScreen"
        component={CategoriesScreen}
        options={{ title: 'Categories', headerRight: () => <View style={{marginRight: 10}}><IconButton onPress={() => navigation.navigate('AddCategoryScreen')} iconName='add-circle-outline' color="black" /></View> }} 
      />
    </Stack.Navigator>
  );
}

  return (
      <SafeAreaProvider>
        <NavigationContainer theme={MyDefaultTheme}>
          <RootStack/>
        </NavigationContainer>
      </SafeAreaProvider>
  );
}

export default App;
