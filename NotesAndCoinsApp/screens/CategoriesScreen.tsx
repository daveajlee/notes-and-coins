import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import CategoryList from "../components/CategoryList";
import { useNavigation } from "@react-navigation/native";
import IconButton from "../components/IconButton";

type NavigationStackProps = {
  navigate: Function;
  setOptions: Function;
}

/**
 * Show the categories screen.
 */
export default function CategoriesScreen() {

    // Navigation hook
    const navigation = useNavigation<NavigationStackProps>();

    useEffect(() => {
        async function prepare() {
          try {
            navigation.setOptions({ headerRight: () => <IconButton onPress={() => navigation.navigate('AddCategoryScreen')} icon='add-outline' color="black" size={30} /> });
          } catch (err) {
            console.log(err);
          }
        }
    
        prepare();
    }, [navigation]);

    /**
     * Display the screen to the user.
     */
    return (
        <SafeAreaView style={{ flex: 1, }}>
            <CategoryList/>
        </SafeAreaView>
    );
}