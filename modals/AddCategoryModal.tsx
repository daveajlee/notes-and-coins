import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { insertCategory } from '../utilities/sqlite';
import { Dropdown } from 'react-native-element-dropdown';

type AddCategoryModalProps = {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
}

export default function AddCategoryModal({modalVisible, setModalVisible}: AddCategoryModalProps) {

    const [name, setName] = useState('');
    const [colour, setColour] = useState('');
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

    function saveAndClose() {
        insertCategory(name, colour);
        Alert.alert('Category Added', `Category ${name} added successfully.`);
        setModalVisible(!modalVisible);
        setName('');
        setColour('');
    }

    function resetAndClose() {
        setModalVisible(!modalVisible);
        setName('');
        setColour('');
    }

    return ( 
        <Modal
            animationType="none"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Add Category</Text>
                    <View style={styles.categoryNameContainer}>
                        <Text style={[styles.bodyText]}>Name:</Text>
                        <TextInput style={styles.textInputLight} placeholder='Your Category Name' onChangeText={nameInputHandler} value={name}/>
                    </View>
                    <View style={styles.categoryNameContainer}>
                        <Text style={[styles.bodyText]}>Colour:</Text>
                        <Dropdown
                            style={styles.colourDropdownLight}
                            data={colourItems}
                            labelField="label"
                            valueField="value"
                            placeholder="Red"
                            value={colourValue}
                            onChange={item => {
                                setColour(item.value);
                                console.log('selected', item);                  
                            }}
                            renderItem={item => _renderColourItem(item)}
                        />
                    </View>
                    <View style={styles.categoryButtonContainer}>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={saveAndClose}>
                            <Text style={styles.textStyle}>Save</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={resetAndClose}>
                            <Text style={styles.textStyle}>Close</Text>
                        </Pressable>
                    </View>
                    
                </View>
            </View>
        </Modal>
    );

}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#f2d6d3ff',
    borderRadius: 20,
    padding: 35,
    height: "90%",
    width: "80%",
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginRight: 10
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#A2574F',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20
  },
  categoryNameContainer: {
        flexDirection: 'column',
        width: '80%',
        marginBottom: 20
  },
  bodyText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 16
 },
 categoryButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
 },
 textInputLight: {
    borderWidth: 1,
    borderColor: '#e4d0ff',
    backgroundColor: 'white',
    color: '#120438',
    borderRadius: 6,
    width: '100%',
    padding: 8
 },
colourDropdownLight: {
    borderWidth: 1,
    borderColor: '#e4d0ff',
    backgroundColor: 'white',
    color: 'black',
    padding: 2,
},
colourItemLight: {
    color: 'black',
    fontSize: 18,
    marginLeft: 5
},
});