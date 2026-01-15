import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet} from "react-native";
import HistoryList from "../components/HistoryList";

/**
 * Show the history screen.
 */
export default function HistoryScreen() {

    /**
     * Display the screen to the user.
     */
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#A2574F', }}>
            <HistoryList/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    text: {
        color: 'white',
        marginLeft: 10,
        fontSize: 30,
        fontWeight: "bold"
    },
});