import { SafeAreaView } from "react-native-safe-area-context";
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