/**
 * This component displays a single history entry.
 */
import { StyleSheet, Text, View } from "react-native";

type DisplayHistoryEntryProps = {
    sum: string;
    datetime: string;
    categoryName: string;
    categoryColour: string;
    description: string;
}

export function DisplayHistoryEntry({sum, datetime, categoryName, categoryColour, description}: DisplayHistoryEntryProps) {

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
                <Text style={styles.listText}>€{sum}</Text>
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
        textAlign: 'right'
    },
    unassigned: {
        backgroundColor: 'darkgray',
    }
}); 