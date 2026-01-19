import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dropdown } from "react-native-element-dropdown";
import { fetchCategories, insertHistoryEntry } from "../utilities/sqlite";
import DatePicker from "react-native-date-picker";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

type NavigationStackParams = {
  navigate: Function;
}

export default function AddHistoryScreen() {

    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date());
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');

    const [categories, setCategories] = useState<{label: string, value: string}[]>([]);
    const [initialCategory, setInitialCategory] = useState('Select a category');

    // Navigation hook
    const navigation = useNavigation<NavigationStackParams>();

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
        if ( await insertHistoryEntry(amount, description, category, date.toISOString()) ) {
            Alert.alert('History Entry Added', `History entry added successfully.`);
            setAmount(''); 
            setDate(new Date());
            setCategory('');
            setDescription('');
            navigation.navigate('Home', { screen: 'History' });
        } else {
            Alert.alert('Error', `History entry could not be added.`);
        }
    }
    
    function reset() {
        setAmount("0.00");
        setDate(new Date());
        setCategory('');
        setDescription('');
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#A2574F', }}>
            <ScrollView style={styles.centeredView}>
                <View style={styles.formFieldContainer}>
                    <Text style={[styles.formFieldLabel]}>Amount:</Text>
                    <TextInput style={styles.formFieldValue} placeholder='0.00' onChangeText={amountInputHandler} value={amount}/>
                </View>
                <View style={styles.formFieldContainer}>
                    <Text style={[styles.formFieldLabel]}>Date:</Text>
                    <DatePicker theme="dark" date={date} onDateChange={setDate} />
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
                            console.log('selected', item);                  
                        }}
                        renderItem={item => _renderCategoryItem(item)}
                    />
                </View>
                <View style={styles.formFieldContainer}>
                    <Text style={[styles.formFieldLabel]}>Description:</Text>
                    <TextInput style={styles.formFieldValue} placeholder='A short description explaining why...' onChangeText={descriptionInputHandler} value={description}/>
                </View>
                <View style={styles.buttonContainer}>
                    <Pressable style={[styles.button]} onPress={save}>
                        <Text style={styles.textStyle}>Save</Text>
                    </Pressable>
                    <Pressable style={[styles.button]} onPress={reset}>
                        <Text style={styles.textStyle}>Reset</Text>
                    </Pressable>
                </View>
            </ScrollView>
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
    },
    dropdown: {
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
});