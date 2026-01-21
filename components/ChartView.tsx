import { StyleSheet } from "react-native";
import { Text, View } from "react-native";

/**
 * This component displays a chart.
 */
export default function ChartView() {

        return (
            <View style={styles.container}>
                <Text style={styles.title}>Coming Soon...</Text>
            </View>
        );

}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    container: {
        marginTop: 10,
        marginBottom: 10
    }
});