import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dropdown } from "react-native-element-dropdown";
import { fetchCategories, insertHistoryEntry } from "../utilities/sqlite";
import DatePicker from "react-native-date-picker";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native";
import { fetchAmount, updateValueAmount, insertValueAmount } from "../utilities/sqlite";
import { useTranslation } from "react-i18next";
import './../assets/i18n/i18n';

type NavigationStackParams = {
  navigate: Function;
  setOptions: Function;
}

export default function AddHistoryScreen({route}: any) {

    const {t, i18n} = useTranslation();

    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date());
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');

    const [categories, setCategories] = useState<{label: string, value: string}[]>([]);
    const [initialCategory, setInitialCategory] = useState('Select a category');

    // Navigation hook
    const navigation = useNavigation<NavigationStackParams>();

    // Notes amount.
    const [fiveAmount, setFiveAmount] = useState(0);
    const [tenAmount, setTenAmount] = useState(0);
    const [twentyAmount, setTwentyAmount] = useState(0);
    const [fiftyAmount, setFiftyAmount] = useState(0);
    const [hundredAmount, setHundredAmount] = useState(0);

    useEffect(() => {
        async function prepare() {
            try {
                navigation.setOptions({title: 'Add History Entry - ' + (route.params.isDebit ? 'Debit' : 'Credit')});
                let dbCategories = await fetchCategories();
                let dropdownCategories = dbCategories.map((cat) => ({ label: cat.name, value: cat.name }));
                setCategories(dropdownCategories);
                setInitialCategory(dbCategories[0]?.name || 'No categories available');
                setCategory(dbCategories[0]?.name || 'Unassigned');
            } catch (err) {
                console.log(err);
            }
        }
        prepare();
    }, [navigation, route.params.isDebit]);

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

    /**
     * Render the item on the category dropdown list with the label and the appropriate styling.
     * @param item the item to be displayed on the category dropdown list.
     * @returns the appropriate components to display to the user.
     */
    const _renderCategoryItem = (item: any) => {
        return (
            <View>
                <Text style={styles.categoryItem}>{item.label}</Text>
            </View>
        );
    };

    async function save() {
        // Convert any commas to dots for decimal representation.
        let convertedAmount = amount;
        if ( amount.includes(',') ) {
            convertedAmount = amount.replace(',', '.');
        }
        // Now save the entry to the database.
        if ( await insertHistoryEntry(convertedAmount, description, category, date.toISOString(), route.params.isDebit ? 'debit' : 'credit') ) {
            Alert.alert('History Entry Added', `History entry added successfully.`);
            setAmount(''); 
            setDate(new Date());
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
            // Redirect to history screen.
            navigation.navigate('HistoryScreen');
        } else {
            Alert.alert('Error', `History entry could not be added.`);
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
    
    function reset() {
        setAmount("0,00");
        setDate(new Date());
        setCategory('');
        setDescription('');
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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#A2574F', }}>
            <ScrollView>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.centeredView}>
                <View style={styles.formFieldContainer}>
                    <Text style={[styles.formFieldLabel]}>{t('amount')}:</Text>
                    <TextInput style={styles.formFieldValue} placeholder='0,00' onChangeText={amountInputHandler} value={amount}/> 
                </View>
                <View style={styles.formFieldContainer}>
                    <Text style={[styles.formFieldLabel]}>{t('category')}:</Text>
                    <Dropdown
                        style={styles.dropdown}
                        data={categories}
                        labelField="label"
                        valueField="value"
                        placeholder={initialCategory}
                        value={category}
                        onChange={item => {
                            setCategory(item.value);                 
                        }}
                        renderItem={item => _renderCategoryItem(item)}
                    />
                </View>
                <View style={styles.formFieldContainer}>
                    <Text style={[styles.formFieldLabel]}>{t('title')}:</Text>
                    <TextInput style={styles.formFieldValue} placeholder={t('placeholderTitle')} onChangeText={descriptionInputHandler} value={description}/>
                </View>
                <View style={styles.formFieldContainer}>
                    <Text style={[styles.formFieldLabel]}>{t('date')}:</Text>
                    <DatePicker theme="dark" date={date} onDateChange={setDate} />
                </View>
                <View style={styles.formFieldContainer}>
                    <Text style={[styles.formFieldLabel]}>{t('notes')}:</Text>
                    <View style={styles.notesContainer}>
                        <View style={styles.noteContainer}>
                            <Pressable onPress={increaseFiveAmount}><Text style={[styles.noteText, styles.fiveColour]}>5</Text></Pressable>
                            <Text style={styles.noteAmount}>({fiveAmount})</Text>
                        </View>
                        <View style={styles.noteContainer}>
                            <Pressable onPress={increaseTenAmount}><Text style={[styles.noteText, styles.tenColour]}>10</Text></Pressable>
                            <Text style={styles.noteAmount}>({tenAmount})</Text>
                        </View>
                        <View style={styles.noteContainer}>
                            <Pressable onPress={increaseTwentyAmount}><Text style={[styles.noteText, styles.twentyColour]}>20</Text></Pressable>
                            <Text style={styles.noteAmount}>({twentyAmount})</Text>
                        </View>
                        <View style={styles.noteContainer}>
                            <Pressable onPress={increaseFiftyAmount}><Text style={[styles.noteText, styles.fiftyColour]}>50</Text></Pressable>
                            <Text style={styles.noteAmount}>({fiftyAmount})</Text>
                        </View>
                        <View style={styles.noteContainer}>
                            <Pressable onPress={increaseHundredAmount}><Text style={[styles.noteText, styles.hundredColour]}>100</Text></Pressable>
                            <Text style={styles.noteAmount}>({hundredAmount})</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <Pressable style={[styles.button]} onPress={save}>
                        <Text style={styles.textStyle}>{t('save')}</Text>
                    </Pressable>
                    <Pressable style={[styles.button]} onPress={reset}>
                        <Text style={styles.textStyle}>{t('reset')}</Text>
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
        color: 'white',
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
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'center',
        marginBottom: 20
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        width: '40%',
        height: 50,
        marginRight: 10,
        backgroundColor: '#f2d6d3ff'
    },
    textStyle: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20
    },
    notesContainer: {
        borderWidth: 1,
        borderColor: '#e4d0ff',
        color: 'black',
        borderRadius: 6,
        width: '60%',
        justifyContent: 'flex-end',
        textAlign: 'right',
        marginLeft: '10%',
        padding: 8
    },
    noteContainer: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    noteText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 28,
        marginRight: 40,
        marginLeft: 5,
        width: 60,
        height: 40,
        color: 'white',
    },
    noteAmount: {
        textAlign: 'right',
        fontWeight: 'bold',
        fontSize: 24,
        color: 'white',
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