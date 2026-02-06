import { Dimensions, StyleSheet, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Category } from "../models/Category";
import { useEffect, useState } from "react";
import { fetchHistoryForCategory } from "../utilities/sqlite";
import { getCurrencies } from "react-native-localize";
import { formatCurrency } from "react-native-format-currency";

type ChartViewProps = {
    categories: Category[];
    type: string;
}

/**
 * This component displays a chart.
 */
export default function ChartView({categories, type}: ChartViewProps) {

    const [chartData, setChartData] = useState<any>(null);
    const [screenWidth, setScreenWidth] = useState<any>();
    const [chartConfig, setChartConfig] = useState<any>(null);

    const UNASSIGNED = "Unassigned";

    const [withSymbol, withoutSymbol, symbol] = formatCurrency({
        amount: 0.00,
        code: getCurrencies()[0],
    });


    function convertColourForChart(colour: string) {
        switch ( colour ) {
            case 'green':
                return (opacity = 1) => `rgba(0, 128, 0, ${opacity})`;
            case 'blue':
                return (opacity = 1) => `rgba(0, 0, 255, ${opacity})`;
            case 'yellow':
                return (opacity = 1) => `rgba(255, 255, 0, ${opacity})`;
            case 'darkgray':
                return (opacity = 1) => `rgba(169, 169, 169, ${opacity})`;
            case 'red':
                return (opacity = 1) => `rgba(255, 0, 0, ${opacity})`;
            case 'purple':
                return (opacity = 1) => `rgba(160, 32, 240, ${opacity})`;
            case 'orange':
                return (opacity = 1) => `rgba(255, 165, 0, ${opacity})`;
            case 'pink':
                return (opacity = 1) => `rgba(255, 192, 203, ${opacity})`;
            case 'brown':
                return (opacity = 1) => `rgba(150, 75, 0, ${opacity})`;
            case 'gray':
                return (opacity = 1) => `rgba(211, 211, 211, ${opacity})`;
            default:
                return (opacity = 1) => `rgba(0, 0, 0, ${opacity})`;
        }
    }

    /**
     * Load the data from the database as soon as the screen is loaded.
     */
    useEffect(() => {
        async function loadChartData() {
                
            const categoryNames = [];
            const categoryAmounts = [];
            const categoryColours = [];

            for ( let i = 0; i < categories.length; i++ ) {
                let historyForCategory = await fetchHistoryForCategory(categories[i].name);
                let total = 0;
                for ( let j = 0; j < historyForCategory.length; j++ ) {
                    if ( historyForCategory[j].type === type ) {
                        total += parseFloat(historyForCategory[j].sum);
                    }
                }
                if ( total !== 0 ) {
                    categoryNames.push(categories[i].name);
                    categoryColours.push(convertColourForChart(categories[i].colour));
                    categoryAmounts.push(total);
                } 
            }

            let unassignedEntries = await fetchHistoryForCategory(UNASSIGNED);
            if ( unassignedEntries && unassignedEntries.length > 0 ) {
                
                let total = 0;
                for ( let j = 0; j < unassignedEntries.length; j++ ) {
                    if ( unassignedEntries[j].type === type ) {
                        total += parseFloat(unassignedEntries[j].sum);
                    }
                }
                if ( total !== 0 ) {
                    categoryNames.push(UNASSIGNED);
                    categoryAmounts.push(total);
                    categoryColours.push(convertColourForChart('darkgray'));
                }
            }

            const myChartData = {
                labels: categoryNames,
                datasets: [
                    {
                        data: categoryAmounts,
                        colors: categoryColours
                    }
                ]
            };
            setChartData(myChartData);

            setScreenWidth(Dimensions.get("window").width);

            const myChartConfig = {
                backgroundColor: "#f2d6d3ff",
                backgroundGradientFrom: "#f2d6d3ff",
                backgroundGradientTo: "#f2d6d3ff",
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                    borderRadius: 16
                },
                propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#ffa726"
                }
            };
            setChartConfig(myChartConfig);
        }
    
        loadChartData();
    }, [categories, type]);


        return (
            <View style={styles.container}>
                { chartData && chartConfig && screenWidth && 
                    <BarChart
                        data={chartData}
                        width={screenWidth}
                        height={220}
                        yAxisLabel={symbol}
                        chartConfig={chartConfig}
                        verticalLabelRotation={0}
                        withCustomBarColorFromData={true}
                        flatColor={true}
                        fromZero={true}
                    />
                }
            </View>
        );

}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    container: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10
    }
});