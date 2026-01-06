/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useEffect, useState } from 'react';
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
import AddCategoryModal from './modals/AddCategoryModal.tsx';
import AddHistoryModal from './modals/AddHistoryModal.tsx';
import ModalButton from './components/ModalButton.tsx';
import CreditModal from './modals/CreditModal.tsx';
import DebitModal from './modals/DebitModal.tsx';

function App() {

  // Define tab navigation
  const Tab = createBottomTabNavigator();

  // Control modals.
  const [addCategoryModalVisible, setAddCategoryModalVisible] = useState(false);
  const [addHistoryModalVisible, setAddHistoryModalVisible] = useState(false);
  const [creditModalVisible, setCreditModalVisible] = useState(false);
  const [debitModalVisible, setDebitModalVisible] = useState(false);

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
        headerStyle: {
            backgroundColor: '#f2d6d3ff'}, headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitleAlign: 'center',
        tabBarStyle: { position: 'absolute', backgroundColor: '#f2d6d3ff', },
      })}>
            <Tab.Screen name="Credit / Debit" component={CreditDebitScreen} options={{ title: 'Credit & Debit', headerLeft: () => <ModalButton modalVisible={debitModalVisible} setModalVisible={setDebitModalVisible} iconName='remove-circle-outline' />, headerRight: () => <ModalButton modalVisible={creditModalVisible} setModalVisible={setCreditModalVisible} iconName='add-circle-outline' /> }} />
            <Tab.Screen name="Categories" component={CategoriesScreen} options={{ title: 'Categories', headerRight: () => <ModalButton modalVisible={addCategoryModalVisible} setModalVisible={setAddCategoryModalVisible} iconName='add-circle-outline' /> }} />
            <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'History', headerRight: () => <ModalButton modalVisible={addHistoryModalVisible} setModalVisible={setAddHistoryModalVisible} iconName='add-circle-outline' /> }} />
            <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
          </Tab.Navigator>
        </NavigationContainer>
        <AddCategoryModal modalVisible={addCategoryModalVisible} setModalVisible={setAddCategoryModalVisible} />
        <AddHistoryModal modalVisible={addHistoryModalVisible} setModalVisible={setAddHistoryModalVisible} />
        <CreditModal modalVisible={creditModalVisible} setModalVisible={setCreditModalVisible} />
        <DebitModal modalVisible={debitModalVisible} setModalVisible={setDebitModalVisible} />
      </SafeAreaProvider>
  );
}

export default App;
