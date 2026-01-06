import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text } from "react-native";

/**
 * Show the settings screen.
 */
export default function SettingsScreen() {

    /**
     * Display the screen to the user.
     */
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#A2574F', }}>
            <Text style={styles.text}>Coming Soon...</Text>
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