import {Appearance, StyleSheet} from 'react-native';
import { useEffect, useState } from 'react';
import {Image, ScrollView, Text, View} from "react-native";
import { TouchableOpacity } from 'react-native';
import { updateValueAmount, fetchAmount, insertValueAmount } from '../utilities/sqlite';
import {SafeAreaView} from "react-native-safe-area-context";

/**
 * Show the credit / debit screen with the various categories of notes and the quantities to increase and decrease the amount of notes.
 */
export default function CreditDebitScreen() {

    const [balance, setBalance] = useState(0);
    const [fiveAmount, setFiveAmount] = useState(0);
    const [tenAmount, setTenAmount] = useState(0);
    const [twentyAmount, setTwentyAmount] = useState(0);
    const [fiftyAmount, setFiftyAmount] = useState(0);
    const [hundredAmount, setHundredAmount] = useState(0);

    const colorScheme = Appearance.getColorScheme();

    const logoImage = require('./../assets/images/logo-1024.png');

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
          setBalance((await (getNoteAmount(5)) * 5) + ((await getNoteAmount(10)) * 10) + ((await getNoteAmount(20)) * 20) + ((await getNoteAmount(50)) * 50));
        }

        prepare();

    }, []);

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
        console.log("current value for " + noteValue + " is " + currentValue);
        if ( currentValue ) {
            await updateValueAmount(noteValue, currentValue + 1);
        } else {
            await insertValueAmount(noteValue, 1);
        }
        console.log(await getNoteAmount(noteValue));
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

    /**
     * Display the screen to the user.
     */
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#A2574F', }}>
        <ScrollView contentContainerStyle={styles.container}>
          <Image
            style={{ marginTop: 10, width: 128, height: 128 }}
            source={logoImage}
          />
          <View style={styles.titleContainer}>
            <Text style={styles.balanceText}>Balance:</Text>
            <Text style={styles.balanceText}>{balance}€</Text>
          </View>
          <View style={styles.stepContainer}>
            <Text style={styles.fiveColour}>5</Text>
            <Text style={styles.amount}>{fiveAmount}</Text>
            <TouchableOpacity
              style={styles.fiveButton}
              onPress={onIncreaseNote5}
            >
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.fiveButton}
              onPress={onDecreaseNote5}
            >
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.stepContainer}>
            <Text style={styles.tenColour}>10</Text>
            <Text style={styles.amount}>{tenAmount}</Text>
            <TouchableOpacity
              style={styles.tenButton}
              onPress={onIncreaseNote10}
            >
              <Text
                style={
                  colorScheme === 'dark'
                    ? [styles.darkModeText, styles.buttonText]
                    : [styles.lightModeText, styles.buttonText]
                }
              >
                +
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tenButton}
              onPress={onDecreaseNote10}
            >
              <Text
                style={
                  colorScheme === 'dark'
                    ? [styles.darkModeText, styles.buttonText]
                    : [styles.lightModeText, styles.buttonText]
                }
              >
                -
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.stepContainer}>
            <Text style={styles.twentyColour}>20</Text>
            <Text style={styles.amount}>{twentyAmount}</Text>
            <TouchableOpacity
              style={styles.twentyButton}
              onPress={onIncreaseNote20}
            >
              <Text
                style={
                  colorScheme === 'dark'
                    ? [styles.darkModeText, styles.buttonText]
                    : [styles.lightModeText, styles.buttonText]
                }
              >
                +
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.twentyButton}
              onPress={onDecreaseNote20}
            >
              <Text
                style={
                  colorScheme === 'dark'
                    ? [styles.darkModeText, styles.buttonText]
                    : [styles.lightModeText, styles.buttonText]
                }
              >
                -
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.stepContainer}>
            <Text style={styles.fiftyColour}>50</Text>
            <Text style={styles.amount}>{fiftyAmount}</Text>
            <TouchableOpacity
              style={styles.fiftyButton}
              onPress={onIncreaseNote50}
            >
              <Text
                style={
                  colorScheme === 'dark'
                    ? [styles.darkModeText, styles.buttonText]
                    : [styles.lightModeText, styles.buttonText]
                }
              >
                +
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.fiftyButton}
              onPress={onDecreaseNote50}
            >
              <Text
                style={
                  colorScheme === 'dark'
                    ? [styles.darkModeText, styles.buttonText]
                    : [styles.lightModeText, styles.buttonText]
                }
              >
                -
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.stepContainer}>
            <Text style={styles.hundredColour}>100</Text>
            <Text style={styles.amount}>{hundredAmount}</Text>
            <TouchableOpacity
              style={styles.hundredButton}
              onPress={onIncreaseNote100}
            >
              <Text
                style={
                  colorScheme === 'dark'
                    ? [styles.darkModeText, styles.buttonText]
                    : [styles.lightModeText, styles.buttonText]
                }
              >
                +
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.hundredButton}
              onPress={onDecreaseNote100}
            >
              <Text
                style={
                  colorScheme === 'dark'
                    ? [styles.darkModeText, styles.buttonText]
                    : [styles.lightModeText, styles.buttonText]
                }
              >
                -
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#A2574F',
    color: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 30,
    fontWeight: "bold"
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    marginTop: 48,
    marginBottom: 48,
  },
  darkModeText: {
    color: 'white',
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
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 28,
    marginTop: 10,
    width: 100,
    backgroundColor: 'gray',
    color: 'white',
  },
  fiveButton: {
    alignItems: 'center',
    backgroundColor: 'gray',
    width: '10%',
    padding: 0,
    marginTop: 10,
    height: 30,
  },
  tenColour: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 28,
    marginTop: 10,
    width: 100,
    backgroundColor: 'red',
    color: 'white',
  },
  tenButton: {
    alignItems: 'center',
    backgroundColor: 'red',
    width: '10%',
    padding: 0,
    marginTop: 10,
    height: 30,
  },
  twentyColour: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 28,
    marginTop: 10,
    width: 100,
    backgroundColor: 'blue',
    color: 'white',
  },
  twentyButton: {
    alignItems: 'center',
    backgroundColor: 'blue',
    width: '10%',
    padding: 0,
    marginTop: 10,
    height: 30,
  },
  fiftyColour: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 28,
    marginTop: 10,
    width: 100,
    backgroundColor: 'orange',
    color: 'white',
  },
  fiftyButton: {
    alignItems: 'center',
    backgroundColor: 'orange',
    width: '10%',
    padding: 0,
    marginTop: 10,
    height: 30,
  },
  hundredColour: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 28,
    marginTop: 10,
    width: 100,
    backgroundColor: 'green',
    color: 'white',
  },
  hundredButton: {
    alignItems: 'center',
    backgroundColor: 'green',
    width: '10%',
    padding: 0,
    marginTop: 10,
    height: 30,
  },
  amount: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    fontSize: 28,
    marginTop: 10,
    width: 100,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
