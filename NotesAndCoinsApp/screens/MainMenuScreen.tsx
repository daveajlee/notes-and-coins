import {Appearance, StyleSheet} from 'react-native';
import { useEffect, useState } from 'react';
import {Pressable, ScrollView, Text, View} from "react-native";
import { TouchableOpacity } from 'react-native';
import { updateValueAmount, fetchAmount, insertValueAmount, fetchMinimumBalance } from '../utilities/sqlite';
import {SafeAreaView} from "react-native-safe-area-context";
import notifee from '@notifee/react-native';
import { formatCurrency } from "react-native-format-currency";
import { getCurrencies } from 'react-native-localize';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import '../assets/i18n/i18n';
import IconButton from '../components/IconButton';

type NavigationStackParams = {
  navigate: Function;
  setOptions: Function;
}

/**
 * Show the main menu screen with the various categories of notes and buttons for other options.
 */
export default function MainMenuScreen() {

    const {t, i18n} = useTranslation();

    //const [currentLanguage,setLanguage] =useState('en');

    const [balance, setBalance] = useState(0);
    const [fiveAmount, setFiveAmount] = useState(0);
    const [tenAmount, setTenAmount] = useState(0);
    const [twentyAmount, setTwentyAmount] = useState(0);
    const [fiftyAmount, setFiftyAmount] = useState(0);
    const [hundredAmount, setHundredAmount] = useState(0);

    const navigation = useNavigation<NavigationStackParams>();

    const colorScheme = Appearance.getColorScheme();

    const isFocused = useIsFocused();

    /*const changeLanguage = (value: any) => {
        i18n
          .changeLanguage(value)
          .then(() => setLanguage(value))
          .catch(err => console.log(err));
        };

    changeLanguage('de');*/

    /**
     * Whenever we visit the screen, we want to retrieve the current balance.
     */
    useEffect(() => {

        async function prepare() {
            await calculateBalance();
        }

        /**
         * Get the balance by multiplying the various categories.
         */
        async function calculateBalance() {
          let calculatedBalance = (await (getNoteAmount(5)) * 5) + ((await getNoteAmount(10)) * 10) + ((await getNoteAmount(20)) * 20) + ((await getNoteAmount(50)) * 50) + ((await getNoteAmount(100)) * 100);
          setBalance(calculatedBalance);
          if ( calculatedBalance < parseFloat(await fetchMinimumBalance()) ) {
            //Alert.alert('Your balance is below the minimum balance of ' + await fetchMinimumBalance() + '€! Please add more money to your balance.');
            // Request permissions (required for iOS)
            await notifee.requestPermission()

            // Create a channel (required for Android)
            const channelId = await notifee.createChannel({
              id: 'default',
              name: 'Default Channel',
            });

            // Display a notification
            await notifee.displayNotification({
            title: t('notificationTitle'),
            body: t('notificationMessage', { calculatedBalance: calculatedBalance, symbol:formatSymbol(getCurrencies()[0]), minimumBalance: await fetchMinimumBalance() }),
            android: {
              channelId,
              // pressAction is needed if you want the notification to open the app when pressed
              pressAction: {
                id: 'default',
              },
              // Reference the name created (Optional, defaults to 'ic_launcher')
              smallIcon: 'ic_notification_icon',

              // Set color of icon (Optional, defaults to white)
              color: '#A2574F'
            },
          });
          }
        }

        prepare();

    }, [isFocused, /*currentLanguage,*/ i18n, navigation, t]);

    function formatSymbol(currencyCode: string) {
        if ( currencyCode === 'EUR' ) {
            return "€";
        }
    } 

    /**
     * Retrieve the amount of a particular note.
     * @param noteValue the value of the note to retrieve the amount for.
     * @returns the amount of the note currently saved in the database and update the UI.
     */
    async function getNoteAmount(noteValue: number) {
        if ( noteValue === 5 ) {
            setFiveAmount(await fetchAmount(noteValue));
        } else if ( noteValue === 10 ) {
            setTenAmount(await fetchAmount(noteValue));
        } else if ( noteValue === 20 ) {
            setTwentyAmount(await fetchAmount(noteValue));
        } else if ( noteValue === 50 ) {
            setFiftyAmount(await fetchAmount(noteValue));
        } else if ( noteValue === 100 ) {
            setHundredAmount(await fetchAmount(noteValue));
        }
        return await(fetchAmount(noteValue));
    }

    async function onIncreaseNote5(): Promise<void> {
      await onIncreaseNote(5);
      setFiveAmount(fiveAmount+1);
      setBalance(balance+5);
    }

    async function onIncreaseNote10(): Promise<void> {
      await onIncreaseNote(10);
      setTenAmount(tenAmount+1);
      setBalance(balance+10);
    }

    async function onIncreaseNote20(): Promise<void> {
      await onIncreaseNote(20);
      setTwentyAmount(twentyAmount+1);
      setBalance(balance+20);
    }

    async function onIncreaseNote50(): Promise<void> {
      await onIncreaseNote(50);
      setFiftyAmount(fiftyAmount+1);
      setBalance(balance+50);
    }

    async function onIncreaseNote100(): Promise<void> {
      await onIncreaseNote(100);
      setHundredAmount(hundredAmount+1);
      setBalance(balance+100);
    }

    async function onDecreaseNote5(): Promise<void> {
      await onDecreaseNote(5);
      if ( fiveAmount > 0 ) {
        setFiveAmount(fiveAmount-1);
        setBalance(balance-5);
      } else {
        setFiveAmount(0);
      }
    }

    async function onDecreaseNote10(): Promise<void> {
      await onDecreaseNote(10);
      if ( tenAmount > 0 ) {
        setTenAmount(tenAmount-1);
        setBalance(balance-10);
      } else {
        setTenAmount(0);
      }
    }

    async function onDecreaseNote20(): Promise<void> {
      await onDecreaseNote(20);
      if ( twentyAmount > 0 ) {
        setTwentyAmount(twentyAmount-1);
        setBalance(balance-20);
      } else {
        setTwentyAmount(0);
      }
    }

    async function onDecreaseNote50(): Promise<void> {
      await onDecreaseNote(50);
      if ( fiftyAmount > 0 ) {
        setFiftyAmount(fiftyAmount-1);
        setBalance(balance-50);
      } else {
        setFiftyAmount(0);
      }
    }

    async function onDecreaseNote100(): Promise<void> {
      await onDecreaseNote(100);
      if ( hundredAmount > 0 ) {
        setHundredAmount(hundredAmount-1);
        setBalance(balance-100);
      } else {
        setHundredAmount(0);
      }
    }

    /**
     * Increase the amount of a particular note by 1.
     * @param noteValue the value of the note to increase the amount for.
     */
    async function onIncreaseNote(noteValue: number) {
        let currentValue:number = await fetchAmount(noteValue);
        if ( currentValue ) {
            await updateValueAmount(noteValue, currentValue + 1);
        } else {
            await insertValueAmount(noteValue, 1);
        }
    }

    /**
     * Decrease the amount of a particular note by 1.
     * @param noteValue the value of the note to decrease the amount for.
     */
    async function onDecreaseNote(noteValue: number) {
        let currentValue:number = await fetchAmount(noteValue);
        if ( currentValue ) {
            await updateValueAmount(noteValue, currentValue - 1);
        } else {
            await updateValueAmount(noteValue, 0);
        }
        await getNoteAmount(noteValue);
    }

    function addCreditHistory() {
        navigation.navigate('AddEntryScreen', { isDebit: false });
    }

    function addDebitHistory() {
        navigation.navigate('AddEntryScreen', { isDebit: true });
    }

    function viewAnalysis() {
      navigation.navigate('AnalysisScreen');
    }

    function viewCategories() {
        navigation.navigate('CategoriesScreen')
    }

    function viewHistory() {
        navigation.navigate('HistoryScreen');
    }

    function viewSettings() {
        navigation.navigate('SettingsScreen');
    }

    /**
     * Display the screen to the user.
     */
    return (
      <SafeAreaView style={styles.centeredView}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.infoContainer}>
            <View style={styles.titleContainer}>
              <IconButton icon="information-circle" size={36} color="black"/>
              <Text style={styles.balanceText}>{t('balance')}:</Text>
              <Text style={styles.balanceText}>{balance}€</Text>
            </View>
            <View style={styles.notesContainer}>
              <View style={styles.noteContainer}>
                <Text style={[styles.noteText, styles.fiveColour]}>5</Text>
                <Text style={styles.amount}>{fiveAmount}</Text>
              </View>
              <View style={styles.noteContainer}>
                <Text style={[styles.noteText, styles.tenColour]}>10</Text>
                <Text style={styles.amount}>{tenAmount}</Text>
              </View>
            </View>
            <View style={styles.notesContainer}>
              <View style={styles.noteContainer}>
                <Text style={[styles.noteText, styles.twentyColour]}>20</Text>
                <Text style={styles.amount}>{twentyAmount}</Text>
              </View>
              <View style={styles.noteContainer}>
                <Text style={[styles.noteText, styles.fiftyColour]}>50</Text>
                <Text style={styles.amount}>{fiftyAmount}</Text>
              </View>
            </View>
            <View style={styles.notesContainer}>
              <View style={styles.noteContainer}>
                <Text style={[styles.noteText, styles.hundredColour]}>100</Text>
                <Text style={styles.amount}>{hundredAmount}</Text>
              </View>
            </View>
          </View> 
          
          
          <View style={styles.menuContainer}>
                <View style={styles.menuButtonLeft}>
                    <Pressable onPress={addCreditHistory}></Pressable>
                    <IconButton icon="trending-up" size={48} color="black" onPress={addCreditHistory}/>
                    <Text style={styles.textStyle}>{t('credit')}</Text>
                </View>
                <View style={styles.menuButtonRight}>
                    <Pressable onPress={addDebitHistory}></Pressable>
                    <IconButton icon="trending-down" size={48} color="black" onPress={addDebitHistory}/>
                    <Text style={styles.textStyle}>{t('debit')}</Text>
                </View>
          </View>
          <View style={styles.menuContainer}>
                <View style={styles.menuButtonLeft}>
                    <Pressable onPress={viewAnalysis}></Pressable>
                    <IconButton icon="bar-chart-outline" size={48} color="black" onPress={viewAnalysis}/>
                    <Text style={styles.textStyle}>{t('analysis')}</Text>
                </View>
                <View style={styles.menuButtonRight}>
                    <Pressable onPress={viewCategories}></Pressable>
                    <IconButton icon="apps-sharp" size={48} color="black" onPress={viewCategories}/>
                    <Text style={styles.textStyle}>{t('categories')}</Text>
                </View>
          </View>
          <View style={styles.menuContainer}>
                <View style={styles.menuButtonLeft}>
                    <Pressable onPress={viewCategories}></Pressable>
                    <IconButton icon="settings-outline" size={48} color="black" onPress={viewSettings}/>
                    <Text style={styles.textStyle}>{t('settings')}</Text>
                </View>
                <View style={styles.menuButtonRight}>
                    <Pressable onPress={viewHistory}></Pressable>
                    <IconButton icon="list-outline" size={48} color="black" onPress={viewHistory}/>
                    <Text style={styles.textStyle}>{t('history')}</Text>
                </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  centeredView: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
  },
  container: {
    color: 'black',
    alignItems: 'center',
  },
  infoContainer: {
    borderRadius: 25,
    backgroundColor: '#f2e9e9',
    width: '90%',
    marginBottom: '10%',
    borderStyle: 'solid',
    borderWidth: 3,
    borderColor: 'black'
  },
  balanceText: {
    color: 'black',
    marginLeft: 10,
    fontSize: 24,
    fontWeight: "bold"
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    marginTop: 5,
  },
  menuContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  menuButtonLeft: {
    flexDirection: 'column',
    width: '45%',
    borderRadius: 25,
    backgroundColor: '#f2d6d3ff',
    padding: 10,
    marginBottom: 10,
    marginRight: 10,
  },
  menuButtonRight: {
    flexDirection: 'column',
    width: '45%',
    borderRadius: 25,
    backgroundColor: '#f2d6d3ff',
    padding: 10,
    marginLeft: 10,
    marginBottom: 10
  },
  notesContainer: {
    flexDirection: 'row',
    marginLeft: 20,
    marginBottom: 10,
  },
  noteContainer: {
    flexDirection: 'row'
  },
  noteText: {
    alignItems: 'center',
    width: '30%',
    padding: 0,
    marginTop: 10,
    height: 35,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    color: 'white'
  },
  darkModeText: {
    color: 'black',
  },
  lightModeText: {
    color: 'black',
  },
  stepContainer: {
    gap: 24,
    marginBottom: 24,
    flexDirection: 'row',
  },
  logo: {
    height: '100%',
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  fiveColour: {
    backgroundColor: 'gray',
  },
  tenColour: {
    backgroundColor: 'red',
  },
  twentyColour: {
    backgroundColor: 'blue',
  },
  fiftyColour: {
    backgroundColor: 'orange',
  },
  hundredColour: {
    backgroundColor: 'green',
  },
  amount: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
    fontSize: 24,
    marginTop: 10,
    width: 75,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 20,
  },
  button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginRight: 10,
        marginLeft: 10,
        height: 50,
        width: '40%',  
        backgroundColor: '#f2d6d3ff'
  },
  textStyle: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20,
        marginTop: 10
  },
});
