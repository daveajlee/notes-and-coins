import { StyleSheet} from 'react-native';
import { useEffect, useState } from 'react';
import {ScrollView, Text, View} from "react-native";
import { TouchableOpacity } from 'react-native';
import { updateValueAmount, fetchAmount, insertValueAmount } from '../utilities/sqlite';

/**
 * Show the home screen with the various categories of notes and the quantities to increase and decrease the amount of notes.
 */
export default function HomeScreen() {

    const [balance, setBalance] = useState(0);
    const [fiveAmount, setFiveAmount] = useState(0);
    const [tenAmount, setTenAmount] = useState(0);
    const [twentyAmount, setTwentyAmount] = useState(0);
    const [fiftyAmount, setFiftyAmount] = useState(0);

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
        }
        return await(fetchAmount(noteValue));
    }

    async function onIncreaseNote5(): Promise<void> {
      console.log('In increase note 5');
      await onIncreaseNote(5);
      setFiveAmount(fiveAmount+1);
    }

    async function onIncreaseNote10(): Promise<void> {
      await onIncreaseNote(10);
      setTenAmount(tenAmount+1);
    }

    async function onIncreaseNote20(): Promise<void> {
      await onIncreaseNote(20);
      setTwentyAmount(twentyAmount+1);
    }

    async function onIncreaseNote50(): Promise<void> {
      await onIncreaseNote(50);
      setFiftyAmount(fiftyAmount+1);
    }

    async function onDecreaseNote5(): Promise<void> {
      await onDecreaseNote(5);
      if ( fiveAmount > 1 ) {
        setFiveAmount(fiveAmount-1);
      } else {
        setFiveAmount(0);
      }
    }

    async function onDecreaseNote10(): Promise<void> {
      await onDecreaseNote(10);
      if ( tenAmount > 1 ) {
        setTenAmount(tenAmount-1);
      } else {
        setTenAmount(0);
      }
    }

    async function onDecreaseNote20(): Promise<void> {
      await onDecreaseNote(20);
      if ( twentyAmount > 1 ) {
        setTwentyAmount(twentyAmount-1);
      } else {
        setTwentyAmount(0);
      }
    }

    async function onDecreaseNote50(): Promise<void> {
      await onDecreaseNote(50);
      if ( fiftyAmount > 1 ) {
        setFiftyAmount(fiftyAmount-1);
      } else {
        setFiftyAmount(0);
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
        <ScrollView>
            <View style={styles.titleContainer}>
                <Text>Your Current Balance</Text>
            </View>
            <View style={styles.titleContainer}>
                <Text>{balance}€</Text>
            </View>
            <View style={styles.stepContainer}>
                <Text style={styles.fiveColour}>5</Text>
                <Text style={styles.amount}>{fiveAmount}</Text>
                <TouchableOpacity style={styles.fiveButton} onPress={onIncreaseNote5}>
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.fiveButton} onPress={onDecreaseNote5}>
                    <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.stepContainer}>
                <Text style={styles.tenColour}>10</Text>
                <Text style={styles.amount}>{tenAmount}</Text>
                <TouchableOpacity style={styles.tenButton} onPress={onIncreaseNote10}>
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tenButton} onPress={onDecreaseNote10}>
                    <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.stepContainer}>
                <Text style={styles.twentyColour}>20</Text>
                <Text style={styles.amount}>{twentyAmount}</Text>
                <TouchableOpacity style={styles.twentyButton} onPress={onIncreaseNote20}>
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.twentyButton} onPress={onDecreaseNote20}>
                    <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.stepContainer}>
                <Text style={styles.fiftyColour}>50</Text>
                <Text style={styles.amount}>{fiftyAmount}</Text>
                <TouchableOpacity style={styles.fiftyButton} onPress={onIncreaseNote50}>
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.fiftyButton} onPress={onDecreaseNote50}>
                    <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        justifyContent: "center",
        marginBottom: 24,
    },
    stepContainer: {
        gap: 24,
        marginBottom: 24,
        flexDirection: 'row'
    },
    logo: {
        height: "100%",
        width: "100%",
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
        color: 'white'
    },
    fiveButton: {
        alignItems: "center",
        backgroundColor: "gray",
        width: '10%',
        padding: 0,
        marginTop: 10,
        height: 30
    },
    tenColour: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 28,
        marginTop: 10,
        width: 100,
        backgroundColor: 'red',
        color: 'white'
    },
    tenButton: {
        alignItems: "center",
        backgroundColor: "red",
        width: '10%',
        padding: 0,
        marginTop: 10,
        height: 30
    },
    twentyColour: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 28,
        marginTop: 10,
        width: 100,
        backgroundColor: 'blue',
        color: 'white'
    },
    twentyButton: {
        alignItems: "center",
        backgroundColor: "blue",
        width: '10%',
        padding: 0,
        marginTop: 10,
        height: 30
    },
    fiftyColour: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 28,
        marginTop: 10,
        width: 100,
        backgroundColor: 'orange',
        color: 'white'
    },
    fiftyButton: {
        alignItems: "center",
        backgroundColor: "orange",
        width: '10%',
        padding: 0,
        marginTop: 10,
        height: 30
    },
    amount: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 28,
        marginTop: 10,
        width: 100
    },
    buttonText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});