/**
 * This component displays a single history entry.
 */
import { Alert, StyleSheet, Text, View } from "react-native";
import IconButton from "./IconButton";
import { deleteHistoryEntry } from "../utilities/sqlite";
import { HistoryEntryResult } from "../models/HistoryEntryResult";
import { getCurrencies, getLocales, getTimeZone } from "react-native-localize";

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
        if ( categoryColour === 'yellow' ) {
            return { backgroundColor: categoryColour, color: 'black' };
        } else {
            return { backgroundColor: categoryColour };
        }
    }

    function getCurrency(value: string) {
        return Intl.NumberFormat(getLocales()[0].languageTag, { style: "currency", currency: getCurrencies()[0] }).format( parseFloat(value) )
    }

    function convertUTCDateToLocal(datetime: string) {
        let timezone = getTimeZone();
        console.log('Timezone is ' + timezone);
        let date = new Date(datetime);
        let options: Intl.DateTimeFormatOptions = {
            timeZone: timezone,
            hour12: false,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        return new Intl.DateTimeFormat(getLocales()[0].languageTag, options).format(date);
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.leftRow}>
                <Text style={styles.leftRowText}>{convertUTCDateToLocal(datetime)}</Text>
            </View>
            <View style={styles.middleRow}>
                {categoryName ? <Text style={[styles.listText, getBackgroundColour()]}>{categoryName}</Text> : <Text style={[styles.listText, styles.unassigned]}>Unassigned</Text>}
                <Text style={styles.listText}>{description}</Text>
            </View>
            <View style={styles.rightRow}>
                <Text style={styles.rightRowText}>{getCurrency(parseFloat(sum).toFixed(2))}</Text>
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
        marginTop: 10,
        borderBottomColor: 'white',
        borderBottomWidth: 2,
    },
    leftRow: {
        width: '30%',
    },
    middleRow: {
        width: '40%',
        marginBottom: 10,
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