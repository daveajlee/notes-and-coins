/**
 * This component displays a single history entry.
 */
import { Alert, StyleSheet, Text, View } from "react-native";
import IconButton from "./IconButton";
import { deleteHistoryEntry } from "../utilities/sqlite";
import { HistoryEntryResult } from "../models/HistoryEntryResult";
import { getCurrencies, getLocales, getTimeZone } from "react-native-localize";
import { useTranslation } from "react-i18next";
import './../assets/i18n/i18n';

type DisplayHistoryEntryProps = {
    entries: HistoryEntryResult[];
    id: number;
    sum: string;
    datetime: string;
    categoryName: string;
    categoryColour: string;
    description: string;
    type: string;
}

export function DisplayHistoryEntry({entries, id, sum, datetime, categoryName, categoryColour, description, type}: DisplayHistoryEntryProps) {

    const {t, i18n} = useTranslation();

    // Translate the category name if it is unassigned.
    if ( categoryName === "Unassigned" ) {
        categoryName = t('unassigned');
    }

    function getBackgroundColour() {
        if ( categoryColour === 'yellow' ) {
            return { backgroundColor: categoryColour, color: 'black' };
        } else {
            return { backgroundColor: categoryColour, };
        }
    }

    function getCurrency(value: string) {
        return Intl.NumberFormat(getLocales()[0].languageTag, { style: "currency", currency: getCurrencies()[0] }).format( parseFloat(value) )
    }

    function convertUTCDateToLocal(datetime: string) {
        let timezone = getTimeZone();
        let date = new Date(datetime);
        let options: Intl.DateTimeFormatOptions = {
            timeZone: timezone,
            hour12: false,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Intl.DateTimeFormat(getLocales()[0].languageTag, options).format(date);
    }

    function getValueWithCurrency() {
        let displayedValue = (type === 'credit') ? '+' : '-';
        return displayedValue + getCurrency(parseFloat(sum).toFixed(2));
    }

    function deleteSelectedEntry() {
        Alert.alert(t('confirmDeletion'), t('deleteEntry'), [
            {
                text: t('cancel'),
                onPress: () => console.log('Cancel Pressed'),
            },
            {
                text: t('ok'),
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
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.leftContainerColumn}>
                <Text style={styles.listText}>{description}</Text>
                <Text style={styles.listText}>{convertUTCDateToLocal(datetime)}</Text>
                {(categoryName) ? <Text style={[styles.categoryNameText, getBackgroundColour()]}>{categoryName}</Text> : <Text style={[styles.categoryNameText, styles.unassigned]}>{t('unassigned')}</Text>}
            </View>
            <View style={styles.rightContainerColumn}>
                <Text style={styles.rightRowText}>{getValueWithCurrency()}</Text>
                <View style={styles.deleteIcon}>
                    <IconButton color="black" onPress={deleteSelectedEntry} icon='trash-outline' size={30} /> 
                </View>
            </View>
        </View> 
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    leftContainerColumn: {
        width: '60%',
    },
    rightContainerColumn: {
        width: '40%'
    },
    rightRow: {
        width: '100%',
        flexDirection: 'row'
    },
    rightRowText: {
        fontSize: 18,
        color: 'black',
        fontWeight: "bold",
        textAlign: 'right',
        marginRight: 10,
        marginTop: 5
    },
    listText: {
        fontSize: 18,
        color: 'black',
        fontWeight: "bold",
        textAlign: 'left',
        marginLeft: 10,
        marginTop: 5
    },
    categoryNameText: {
        fontSize: 18,
        color: 'white',
        fontWeight: "bold",
        textAlign: 'left',
        marginLeft: 10,
        marginRight: 30,
        marginTop: 5,
        marginBottom: 5,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 5
    },
    unassigned: {
        backgroundColor: 'darkgray',
    },
    deleteIcon: {
        alignItems: 'flex-end',
        marginTop: 30,
        marginRight: 10
    }
}); 