import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { fetchLanguage, fetchMinimumBalance, saveSettingsToDatabase } from "../utilities/sqlite";
import CountryFlag from "react-native-country-flag";
import { useTranslation } from "react-i18next";
import './../assets/i18n/i18n';
import { useNavigation } from "@react-navigation/native";

/**
 * Show the settings screen.
 */
export default function SettingsScreen() {

    const [minimumBalance, setMinimumBalance] = useState('');
    const [language, setLanguage] = useState('');
    const navigation = useNavigation();

    const {t, i18n} = useTranslation();

    useEffect(() => {
        async function prepare() {
            try {
                let fetchedMinimumBalance = await fetchMinimumBalance();
                let parsedMinimumBalance = parseFloat(fetchedMinimumBalance.toString().replace(',', '.')).toFixed(2);
                setMinimumBalance("" + parsedMinimumBalance);
                const myLanguage = await fetchLanguage();
                setLanguage(myLanguage.toLowerCase());
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

    function changeLanguage(languageCode: string) {
        setLanguage(languageCode.toLowerCase());
    }

    async function saveSettings() {
        var regExp = /[a-zA-Z]/;
        // Make sure minimum balance does not contain letters.
        if ( regExp.test(minimumBalance) ) {
            Alert.alert(t('minimumBalanceLetter'));
            return;
        }
        // Make sure minimum balance has a comma or full stop for decimals.
        if ( !minimumBalance.includes(',') && !minimumBalance.includes('.') ) {
            Alert.alert(t('minimumBalanceDecimal'));
            return;
        }
        // Parse the number and then to two decimal places.
        let parsedMinimumBalance = parseFloat(minimumBalance.replace(',', '.')).toFixed(2);
        setMinimumBalance(parsedMinimumBalance);
        await saveSettingsToDatabase(parsedMinimumBalance, language);
        // Change the language of the app immediately after saving.
        i18n.changeLanguage(language);
        // Show confirmation alert that the settings have been saved.
        Alert.alert(t('confirmSaved'));
        // Now go back to the previous screen.
        navigation.goBack();
        
    }

    function resetSettings() {
        setMinimumBalance('0,00');
    }

    /**
     * Display the screen to the user.
     */
    return (
        <SafeAreaView style={styles.centeredView}>
            <View style={styles.inputContainer}>
                <View style={styles.textFieldContainer}>
                    <Text style={[styles.fieldText]}>{t('minimumBalance')}:</Text>
                    <TextInput style={styles.textInput} placeholder={t('minimumBalance')} onChangeText={minimumBalanceInputHandler} value={minimumBalance}/>
                </View>
                <View style={styles.textFieldContainer}>
                    <Text style={[styles.fieldText]}>{t('language')}:</Text>
                    <View style={styles.flagsContainer}>
                        <View style={language === 'de' ? styles.selectedFlag : styles.flag}>
                            <TouchableOpacity onPress={() => changeLanguage('DE')}>
                                <CountryFlag isoCode="de" size={25} />
                            </TouchableOpacity>
                        </View>
                        <View style={language === 'de' ? styles.flag : styles.selectedFlag}>
                            <TouchableOpacity onPress={() => changeLanguage('EN')}>
                                <CountryFlag isoCode="gb" size={25} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
            
            
            <View style={styles.buttonContainer}>
                <Pressable style={[styles.button]} onPress={saveSettings}>
                    <Text style={styles.buttonText}>{t('save')}</Text>
                </Pressable>
                <Pressable style={[styles.button]} onPress={resetSettings}>
                    <Text style={styles.buttonText}>{t('reset')}</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        paddingTop: 20,
        width: '100%',
        alignItems: 'center',
    },
    inputContainer: {
        flexDirection: 'column',
        width: '90%',
        borderRadius: 25,
        backgroundColor: '#f2d6d3ff',
        paddingBottom: 10
    },
    textFieldContainer: {
        flexDirection: 'row',
        paddingTop: 20,
        paddingLeft: 10,
        paddingRight: 10
    },
    fieldText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left',
        width: '50%',
        color: 'black'
    },
    textInput: {
        paddingLeft: 10,
        fontSize: 18,
        textAlign: 'right',
        width: '45%'
    },
    languageContainer: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 20,
    },
    flagsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        width: '40%',
        marginLeft: '10%'
    },
    flag: {
        marginRight: 20,
        marginTop: -2,
        marginBottom: 10
    },
    selectedFlag: {
        marginRight: 20,
        marginTop: -5,
        marginBottom: 10,
        borderWidth: 3
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    buttonContainer: {
        marginTop: 40,
        flexDirection: 'row',
    },
    button: {
        alignItems: "center",
        backgroundColor: "#A2574F",
        width: '40%',
        padding: 10,
        marginBottom: 30,
        marginRight: 10,
        borderRadius: 25
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    textStyle: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20
    },
});