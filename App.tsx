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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@react-native-vector-icons/ionicons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import AddCategoryScreen from './screens/AddCategoryScreen.tsx';
import IconButton from './components/IconButton.tsx';
import CategoryDetailScreen from './screens/CategoryDetailScreen.tsx';

type NavigationStackParams = {
  navigate: Function;
}

function App() {

  // Define tab navigation
  const Tab = createBottomTabNavigator();

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

function BottomTabs() {

  // Navigation hook
  const navigation = useNavigation<NavigationStackParams>();

  return (
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
        headerStyle: {
            backgroundColor: '#f2d6d3ff'}, headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitleAlign: 'center',
        tabBarStyle: { position: 'absolute', backgroundColor: '#f2d6d3ff', },
      })}>
            <Tab.Screen name="Credit / Debit" component={CreditDebitScreen} options={{ title: 'Credit & Debit'}} />
            <Tab.Screen name="Categories" component={CategoriesScreen} options={{ title: 'Categories', headerRight: () => <IconButton onPress={() => navigation.navigate('AddCategoryScreen')} iconName='add-circle-outline' /> }} />
            <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'History', }} />
            <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
          </Tab.Navigator>
  );
}

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={BottomTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddCategoryScreen"
        component={AddCategoryScreen}
        options={{ title: 'Add Category' }}
      />
      <Stack.Screen
        name="CategoryDetailScreen"
        component={CategoryDetailScreen}
        options={{ title: 'Category' }}
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
