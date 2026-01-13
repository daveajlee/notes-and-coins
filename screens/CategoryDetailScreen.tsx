import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";

type CategoryDetailScreenProps = {
  route: any;
}

export default function CategoryDetailScreen({route}: CategoryDetailScreenProps) {

    const [categoryName, setCategoryName] = useState('');
    const [categoryColour, setCategoryColour] = useState('');

    useEffect(() => {
        async function prepare() {
            try {
                setCategoryName(route.params.category.name);
                setCategoryColour(route.params.category.colour);
            } catch (err) {
                console.log(err);
            }
        }
            
        prepare();
    }, [route]);


    return (
        <View style={styles.centeredView}>
            <View style={styles.categoryNameContainer}>
                <Text style={[styles.bodyText]}>Name: {categoryName}</Text>
                <Text style={[styles.bodyText]}>Colour: {categoryColour}</Text>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
    },
    categoryNameContainer: {
        flexDirection: 'column',
        width: '100%',
        marginTop: 20
    },
    bodyText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingBottom: 16,
        color: 'white',
    },
});