import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { fetchCategories } from "../utilities/sqlite";
import CategoryList from "../components/CategoryList";
import { useNavigation } from "@react-navigation/native";
import IconButton from "../components/IconButton";
import { View } from "react-native";
import CategoryChartList from "../components/CategoryChartList";

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

    // Mode - either chart or list.
    const [mode, setMode] = useState('list');

    useEffect(() => {
        async function prepare() {
          try {
            await fetchCategories();
            mode === 'list' && navigation.setOptions({ headerLeft: () => <View style={{marginLeft: 10}}><IconButton onPress={() => { setMode('chart') }} iconName='bar-chart-outline' color="black" /></View> });
            mode === 'chart' && navigation.setOptions({ headerLeft: () => <View style={{marginLeft: 10}}><IconButton onPress={() => { setMode('list') }} iconName='list-outline' color="black" /></View> });
          } catch (err) {
            console.log(err);
          }
        }
    
        prepare();
    }, [mode, navigation]);

    /**
     * Display the screen to the user.
     */
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#A2574F', }}>
            { mode === 'list' && <CategoryList/> }
            { mode === 'chart' && <CategoryChartList/>}
        </SafeAreaView>
    );
}