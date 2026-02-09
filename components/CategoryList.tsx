import { Alert, FlatList, View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { fetchCategories } from "../utilities/sqlite";
import { Category } from "../models/Category";
import IconButton from "./IconButton";
import { deleteCategory } from "../utilities/sqlite";

/**
 * This component displays a list of categories from the database.
 */
function CategoryList() {

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

    function getBackgroundColour(item: Category) {
        if ( item.colour === 'yellow' ) {
            return { backgroundColor: item.colour, color: 'black' };
        } else {
            return { backgroundColor: item.colour };
        }
        
    }

    if ( !loadedCategories || loadedCategories.length === 0 ) {
        return <View style={styles.fallbackContainer}>
            <Text style={styles.fallbackTitle}>No categories added yet! {"\n"}{"\n"} Click on the plus button at the top right to add a category!</Text>
        </View>
    }
    return <FlatList style={styles.list} data={loadedCategories} keyExtractor={(item: Category) => item.name} renderItem={({item}) =>
        <View style={styles.container}>
            <Text style={[styles.categoryLabel, getBackgroundColour(item)]}>{item.name}</Text>
            <View style={styles.deleteIcon}>
            <IconButton color="white" onPress={() => { 
                Alert.alert('Confirm deletion', 'Are you sure you want to delete ' + item.name + '?', [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                    },
                    {
                        text: 'OK', 
                        onPress: () => {
                            const categories = loadedCategories;
                            for ( let i = 0; i < categories.length; i++ ) {
                                if ( categories[i].name === item.name ) {
                                    categories.splice(i, 1);
                                }
                            }
                            setLoadedCategories(categories);
                            deleteCategory(item.name);
                        }
                    },
                ]); 
            ; }} iconName='trash-outline' /> 
            </View>
        </View> 
        }/>

}

export default CategoryList;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    deleteIcon: {
        marginTop: 30,
        paddingLeft: 30
    },
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
    categoryLabel: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        alignItems: 'center',
        width: '70%',
        padding: 20,
        marginBottom: 20,
        marginTop: 20
    }
})