/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useEffect } from 'react';
import { SafeAreaProvider, } from 'react-native-safe-area-context';
import MainMenuScreen from "./screens/MainMenuScreen.tsx";
import CategoriesScreen from './screens/CategoriesScreen.tsx';
import HistoryScreen from './screens/HistoryScreen.tsx';
import SettingsScreen from './screens/SettingsScreen.tsx';
import { fetchLanguage, init } from './utilities/sqlite';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import AddCategoryScreen from './screens/AddCategoryScreen.tsx';
import IconButton from './components/IconButton.tsx';
import AddHistoryScreen from './screens/AddHistoryScreen.tsx';
import { Image, View } from 'react-native';
import { useTranslation } from "react-i18next";
import './assets/i18n/i18n';

type NavigationStackParams = {
  navigate: Function;
}

function App() {

  // Define stack navigation
  const Stack = createNativeStackNavigator();

  const {t, i18n} = useTranslation();

  const MyDefaultTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#f9f7f6',
      primary: 'black'
    },
  };

  useEffect(() => {
    async function prepare() {
      try {
          await init();
          let language = await fetchLanguage();
          language = language.toLowerCase();
          if (language) {
            i18n.changeLanguage(language);
          }
      } catch (err) {
          console.error(err);
      }
     
      
    }

    prepare();
  }, [i18n]);

function RootStack() {

  // Navigation hook
  const navigation = useNavigation<NavigationStackParams>();

  return (
    <Stack.Navigator screenOptions={{ headerStyle: {
            backgroundColor: '#f9f7f6'}, headerTitleStyle: {
            fontWeight: 'bold', 
          }, headerTitleAlign: 'center', headerBackButtonDisplayMode: 'minimal'}}>
      <Stack.Screen
        name="MainMenuScreen"
        component={MainMenuScreen}
        options={{ headerTitle: (props) => ( // App Logo
      <Image
        style={{ width: 200, height: 50 }}
        source={require('./assets/images/logo-1024.png')}
        resizeMode='contain'
      />
    ),
    headerTitleStyle: { flex: 1, textAlign: 'center' }, /*, headerRight: () => <IconButton onPress={() => navigation.navigate('WalletScreen')} icon='wallet' size={30} color="black" />*/ }}
      />
      <Stack.Screen
        name="AddCategoryScreen"
        component={AddCategoryScreen}
        options={{ title: t('addCategory') }}
      />
      <Stack.Screen
        name="AddHistoryScreen"
        component={AddHistoryScreen}
      />
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{ title: t('settings') }}
      />
      <Stack.Screen
        name="HistoryScreen"
        component={HistoryScreen}
        options={{title: t('history')}}
      />
      <Stack.Screen
        name="CategoriesScreen"
        component={CategoriesScreen}
        options={{ title: t('categories'), headerRight: () => <View style={{marginRight: 10}}><IconButton onPress={() => navigation.navigate('AddCategoryScreen')} icon='add-circle-outline' color="black" size={30} /></View> }} 
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
