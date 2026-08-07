import { Alert, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import IconButton from "../components/IconButton";
import { useEffect, useState } from "react";

type SelectModalProperties = {
  modalVisible: boolean;
  setModalVisible: Function;
  setOriginSelectedItem: Function;
  data: any[];
  headerTitle: string;
}

function SelectModal({modalVisible, setModalVisible, setOriginSelectedItem, data, headerTitle}: SelectModalProperties) {

    const [selectedEntry, setSelectedEntry] = useState<any>();

    useEffect(() => {
        async function loadSelectedEntry() {
            setSelectedEntry(data[0]);
        }
    
        loadSelectedEntry();
    }, [data]);

    function selectValue(selected: any) {
        setSelectedEntry(selected);
        setOriginSelectedItem(selected.value);
    }

    return (
        <Modal 
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.headerView}>
                        <IconButton icon="chevron-back-outline" size={48} color="black" onPress={() => setModalVisible(!modalVisible)}/>
                        <Text style={styles.modalHeadline}>{headerTitle}</Text>
                    </View>
                    { data.map((entry, _) => (
                        <View key={entry.label} style={styles.optionBoxContainer}>
                            <Pressable onPress={selectValue.bind(null, entry)}>
                                <View style={styles.optionContainer}>
                                    <View style={styles.nameOptionContainer}>
                                        {entry.label && <Text style={styles.nameOption}>{entry.label}</Text> }
                                    </View>
                                    <View style={styles.valueOptionContainer}>
                                        {selectedEntry && selectedEntry.value === entry.value && <IconButton icon="checkmark" size={48} color="black" onPress={selectValue.bind(null, entry)}/>}
                                    </View>
                                </View>
                                {entry.description && 
                                    <View style={styles.infoOptionContainer}>
                                        <IconButton icon="information-circle" size={32} color="black" onPress={selectValue}/>
                                        {entry.description && <Text style={styles.nameFooterOption}>{entry.description}</Text>}
                                    </View>}
                            </Pressable>
                        </View>
                    ))};
                </View>
            </View>
        </Modal>
    )

}

export default SelectModal;

const styles = StyleSheet.create({

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerView: {
        flexDirection: 'row',
        marginTop: 30
    },
    modalView: {
        margin: 20,
        backgroundColor: '#de9090',
        borderRadius: 20,
        padding: 35,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '100%',
        height: '100%'
    },
    optionContainer: {
        flexDirection: 'row',
    },
    optionBoxContainer: {
        marginBottom: 30
    },
    nameOptionContainer: {
        flexDirection: 'column',
        width: '90%'
    },
    nameOption: {
        fontSize: 36,
        fontWeight: 'bold',
        textAlign: 'left'
    },
    nameFooterOption: {
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'left',
        width: '70%',
        marginLeft: 10
    },
    valueOptionContainer: {
        textAlign: 'right',
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    infoOptionContainer: {
        flexDirection: 'row'
    },
    modalButton: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalHeadline: {
        marginTop: 10,
        marginLeft: 30,
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 48,
        fontWeight: 'bold'
    },
    modalText: {
        marginTop: 30,
        marginBottom: 15,
        textAlign: 'center',
    },

});