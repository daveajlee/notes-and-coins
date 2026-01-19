/**
 * This component displays a single history entry.
 */
import { Alert, StyleSheet, Text, View } from "react-native";
import IconButton from "./IconButton";
import { deleteHistoryEntry } from "../utilities/sqlite";
import { HistoryEntryResult } from "../models/HistoryEntryResult";

type DisplayHistoryEntryProps = {
    entries: HistoryEntryResult[];
    id: number;
    sum: string;
    datetime: string;
    categoryName: string;
    categoryColour: string;
    description: string;
}

export function DisplayHistoryEntry({entries, id, sum, datetime, categoryName, categoryColour, description}: DisplayHistoryEntryProps) {

    function getBackgroundColour() {
        return { backgroundColor: categoryColour };
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.leftRow}>
                <Text style={styles.leftRowText}>{datetime.split("T")[0]}</Text>
                <Text style={styles.leftRowText}>{datetime.split("T")[1].split(".")[0]}</Text>
            </View>
            <View style={styles.middleRow}>
                {categoryName ? <Text style={[styles.listText, getBackgroundColour()]}>{categoryName}</Text> : <Text style={[styles.listText, styles.unassigned]}>Unassigned</Text>}
                <Text style={styles.listText}>{description}</Text>
            </View>
            <View style={styles.rightRow}>
                <Text style={styles.rightRowText}>€{sum}</Text>
                <IconButton color="white" onPress={() => { 
                    Alert.alert('Confirm deletion', 'Are you sure you want to delete this entry?', [
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                        },
                        {
                            text: 'OK', 
                            onPress: () => {
                                for ( let i = 0; i < entries.length; i++ ) {
                                    if ( entries[i].id === id ) {
                                        entries.splice(id, 1);
                                    }
                                }
                                deleteHistoryEntry(id)
                            }
                        },
                    ]); 
                    ; }} iconName='trash-outline' /> 
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5
    },
    leftRow: {
        width: '30%',
    },
    middleRow: {
        width: '40%',
    },
    rightRow: {
        width: '30%',
        flexDirection: 'row'
    },
    leftRowText: {
        fontSize: 18,
        color: 'white',
        fontWeight: "bold",
        textAlign: 'left'
    },
    listText: {
        fontSize: 18,
        color: 'white',
        fontWeight: "bold",
        textAlign: 'center'
    },
    rightRowText: {
        fontSize: 18,
        color: 'white',
        fontWeight: "bold",
        textAlign: 'left',
        marginLeft: 10,
        width: 60
    },
    unassigned: {
        backgroundColor: 'darkgray',
    }
}); 