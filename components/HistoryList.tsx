import { useState, useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { fetchHistory } from "../utilities/sqlite";
import { HistoryEntry } from "../models/HistoryEntry";

/**
 * This component displays a list of history entries from the database.
 */
export default function HistoryList() {

    const [loadedHistoryEntries, setLoadedHistoryEntries] = useState<HistoryEntry[]>([]);

    /**
     * Load the history entries from the database as soon as the screen is loaded.
     */
    useEffect(() => {
        async function loadHistoryEntries() {
            const historyEntries= await fetchHistory();
            setLoadedHistoryEntries(historyEntries);
        }
    
        loadHistoryEntries();
    }, []);

    if ( !loadedHistoryEntries || loadedHistoryEntries.length === 0 ) {
        return <View style={styles.fallbackContainer}>
            <Text style={styles.fallbackTitle}>Your history is empty! {"\n"}{"\n"} Click on the plus button at the top right to create an entry!</Text>
            </View>
    }
        
    return <FlatList style={styles.list} data={loadedHistoryEntries} keyExtractor={(item: HistoryEntry) => item.datetime} renderItem={({item}) => <Text style={styles.listText}>{item.sum}</Text>}/>

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
        marginLeft: '10%',
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