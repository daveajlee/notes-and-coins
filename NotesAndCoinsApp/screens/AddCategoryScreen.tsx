import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import { insertCategory } from '../utilities/sqlite';
import IconButton from '../components/IconButton';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import './../assets/i18n/i18n';
import SelectModal from '../modals/SelectModal';

type NavigationStackParams = {
  navigate: Function;
}

export default function AddCategoryScreen() {

    const {t, i18n} = useTranslation();

    const [name, setName] = useState('');
    const [colourValue, setColourValue] = useState<any>();

    const [modalVisible, setModalVisible] = useState(false);

    const colourItems = [
        {label: t('red'), value: 'red'},
        {label: t('green'), value: 'green'},
        {label: t('yellow'), value: 'yellow'},
        {label: t('blue'), value: 'blue'},
        {label: t('purple'), value: 'purple'},
        {label: t('orange'), value: 'orange'},
        {label: t('pink'), value: 'pink'},
        {label: t('brown'), value: 'brown'},
        {label: t('gray'), value: 'gray'},
    ];

    // Navigation hook
    const navigation = useNavigation<NavigationStackParams>();

    /**
     * Set the name that the user entered.
     * @param {string} enteredText the text that the user entered in the category name field.
     */
    function nameInputHandler(enteredText: string) {
        setName(enteredText);
    }

    async function save() {
        if ( name.trim().length === 0 ) {
            Alert.alert(t('validCategoryName'));
        }
        else if ( await insertCategory(name, colourValue.value) ) {
            Alert.alert(t('categoryAdded'), t('categoryAddedMessage', { categoryName: name }));
            setName('');
            setColourValue('');
            navigation.navigate('CategoriesScreen');
        } else {
            Alert.alert(t('error'), t('errorDuplicateCategory', { categoryName: name }));
        }
        
    }

    function chooseColour() {
        setModalVisible(true);
    }

    function setMyColour(value) {
        setColourValue(value);
    }

    return ( 
        <View style={styles.centeredView}>
            <View style={styles.inputContainer}>
                <View style={styles.textFieldContainer}>
                    <Text style={styles.fieldText}>{t('name')}:</Text>
                    <TextInput style={styles.textInput} placeholder={t('placeholderCategoryName')} onChangeText={nameInputHandler} value={name}/>
                </View>
                <View style={styles.textFieldContainer}>
                    <Text style={styles.fieldText}>{t('colour')}:</Text>
                    <Text style={styles.entryText}>{colourValue && colourValue.label}</Text>
                    <View style={styles.moreChevron}>
                        <IconButton icon="chevron-forward" size={24} color="black" onPress={chooseColour}/>
                    </View>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={save}>
                    <Text style={styles.buttonText}>{t('save')}</Text>
                </TouchableOpacity>
            </View>
            <SelectModal modalVisible={modalVisible} setModalVisible={setModalVisible} setOriginSelectedItem={setMyColour} data={colourItems} headerTitle={t('colour')}/>
        </View>
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
        width: '35%',
        color: 'black'
    },
    textInput: {
        paddingLeft: 10,
        fontSize: 18,
        textAlign: 'right',
        width: '55%'
    },
    entryText: {
        paddingLeft: 10,
        fontSize: 18,
        width: '55%',
        color: 'black',
        textAlign: 'right'
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
    moreChevron: {
        display: 'flex',
        width: '5%',
        alignItems: 'flex-end',
    }
});