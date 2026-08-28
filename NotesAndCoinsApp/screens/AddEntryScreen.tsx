import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchCategories, insertHistoryEntry, fetchAmount, updateValueAmount, insertValueAmount } from "../utilities/sqlite";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import '../assets/i18n/i18n';
import IconButton from "../components/IconButton";
import SelectModal from "../modals/SelectModal";
import ChangeModal from "../modals/ChangeModal";
import DateTimePicker from '@react-native-community/datetimepicker';

type NavigationStackParams = {
  navigate: Function;
  setOptions: Function;
}

export default function AddEntryScreen({route}: any) {

    const {t, i18n} = useTranslation();

    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [category, setCategory] = useState<any>();
    const [description, setDescription] = useState('');

    const [categories, setCategories] = useState<{label: string, value: string}[]>([]);

    // Navigation hook
    const navigation = useNavigation<NavigationStackParams>();

    // Notes amount.
    const [fiveAmount, setFiveAmount] = useState(0);
    const [tenAmount, setTenAmount] = useState(0);
    const [twentyAmount, setTwentyAmount] = useState(0);
    const [fiftyAmount, setFiftyAmount] = useState(0);
    const [hundredAmount, setHundredAmount] = useState(0);

    // Notes as change amount.
    const [changeFiveAmount, setChangeFiveAmount] = useState(0);
    const [changeTenAmount, setChangeTenAmount] = useState(0);
    const [changeTwentyAmount, setChangeTwentyAmount] = useState(0);
    const [changeFiftyAmount, setChangeFiftyAmount] = useState(0);
    const [changeHundredAmount, setChangeHundredAmount] = useState(0);

    const [showCategoryNameModal, setShowCategoryNameModal] = useState(false);
    const [showDateModal, setShowDateModal] = useState(false);
    const [showTimeModal, setShowTimeModal] = useState(false);
    const [showChangeModal, setShowChangeModal] = useState(false);

    const [changeAmount, setChangeAmount] = useState(0);

    useEffect(() => {
        async function prepare() {
            try {
                navigation.setOptions({title: t('addHistoryTitle', { type: route.params.isDebit ? t('debit') : t('credit') })});
                let dbCategories = await fetchCategories();
                let dropdownCategories = dbCategories.map((cat) => ({ label: cat.name, value: cat.name }));
                setCategories(dropdownCategories);
                setCategory(dbCategories[0]?.name || 'Unassigned');
            } catch (err) {
                console.log(err);
            }
        }
        prepare();
    }, [navigation, route.params.isDebit, t]);

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

    async function save() {
        // Convert any commas to dots for decimal representation.
        let convertedAmount = amount;
        if ( amount.includes(',') ) {
            convertedAmount = amount.replace(',', '.');
        }
        let mergedDateTime = new Date();
        mergedDateTime.setDate(date.getDate());
        mergedDateTime.setMonth(date.getMonth());
        mergedDateTime.setFullYear(date.getFullYear());
        mergedDateTime.setHours(time.getHours());
        mergedDateTime.setMinutes(time.getMinutes());
        // Now save the entry to the database.
        if ( await insertHistoryEntry(convertedAmount, description, category.label, mergedDateTime.toISOString(), route.params.isDebit ? 'debit' : 'credit') ) {
            Alert.alert(t('historyAdded'), t('historyAddedMessage'));
            setAmount(''); 
            setDate(new Date());
            setTime(new Date());
            setCategory('');
            setDescription('');
            // Now we take care of notes.
            if ( route.params.isDebit ) {
                if ( fiveAmount > 0 ) {
                    await onDecreaseNote(5, fiveAmount);
                }
                if ( tenAmount > 0 ) {
                    await onDecreaseNote(10, tenAmount);
                }
                if ( twentyAmount > 0 ) {
                    await onDecreaseNote(20, twentyAmount);
                }
                if ( fiftyAmount > 0 ) {
                    await onDecreaseNote(50, fiftyAmount);
                }
                if ( hundredAmount > 0 ) {
                    await onDecreaseNote(100, hundredAmount);
                }
                // Sort change.
                if ( changeFiveAmount > 0 ) {
                    await onIncreaseNote(5, changeFiveAmount);
                }
                if ( changeTenAmount > 0 ) {
                    await onIncreaseNote(10, changeTenAmount);
                }
                if ( changeTwentyAmount > 0 ) {
                    await onIncreaseNote(20, changeTwentyAmount);
                }
                if ( changeFiftyAmount > 0 ) {
                    await onIncreaseNote(50, changeFiftyAmount);
                }
                if ( changeHundredAmount > 0 ) {
                    await onIncreaseNote(100, changeHundredAmount);
                }
            } else {
                if ( fiveAmount > 0 ) {
                    await onIncreaseNote(5, fiveAmount);
                }
                if ( tenAmount > 0 ) {
                    await onIncreaseNote(10, tenAmount);
                }
                if ( twentyAmount > 0 ) {
                    await onIncreaseNote(20, twentyAmount);
                }
                if ( fiftyAmount > 0 ) {
                    await onIncreaseNote(50, fiftyAmount);
                }
                if ( hundredAmount > 0 ) {
                    await onIncreaseNote(100, hundredAmount);
                }
            }
            // Redirect to main menu screen.
            navigation.navigate('MainMenuScreen');
        } else {
            Alert.alert(t('error'), t('historyAddErrorMessage'));
        }
    }

    async function onIncreaseNote(noteValue: number, quantity: number) {
        let currentValue:number = await fetchAmount(noteValue);
        if ( currentValue ) {
            await updateValueAmount(noteValue, currentValue + quantity);
        } else {
            await insertValueAmount(noteValue, quantity);
        }
    }
    
    async function onDecreaseNote(noteValue: number, quantity: number) {
        let currentValue:number = await fetchAmount(noteValue);
        if ( currentValue && (currentValue - quantity >= 0) ) {
            await updateValueAmount(noteValue, currentValue - quantity);
        } else {
            await updateValueAmount(noteValue, 0);
        }
    }

    function increaseFiveAmount() {
        setFiveAmount(fiveAmount + 1);
    }

    function increaseTenAmount() {
        setTenAmount(tenAmount + 1);
    }

    function increaseTwentyAmount() {
        setTwentyAmount(twentyAmount + 1);
    }

    function increaseFiftyAmount() {
        setFiftyAmount(fiftyAmount + 1);
    }

    function increaseHundredAmount() {
        setHundredAmount(hundredAmount + 1);
    }

    function openCategoryNameModal() {
        setShowCategoryNameModal(true);
    }

    function openChangeModal() {
        setShowChangeModal(true);
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.centeredView}>
                    {/* Input Felder ohne Scheine */}
                    <View style={styles.inputContainer}>
                        <View style={styles.textFieldContainer}>
                            <Text style={[styles.fieldText]}>{t('amount')}:</Text>
                            <TextInput style={styles.textInput} placeholder={"0,00"} onChangeText={amountInputHandler} value={amount}/>
                        </View>
                        <View style={styles.textFieldContainer}>
                            <Text style={[styles.fieldText]}>{t('category')}:</Text>
                            <Text style={[styles.entryText]}>{category && category.label}</Text>
                            <IconButton icon="chevron-forward" size={24} color="black" onPress={openCategoryNameModal}/>
                        </View>
                        <View style={styles.textFieldContainer}>
                            <Text style={[styles.fieldText]}>{t('title')}:</Text>
                            <TextInput style={styles.textInput} placeholder={t('placeholderTitle')} onChangeText={descriptionInputHandler} value={description}/>
                        </View>
                        <View style={styles.textFieldContainer}>
                            <Text style={[styles.fieldText]}>{t('date')}:</Text>
                            <View style={[styles.dateTimePickerEntry]}>
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={date}
                                    mode="date"
                                    is24Hour={true}
                                    onValueChange={(event, selectedDate) => setDate(selectedDate)}
                                    onDismiss={() => setShowDateModal(false)}
                                />
                            </View>
                        </View>
                        <View style={styles.textFieldContainer}>
                            <Text style={[styles.fieldText]}>{t('time')}:</Text>
                            <View style={[styles.dateTimePickerEntry]}>
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={time}
                                    mode="time"
                                    is24Hour={true}
                                    onValueChange={(event, selectedTime) => setTime(selectedTime)}
                                    onDismiss={() => setShowTimeModal(false)}
                                />
                            </View>
                        </View>
                        {route.params.isDebit && <View style={styles.textFieldContainer}>
                            <Text style={[styles.fieldText]}>{t('change')}:</Text>
                            <Text style={[styles.fixedText]}>{changeAmount}</Text>
                            <IconButton icon="cash-outline" size={24} color="black" onPress={openChangeModal}/>
                        </View>}
                    </View>
                    <SelectModal modalVisible={showCategoryNameModal} setModalVisible={setShowCategoryNameModal} setOriginSelectedItem={setCategory} data={categories} headerTitle={t('category')}/>
                    <ChangeModal modalVisible={showChangeModal} setModalVisible={setShowChangeModal} headerTitle={t('change')} setOriginChangeAmount={setChangeAmount}
                        setOriginFiveAmount={setChangeFiveAmount} setOriginTenAmount={setChangeTenAmount} setOriginTwentyAmount={setChangeTwentyAmount} setOriginFiftyAmount={setChangeFiftyAmount} setOriginHundredAmount={setChangeHundredAmount}/>
                    <View style={styles.spacer}></View>
                    <View style={styles.inputContainer}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.balanceText}>{route.params.isDebit ? t('notesSpent') : t('notesGiven')}:</Text>
                        </View>
                        <View style={styles.notesContainer}>
                            <TouchableOpacity onPress={increaseFiveAmount}>
                                <View style={styles.noteContainer}>
                                    <Text style={[styles.noteText, styles.fiveColour]}>5</Text>
                                    <Text style={styles.amount}>{fiveAmount}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={increaseTenAmount}>
                                <View style={styles.noteContainer}>
                                    <Text style={[styles.noteText, styles.tenColour]}>10</Text>
                                    <Text style={styles.amount}>{tenAmount}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.notesContainer}>
                            <TouchableOpacity onPress={increaseTwentyAmount}>
                                <View style={styles.noteContainer}>
                                    <Text style={[styles.noteText, styles.twentyColour]}>20</Text>
                                    <Text style={styles.amount}>{twentyAmount}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={increaseFiftyAmount}>
                                <View style={styles.noteContainer}>
                                    <Text style={[styles.noteText, styles.fiftyColour]}>50</Text>
                                    <Text style={styles.amount}>{fiftyAmount}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.notesContainer}>
                            <TouchableOpacity onPress={increaseHundredAmount}>
                                <View style={styles.noteContainer}>
                                    <Text style={[styles.noteText, styles.hundredColour]}>100</Text>
                                    <Text style={styles.amount}>{hundredAmount}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View> 
                    <View style={styles.buttonContainer}>
                        <Pressable style={[styles.button]} onPress={save}>
                            <Text style={styles.buttonText}>{t('save')}</Text>
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        paddingTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    inputContainer: {
        flexDirection: 'column',
        width: '90%',
        borderRadius: 25,
        backgroundColor: '#f2d6d3ff',
        paddingBottom: 20,
    },
    textFieldContainer: {
        flexDirection: 'row',
        paddingTop: 20,
        paddingLeft: 10,
        paddingRight: 10
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
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'center',
        marginTop: 15,
        marginBottom: 5,
    },
    balanceText: {
        color: 'black',
        marginLeft: 10,
        fontSize: 18,
        fontWeight: "bold"
    },
    spacer: {
        margin: 10,
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
    entryText: {
        paddingLeft: 10,
        fontSize: 18,
        width: '40%',
        textAlign: 'right'
    },
    fixedText: {
        paddingLeft: 10,
        fontSize: 18,
        width: '40%',
        textAlign: 'right',
        paddingRight: 10
    },
    dateTimePickerEntry: {
        paddingLeft: 10,
        fontSize: 18,
        width: '50%',
        alignItems: 'flex-end',
        textAlign: 'right'
    },
    formFieldContainer: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 20
    },
    formFieldLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left',
        paddingBottom: 16,
        width: '25%',
        color: 'black',
        marginLeft: 10
    },
    formFieldValue: {
        borderWidth: 1,
        borderColor: '#e4d0ff',
        backgroundColor: 'white',
        color: 'black',
        borderRadius: 6,
        width: '60%',
        justifyContent: 'flex-end',
        textAlign: 'left',
        marginLeft: '10%',
        padding: 8
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#e4d0ff',
        backgroundColor: 'white',
        color: 'black',
        borderRadius: 6,
        width: '60%',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'right',
        marginLeft: '10%',
        padding: 8
    },
    categoryItem: {
        color: 'black',
        fontSize: 18,
        textAlign: 'left',
        marginLeft: 10
    },
    buttonContainer: {
        marginTop: 40,
        flexDirection: 'row',
    },
    button: {
        alignItems: "center",
        backgroundColor: "#A2574F",
        width: '90%',
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
    amount: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'black',
        fontSize: 24,
        marginTop: 10,
        width: 75,
    },
    noteAmount: {
        textAlign: 'right',
        fontWeight: 'bold',
        fontSize: 24,
        color: 'black',
        marginRight: 10,
        justifyContent: 'flex-end'
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
});