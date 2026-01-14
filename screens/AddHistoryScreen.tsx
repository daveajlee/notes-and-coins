import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddHistoryScreen() {

    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');

    /**
     * Set the amount that the user entered.
     * @param {string} enteredText the text that the user entered in the amount field.
     */
    function amountInputHandler(enteredText: string) {
        setAmount(enteredText);
    }

    /**
     * Set the description that the user entered.
     * @param {string} enteredText the text that the user entered in the description field.
     */
    function descriptionInputHandler(enteredText: string) {
        setDescription(enteredText);
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#A2574F', }}>
            <View style={styles.centeredView}>
                <View style={styles.formFieldContainer}>
                    <Text style={[styles.formFieldLabel]}>Name:</Text>
                    <TextInput style={styles.formFieldValue} placeholder='0.00' onChangeText={amountInputHandler} value={amount}/>
                </View>
                <View style={styles.formFieldContainer}>
                    <Text style={[styles.formFieldLabel]}>Date:</Text>
                    <Text style={[styles.formFieldValue]}>Date Picker Coming Soon!</Text>
                </View>
                <View style={styles.formFieldContainer}>
                    <Text style={[styles.formFieldLabel]}>Category:</Text>
                    <Text style={[styles.formFieldValue]}>DropDown Coming Soon!</Text>
                </View>
                <View style={styles.formFieldContainer}>
                    <Text style={[styles.formFieldLabel]}>Description:</Text>
                    <TextInput style={styles.formFieldValue} placeholder='A short description explaining why...' onChangeText={descriptionInputHandler} value={description}/>
                </View>
            </View>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
    },
    formFieldContainer: {
        flexDirection: 'column',
        width: '100%',
        marginTop: 20
    },
    formFieldLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingBottom: 16,
        color: 'white',
    },
    formFieldValue: {
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
    }
});