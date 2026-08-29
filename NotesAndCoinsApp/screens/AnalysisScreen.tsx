import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { fetchAnalysis } from "../utilities/sqlite"
import { FlatList, StyleSheet, Text, View } from "react-native";
import IconButton from "../components/IconButton";
import { getCurrencies } from "react-native-localize";
import { CategoryAnalysis } from "../models/CategoryAnalysis";

/**
 * Show the analysis screen.
 */
export default function AnalysisScreen() {

    const [loadedCategories, setLoadedCategories] = useState<any>();
    const {t, i18n} = useTranslation();

    /**
     * Load the categories from the database as soon as the screen is loaded.
     */
    useEffect(() => {
        async function loadCategories() {
            const categories = await fetchAnalysis();
            setLoadedCategories(categories)
        }
    
        loadCategories();
    }, []);

    function formatSymbol(currencyCode: string) {
        if ( currencyCode === 'EUR' ) {
            return "€";
        }
    } 

    function countEnding(count: number) {
        if ( count === 1 ) {
            return t('entry');
        } else {
            return t('entries');
        }
    }

    function getBackgroundColour(item: CategoryAnalysis) {
        if ( item.colour === 'yellow' ) {
            return { backgroundColor: item.colour, color: 'black' };
        } else {
            return { backgroundColor: item.colour };
        }
    }
    
    if ( !loadedCategories || loadedCategories.length === 0 ) {
        return (<SafeAreaView style={{ flex: 1, }}>
                    <View style={styles.fallbackContainer}>
                    <Text style={styles.fallbackTitle}>{t('noAnalysis')}</Text>
                    </View>
                </SafeAreaView>);
    }
    return (<View style={styles.container}>
                <FlatList style={styles.list} data={loadedCategories} keyExtractor={(item: Category) => item.name} renderItem={({item}) =>
                    <View style={styles.analysisContainer}>
                        <View style={styles.containerColumn}>
                            <Text style={styles.categoryName}>{item.name}</Text>
                            <Text style={[styles.categoryColour, getBackgroundColour(item)]}/>
                        </View>
                        <View style={styles.containerColumn}>
                            <IconButton icon="trending-up" size={24} color="black"/>
                            <Text style={styles.amount}>{item.incomeTotal + formatSymbol(getCurrencies()[0])}</Text>
                        </View>
                        <View style={styles.containerColumn}>
                            <IconButton icon="trending-down" size={24} color="black"/>
                            <Text style={styles.amount}>{item.expenseTotal + formatSymbol(getCurrencies()[0])}</Text>
                        </View>
                        <View style={styles.containerColumn}>
                            <IconButton icon="apps-outline" size={24} color="black"/>
                            <Text style={styles.amount}>{item.count + " " + countEnding(item.count)}</Text>
                        </View>
                    </View>
                }/>
            </View>);
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        marginTop: 10
    },
    categoryColour: {
        fontSize: 18,
        textAlign: 'left',
        width: '10%',
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
    analysisContainer: {
        flexDirection: 'column',
        margin: 20,
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        paddingBottom: 10
    },
    list: {
        flexDirection: 'column',
        width: '90%',
        borderRadius: 25,
        backgroundColor: '#f2d6d3ff',
        paddingBottom: 10,
        marginLeft: '5%',
    },
    containerColumn: {
        flexDirection: 'row',
        width: '100%'
    },
    categoryName: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left',
        width: '90%',
        color: 'black'
    },
    amount: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left',
        marginLeft: 20,
        width: '100%',
        color: 'black'
    },
});