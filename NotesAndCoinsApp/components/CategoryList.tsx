import { Alert, FlatList, View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { fetchCategories, deleteCategory } from "../utilities/sqlite";
import { Category } from "../models/Category";
import IconButton from "./IconButton";
import { useTranslation } from "react-i18next";
import './../assets/i18n/i18n';

/**
 * This component displays a list of categories from the database.
 */
function CategoryList() {

    const [loadedCategories, setLoadedCategories] = useState<Category[]>([]);
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
    }, [loadedCategories]);

    function getBackgroundColour(item: Category) {
        if ( item.colour === 'yellow' ) {
            return { backgroundColor: item.colour, color: 'black' };
        } else {
            return { backgroundColor: item.colour };
        }
    }

    function deleteCategory(item: Category) {
        Alert.alert(t('confirmDeletion'), t('deleteCategory', { categoryName: item.name }), [
            {
                text: t('cancel'),
                onPress: () => console.log('Cancel Pressed'),
            },
            {
                text: t('ok'),
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
    }

    if ( !loadedCategories || loadedCategories.length === 0 ) {
        return <View style={styles.fallbackContainer}>
            <Text style={styles.fallbackTitle}>{t('noCategories')}</Text>
        </View>
    }
    return <FlatList style={styles.list} data={loadedCategories} keyExtractor={(item: Category) => item.name} renderItem={({item}) =>
        <View style={styles.container}>
            <View style={styles.leftContainerColumn}>
                <Text style={styles.categoryName}>{item.name}</Text>
                <View style={styles.colourContainer}>
                    <Text style={[styles.categoryColour, getBackgroundColour(item)]}/>
                </View>
            </View>
            <View style={styles.rightContainerColumn}>
                <IconButton icon="trash-outline" size={24} color="black" onPress={deleteCategory.bind(null, item)}/>
            </View>
        </View> 
        }/>

}

export default CategoryList;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        margin: 20,
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        paddingBottom: 10
    },
    deleteIcon: {
        marginTop: 30,
        paddingLeft: 30
    },
    list: {
        flexDirection: 'column',
        width: '90%',
        borderRadius: 25,
        backgroundColor: '#f2d6d3ff',
        paddingBottom: 10,
        marginLeft: '5%',
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
    categoryName: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left',
        width: '35%',
        color: 'black'
    },
    colourContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    categoryColour: {
        fontSize: 18,
        textAlign: 'left',
        width: '10%',
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
    },
    leftContainerColumn: {
        flexDirection: 'column',
        width: '90%'
    },
    rightContainerColumn: {
        marginTop: 15
    }
})