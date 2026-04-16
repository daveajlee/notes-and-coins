import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { insertCategory } from '../utilities/sqlite';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';

type NavigationStackParams = {
  navigate: Function;
}

export default function AddCategoryScreen() {

    const [name, setName] = useState('');
    const [colour, setColour] = useState('red');
    const [colourValue] = useState(null);

    const [colourItems] = useState([
        {label: 'Red', value: 'red'},
        {label: 'Green', value: 'green'},
        {label: 'Yellow', value: 'yellow'},
        {label: 'Blue', value: 'blue'},
        {label: 'Purple', value: 'purple'},
        {label: 'Orange', value: 'orange'},
        {label: 'Pink', value: 'pink'},
        {label: 'Brown', value: 'brown'},
        {label: 'Gray', value: 'gray'},
    ]);

    // Navigation hook
    const navigation = useNavigation<NavigationStackParams>();

    /**
     * Set the name that the user entered.
     * @param {string} enteredText the text that the user entered in the category name field.
     */
    function nameInputHandler(enteredText: string) {
        setName(enteredText);
    }

    /**
     * Render the item on the colour dropdown list with the label and the appropriate styling.
     * @param item the item to be displayed on the colour dropdown list.
     * @returns the appropriate components to display to the user.
     */
    const _renderColourItem = (item: any) => {
        return (
            <View>
                <Text style={styles.colourItemLight}>{item.label}</Text>
            </View>
        );
    };

    async function save() {
        if ( name.trim().length === 0 ) {
            Alert.alert('Please enter a valid category name.');
        }
        else if ( await insertCategory(name, colour) ) {
            Alert.alert('Category Added', `Category ${name} added successfully.`);
            setName('');
            setColour('');
            navigation.navigate('CategoriesScreen');
        } else {
            Alert.alert('Error', `Category ${name} could not be added. The name of the category already exists.`);
        }
        
    }

    function reset() {
        setName('');
        setColour('');
    }

    return ( 
        <View style={styles.centeredView}>
            <View style={styles.categoryNameContainer}>
                <Text style={[styles.fieldLabel]}>Name:</Text>
                <TextInput style={styles.textInput} placeholder='Your Category Name' onChangeText={nameInputHandler} value={name}/>
            </View>
            <View style={styles.categoryNameContainer}>
                <Text style={[styles.fieldLabel]}>Colour:</Text>
                    <Dropdown
                        style={styles.colourDropdownLight}
                        data={colourItems}
                        labelField="label"
                        valueField="value"
                        placeholder="Red"
                        value={colourValue}
                        onChange={item => {
                            setColour(item.value);          
                        }}
                        renderItem={item => _renderColourItem(item)}
                    />
                </View>
                <View style={styles.categoryButtonContainer}>
                    <Pressable style={[styles.button]} onPress={save}>
                        <Text style={styles.textStyle}>Save</Text>
                    </Pressable>
                    <Pressable style={[styles.button]} onPress={reset}>
                        <Text style={styles.textStyle}>Reset</Text>
                    </Pressable>
                </View>
            </View>
    );

}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
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
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20
  },
  categoryNameContainer: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 20
  },
  fieldLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingBottom: 16,
    color: 'white',
    marginLeft: 5,
    width: '25%'
},
 categoryButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20
 },
 textInput: {
    borderWidth: 1,
    borderColor: '#e4d0ff',
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 6,
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'left',
    marginLeft: '10%',
    padding: 8
},
colourDropdownLight: {
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
colourItemLight: {
    color: 'black',
    fontSize: 18,
    marginLeft: 5
},
});