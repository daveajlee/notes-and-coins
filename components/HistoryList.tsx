import { useState, useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { fetchHistory } from "../utilities/sqlite";
import { HistoryEntryResult } from "../models/HistoryEntryResult";
import { DisplayHistoryEntry } from "./DisplayHistoryEntry";

/**
 * This component displays a list of history entries from the database.
 */
export default function HistoryList() {

    const [loadedHistoryEntries, setLoadedHistoryEntries] = useState<HistoryEntryResult[]>([]);

    /**
     * Load the history entries from the database as soon as the screen is loaded.
     */
    useEffect(() => {
        async function loadHistoryEntries() {
            const historyEntries = await fetchHistory();
            setLoadedHistoryEntries(historyEntries);
        }
    
        loadHistoryEntries();
    }, [loadedHistoryEntries]);

    if ( !loadedHistoryEntries || loadedHistoryEntries.length === 0 ) {
        return <View style={styles.fallbackContainer}>
            <Text style={styles.fallbackTitle}>Your history is empty! {"\n"}{"\n"} Click on the plus button at the top right to create an entry!</Text>
            </View>
    }

    return <FlatList style={styles.list} data={loadedHistoryEntries} keyExtractor={(item: HistoryEntryResult) => item.datetime} renderItem={({item}) => <DisplayHistoryEntry entries={loadedHistoryEntries} id={item.id} sum={item.sum} datetime={item.datetime} categoryName={item.categoryName} categoryColour={item.categoryColour} description={item.description} type={item.type}/>}/>;

}

const styles = StyleSheet.create({
    fallbackContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        color: 'white'
    },
    fallbackTitle: {
        fontSize: 24,
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    list: {
        marginLeft: '3%',
        width: '100%',
        marginBottom: '10%',
    },
    listText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    }
});