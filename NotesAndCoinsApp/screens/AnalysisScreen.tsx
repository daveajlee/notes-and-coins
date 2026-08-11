import { SafeAreaView } from "react-native-safe-area-context";
import CategoryChartList from "../components/CategoryChartList";

/**
 * Show the analysis screen.
 */
export default function AnalysisScreen() {

    /**
     * Display the screen to the user.
     */
    return (
        <SafeAreaView style={{ flex: 1, }}>
            <CategoryChartList/>
        </SafeAreaView>
    );
}