import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import IconButton from "../components/IconButton";
import { deleteCategory } from "../utilities/sqlite";

type CategoryDetailScreenProps = {
  route: any;
}

type NavigationStackProps = {
  navigate: Function;
  setOptions: Function;
}

export default function CategoryDetailScreen({route}: CategoryDetailScreenProps) {

    const [categoryName, setCategoryName] = useState('');
    const [categoryColour, setCategoryColour] = useState('');

    // Navigation hook
    const navigation = useNavigation<NavigationStackProps>();

    useEffect(() => {
        async function prepare() {
            try {
                setCategoryName(route.params.category.name);
                setCategoryColour(route.params.category.colour);
                navigation.setOptions({ title: route.params.category.name, headerRight: () => <IconButton onPress={() => { deleteCategory(route.params.category.name); navigation.navigate('Home'); }} iconName='trash-outline' color="black" />  });
            } catch (err) {
                console.log(err);
            }
        }
            
        prepare();
    }, [route, navigation]);


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