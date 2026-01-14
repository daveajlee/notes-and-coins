import { FlatList, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { fetchCategories } from "../utilities/sqlite";
import { Category } from "../models/Category";
import { useNavigation } from "@react-navigation/native";

type NavigationStackParams = {
  navigate: Function;
}

/**
 * This component displays a list of categories from the database.
 */
function CategoryList() {

    const [loadedCategories, setLoadedCategories] = useState<Category[]>([]);

    // Navigation hook
    const navigation = useNavigation<NavigationStackParams>();

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

    /**
     * Load the category that the user clicked on.
     * @param {Category} item 
     */
    async function onLoadCategory(item: Category) {
        navigation.navigate('CategoryDetailScreen', { category: item });
    }

    function getBackgroundColour(item: Category) {
        return { backgroundColor: item.colour };
    }

    if ( !loadedCategories || loadedCategories.length === 0 ) {
        return <View style={styles.fallbackContainer}>
            <Text style={styles.fallbackTitle}>No categories added yet! {"\n"}{"\n"} Click on the plus button at the top right to add a category!</Text>
        </View>
    }
    return <FlatList style={styles.list} data={loadedCategories} keyExtractor={(item: Category) => item.name} renderItem={({item}) => <TouchableOpacity style={[styles.button, getBackgroundColour(item)]} onPress={onLoadCategory.bind(null, item)}>
        <Text style={styles.buttonText}>{item.name}</Text>
    </TouchableOpacity>}/>

}

export default CategoryList;

const styles = StyleSheet.create({
    list: {
        marginLeft: '10%',
        width: '100%',
        marginBottom: '10%',
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
    button: {
        alignItems: 'center',
        width: '80%',
        padding: 20,
        marginBottom: 20,
        marginTop: 20
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    }
})