import { useEffect, useState } from "react";
import { Category } from "../models/Category";
import { fetchCategories } from "../utilities/sqlite";
import { StyleSheet, Text, View } from "react-native";
import ChartView from "./ChartView";

/**
 * This component displays a list of categories from the database.
 */
export default function CategoryChartList() {

    const [loadedCategories, setLoadedCategories] = useState<Category[]>([]);

    /**
     * Load the categories from the database as soon as the screen is loaded.
     */
    useEffect(() => {
        async function loadCategories() {
            const categories = await fetchCategories();
            setLoadedCategories(categories);
        }

        loadCategories();
    }, [loadedCategories]);

    if ( !loadedCategories || loadedCategories.length === 0 ) {
        return <View style={styles.fallbackContainer}>
            <Text style={styles.fallbackTitle}>No categories added yet! {"\n"}{"\n"} Click on the plus button at the top right to add a category!</Text>
        </View>
    }
    return (
        <View style={styles.container}>
            <Text style={styles.fallbackTitle}>Income Chart</Text>
            <ChartView/>
            <Text style={styles.fallbackTitle}>Expenses Chart</Text>
            <ChartView/>
        </View>);
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column'
    },
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
});