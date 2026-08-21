import { Alert, Modal, StyleSheet, Text, View } from "react-native";
import IconButton from "../components/IconButton";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type ChangeModalProperties = {
  modalVisible: boolean;
  setModalVisible: Function;
  headerTitle: string;
}

function ChangeModal({modalVisible, setModalVisible, headerTitle}: ChangeModalProperties) {

    const {t, i18n} = useTranslation();

    // Notes counters.
    const [fiveAmount, setFiveAmount] = useState(0);
    const [tenAmount, setTenAmount] = useState(0);
    const [twentyAmount, setTwentyAmount] = useState(0);
    const [fiftyAmount, setFiftyAmount] = useState(0);
    const [hundredAmount, setHundredAmount] = useState(0);
    const [total, setTotal] = useState(0);

    function onIncreaseValue(note: number) {
        switch ( note ) {
            case 5:
                setFiveAmount(fiveAmount + 1);
                setTotal(total + 5);
                break;
            case 10:
                setTenAmount(tenAmount + 1);
                setTotal(total + 10);
                break;
            case 20:
                setTwentyAmount(twentyAmount + 1);
                setTotal(total + 20);
                break;
            case 50:
                setFiftyAmount(fiftyAmount + 1);
                setTotal(total + 50);
                break;
            case 100:
                setHundredAmount(hundredAmount + 1);
                setTotal(total + 100);
                break;
        }
    }

    function onDecreaseValue(note: number) {
        switch ( note ) {
            case 5:
                if ( fiveAmount > 0 ) {
                    setFiveAmount(fiveAmount - 1);
                    setTotal(total - 5);
                }
                break;
            case 10:
                if ( tenAmount > 0 ) {
                    setTenAmount(tenAmount - 1);
                    setTotal(total - 10);
                }
                break;
            case 20:
                if ( twentyAmount > 0 ) {
                    setTwentyAmount(twentyAmount - 1);
                    setTotal(total - 20);
                }
                break;
            case 50:
                if ( fiftyAmount > 0 ) {
                    setFiftyAmount(fiftyAmount - 1);
                    setTotal(total - 50);
                }
                break;
            case 100:
                if ( hundredAmount > 0 ) {
                    setHundredAmount(hundredAmount - 1);
                    setTotal(total - 100);
                }
                break;
        }
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
                    <View style={styles.optionBoxContainer}>
                        <View style={styles.noteContainer}>
                            <Text style={[styles.noteText, styles.fiveColour]}>5</Text>
                            <Text style={styles.amount}>{fiveAmount}</Text>
                            <View style={styles.notesButtons}>
                                <IconButton icon="remove" size={36} color="black" onPress={onDecreaseValue.bind(null, 5)}/>
                                <View style={styles.spacer}></View>
                                <IconButton icon="add" size={36} color="black" onPress={onIncreaseValue.bind(null, 5)}/>
                            </View> 
                        </View>
                        <View style={styles.noteContainer}>
                            <Text style={[styles.noteText, styles.tenColour]}>10</Text>
                            <Text style={styles.amount}>{tenAmount}</Text>
                            <View style={styles.notesButtons}>
                                <IconButton icon="remove" size={36} color="black" onPress={onDecreaseValue.bind(null, 10)}/>
                                <View style={styles.spacer}></View>
                                <IconButton icon="add" size={36} color="black" onPress={onIncreaseValue.bind(null, 10)}/>
                            </View> 
                        </View>
                        <View style={styles.noteContainer}>
                            <Text style={[styles.noteText, styles.twentyColour]}>20</Text>
                            <Text style={styles.amount}>{twentyAmount}</Text>
                            <View style={styles.notesButtons}>
                                <IconButton icon="remove" size={36} color="black" onPress={onDecreaseValue.bind(null, 20)}/>
                                <View style={styles.spacer}></View>
                                <IconButton icon="add" size={36} color="black" onPress={onIncreaseValue.bind(null, 20)}/>
                            </View> 
                        </View>
                        <View style={styles.noteContainer}>
                            <Text style={[styles.noteText, styles.fiftyColour]}>50</Text>
                            <Text style={styles.amount}>{fiftyAmount}</Text>
                            <View style={styles.notesButtons}>
                                <IconButton icon="remove" size={36} color="black" onPress={onDecreaseValue.bind(null, 50)}/>
                                <View style={styles.spacer}></View>
                                <IconButton icon="add" size={36} color="black" onPress={onIncreaseValue.bind(null, 50)}/>
                            </View> 
                        </View>
                        <View style={styles.noteContainer}>
                            <Text style={[styles.noteText, styles.hundredColour]}>100</Text>
                            <Text style={styles.amount}>{hundredAmount}</Text>
                            <View style={styles.notesButtons}>
                                <IconButton icon="remove" size={36} color="black" onPress={onDecreaseValue.bind(null, 100)}/>
                                <View style={styles.spacer}></View>
                                <IconButton icon="add" size={36} color="black" onPress={onIncreaseValue.bind(null, 100)}/>
                            </View> 
                        </View>
                        <View style={styles.noteContainer}>
                            <Text style={[styles.totalText]}>{t('total')}:</Text>
                            <Text style={styles.amount}>{total}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )

}

export default ChangeModal;

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
        backgroundColor: '#f2d6d3ff',
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
    totalText: {
        alignItems: 'center',
        width: '30%',
        padding: 0,
        marginTop: 10,
        height: 35,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 24,
        color: 'black'
    },
    amount: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'black',
        fontSize: 24,
        marginTop: 10,
        width: 75,
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
    modalHeadline: {
        marginTop: 10,
        marginLeft: 30,
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 36,
        fontWeight: 'bold'
    },
    spacer: {
        marginRight: 20
    },
    notesButtons: {
        marginLeft: 40,
        alignItems: 'flex-end',
        flexDirection: 'row'
    }
});