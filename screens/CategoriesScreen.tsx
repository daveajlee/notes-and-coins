import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { fetchCategories } from "../utilities/sqlite";
import CategoryList from "../components/CategoryList";

/**
 * Show the categories screen.
 */
export default function CategoriesScreen() {

    useEffect(() => {
        async function prepare() {
          try {
            let categories = await fetchCategories();
            console.log(categories);
          } catch (err) {
            console.log(err);
          }
        }
    
        prepare();
    }, []);

    /**
     * Display the screen to the user.
     */
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#A2574F', }}>
            <CategoryList/>
        </SafeAreaView>
    );
}