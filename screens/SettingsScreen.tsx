import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import { fetchMinimumBalance, insertMinimumBalance } from "../utilities/sqlite";

/**
 * Show the settings screen.
 */
export default function SettingsScreen() {

    const [minimumBalance, setMinimumBalance] = useState('');

    useEffect(() => {
        async function prepare() {
            try {
                let fetchedMinimumBalance = await fetchMinimumBalance();
                let parsedMinimumBalance = parseFloat(fetchedMinimumBalance.toString().replace(',', '.')).toFixed(2);
                setMinimumBalance("" + parsedMinimumBalance);
              } catch (err) {
                console.log(err);
              }
            }
        
            prepare();
    }, []);

    /**
     * Set the minimum balance that the user entered.
     * @param {string} enteredText the text that the user entered in the minimum balance field.
     */
    function minimumBalanceInputHandler(enteredText: string) {
        setMinimumBalance(enteredText);
    }

    function saveSettings() {
        var regExp = /[a-zA-Z]/;
        // Make sure minimum balance does not contain letters.
        if ( regExp.test(minimumBalance) ) {
            Alert.alert('Please enter a valid minimum balance without letters.');
            return;
        }
        // Make sure minimum balance has a comma or full stop for decimals.
        if ( !minimumBalance.includes(',') && !minimumBalance.includes('.') ) {
            Alert.alert('Please enter a valid minimum balance with notes and coins.');
            return;
        }
        // Parse the number and then to two decimal places.
        let parsedMinimumBalance = parseFloat(minimumBalance.replace(',', '.')).toFixed(2);
        setMinimumBalance(parsedMinimumBalance);
        insertMinimumBalance("" + parsedMinimumBalance);
        Alert.alert('Minimum balance saved successfully.');
    }

    function resetSettings() {
        setMinimumBalance('0,00');
    }

    /**
     * Display the screen to the user.
     */
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#A2574F', }}>
            <View style={styles.minimumBalanceContainer}>
                <Text style={[styles.bodyText]}>Minimum Balance:</Text>
                <TextInput style={styles.textInput} placeholder='Your Minimum Balance' onChangeText={minimumBalanceInputHandler} value={minimumBalance}/>
            </View>
            <View style={styles.buttonContainer}>
                <Pressable style={[styles.button]} onPress={saveSettings}>
                    <Text style={styles.textStyle}>Save</Text>
                </Pressable>
                <Pressable style={[styles.button]} onPress={resetSettings}>
                    <Text style={styles.textStyle}>Reset</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    text: {
        color: 'white',
        marginLeft: 10,
        fontSize: 30,
        fontWeight: "bold"
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20
    },
    minimumBalanceContainer: {
        flexDirection: 'column',
        width: '100%',
        marginTop: 20
    },
    bodyText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingBottom: 16,
        color: 'white',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#e4d0ff',
        backgroundColor: 'white',
        color: 'black',
        borderRadius: 6,
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        marginLeft: '10%',
        padding: 8
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        width: 80,
        marginRight: 10,
        backgroundColor: '#f2d6d3ff'
    },
    textStyle: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});