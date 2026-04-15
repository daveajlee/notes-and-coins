import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dropdown } from "react-native-element-dropdown";
import { fetchCategories, insertHistoryEntry } from "../utilities/sqlite";
import DatePicker from "react-native-date-picker";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScrollView , Switch } from "react-native";

type NavigationStackParams = {
  navigate: Function;
}

export default function AddHistoryScreen() {

    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date());
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [isDebit, setIsDebit] = useState(true);

    function toggleSwitch() {
        setIsDebit(previousState => !previousState);
    }

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
    }, []);

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
        if ( await insertHistoryEntry(convertedAmount, description, category, date.toISOString(), isDebit ? 'debit' : 'credit') ) {
            Alert.alert('History Entry Added', `History entry added successfully.`);
            setAmount(''); 
            setDate(new Date());
            setCategory('');
            setDescription('');
            setIsDebit(true);
            navigation.navigate('HistoryScreen');
        } else {
            Alert.alert('Error', `History entry could not be added.`);
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
                <View style={styles.switchFieldContainer}>
                    <Text style={[styles.formFieldLabel]}>Credit</Text>
                    <Switch
                        style={{marginBottom: 10, marginRight: 10}}
                        trackColor={{false: '#767577', true: '#81b0ff'}}
                        thumbColor={isDebit ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isDebit}
                    />
                    <Text style={[styles.formFieldLabel]}>Debit</Text>
                    <View style={styles.amountType}>
                        <TextInput style={styles.amountFieldValue} placeholder='0,00' onChangeText={amountInputHandler} value={amount}/>
                    </View>
                </View>
                <View style={styles.formFieldContainer}>
                    <Text style={[styles.formFieldLabel]}>Title:</Text>
                    <TextInput style={styles.formFieldValue} placeholder='A short description explaining why...' onChangeText={descriptionInputHandler} value={description}/>
                </View>
                <View style={styles.formFieldContainer}>
                    <Text style={[styles.formFieldLabel]}>Date:</Text>
                    <DatePicker theme="dark" date={date} onDateChange={setDate} />
                </View>
                <View style={styles.formFieldContainer}>
                    <Text style={[styles.formFieldLabel]}>Notes:</Text>
                    <View style={styles.notesContainer}>
                        <View style={styles.noteContainer}>
                            <Pressable onPress={increaseFiveAmount}><Text style={styles.fiveColour}>5</Text></Pressable>
                            <Text style={styles.noteAmount}>({fiveAmount})</Text>
                        </View>
                        <View style={styles.noteContainer}>
                            <Pressable onPress={increaseTenAmount}><Text style={styles.tenColour}>10</Text></Pressable>
                            <Text style={styles.noteAmount}>({tenAmount})</Text>
                        </View>
                        <View style={styles.noteContainer}>
                            <Pressable onPress={increaseTwentyAmount}><Text style={styles.twentyColour}>20</Text></Pressable>
                            <Text style={styles.noteAmount}>({twentyAmount})</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.formFieldContainer}>
                    <View style={styles.notesContainer}>
                        <View style={styles.noteContainer}>
                            <Pressable onPress={increaseFiftyAmount}><Text style={styles.fiftyColour}>50</Text></Pressable>
                            <Text style={styles.noteAmount50}>({fiftyAmount})</Text>
                        </View>
                        <View style={styles.noteContainer}>
                            <Pressable onPress={increaseHundredAmount}><Text style={styles.hundredColour}>100</Text></Pressable>
                            <Text style={styles.noteAmount}>({hundredAmount})</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.formFieldContainer}>
                    <Text style={[styles.formFieldLabel]}>Category:</Text>
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
                <View style={styles.buttonContainer}>
                    <Pressable style={[styles.button]} onPress={save}>
                        <Text style={styles.textStyle}>Save</Text>
                    </Pressable>
                    <Pressable style={[styles.button]} onPress={reset}>
                        <Text style={styles.textStyle}>Reset</Text>
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
    switchFieldContainer: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 20,
        marginLeft: 5
    },
    formFieldContainer: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 20,
        marginLeft: 5
    },
    amountType: {
        flexDirection: 'row',
    },
    amountFieldDropdown: {
        borderWidth: 1,
        borderColor: '#e4d0ff',
        backgroundColor: 'white',
        color: 'black',
        borderRadius: 6,
        width: '30%',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        marginLeft: '10%',
        padding: 8
    },
    amountFieldValue: {
        borderWidth: 1,
        borderColor: '#e4d0ff',
        backgroundColor: 'white',
        color: 'black',
        borderRadius: 6,
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        marginLeft: '10%',
        padding: 8
    },
    formFieldLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingBottom: 16,
        width: '25%',
        color: 'white',
    },
    formFieldValue: {
        borderWidth: 1,
        borderColor: '#e4d0ff',
        backgroundColor: 'white',
        color: 'black',
        borderRadius: 6,
        width: '60%',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
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
        textAlign: 'center',
        marginLeft: '10%',
        padding: 8
    },
    categoryItem: {
        color: 'black',
        fontSize: 18,
        marginLeft: 5
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
    notesContainer: {
        flexDirection: 'row',
    },
    noteContainer: {
        flexDirection: 'column'
    },
    noteAmount: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
    },
    noteAmount50: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
        marginLeft: 70
    },
    fiveColour: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 28,
        marginRight: 10,
        marginLeft: 10,
        width: 80,
        height: 40,
        backgroundColor: 'gray',
        color: 'white',
    },
    tenColour: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 28,
        marginRight: 10,
        marginLeft: 10,
        width: 80,
        height: 40,
        backgroundColor: 'red',
        color: 'white',
    },
    twentyColour: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 28,
        marginRight: 10,
        marginLeft: 10,
        width: 80,
        height: 40,
        backgroundColor: 'blue',
        color: 'white',
    },
    fiftyColour: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 28,
        marginRight: 10,
        marginLeft: 100,
        width: 80,
        height: 40,
        backgroundColor: 'orange',
        color: 'white',
    },
    hundredColour: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 28,
        marginRight: 10,
        marginLeft: 10,
        width: 80,
        height: 40,
        backgroundColor: 'green',
        color: 'white',
    },
});