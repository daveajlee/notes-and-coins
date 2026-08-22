import { useEffect, useState } from "react";
import { Category } from "../models/Category";
import { fetchCategories } from "../utilities/sqlite";
import { StyleSheet, Text, View } from "react-native";
import ChartView from "./ChartView";
import { useTranslation } from "react-i18next";
import './../assets/i18n/i18n';

/**
 * This component displays a list of categories from the database.
 */
export default function CategoryChartList() {

    const [loadedCategories, setLoadedCategories] = useState<any>();
    const {t, i18n} = useTranslation();

    /**
     * Load the categories from the database as soon as the screen is loaded.
     */
    useEffect(() => {
        async function loadCategories() {
            const categories = await fetchCategories();
            setLoadedCategories(categories);
        }

        loadCategories();
    }, []);

    if ( !loadedCategories || loadedCategories.length === 0 ) {
        return <View style={styles.fallbackContainer}>
            <Text style={styles.fallbackTitle}>{t('noCharts')}</Text>
        </View>
    }
    return (
        <View style={styles.container}>
            <Text style={styles.fallbackTitle}>{t('incomeChart')}</Text>
            <ChartView categories={loadedCategories} type="credit" />
            <Text style={styles.fallbackTitle}>{t('expenseChart')}</Text>
            <ChartView categories={loadedCategories} type="debit" />
        </View>);
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        marginTop: 10
    },
    fallbackContainer: {
        flex: 1,
        alignItems: 'center',
        marginBottom: 20,
        color: 'black'
    },
    fallbackTitle: {
        fontSize: 24,
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold'
    },
});