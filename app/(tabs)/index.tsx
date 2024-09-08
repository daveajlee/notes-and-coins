import { Image, StyleSheet, Platform,} from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#843D48', dark: '#CD978E' }}
      headerImage={
        <Image
          source={require('@/assets/images/cover.png')}
          style={styles.logo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Your Current Balance</ThemedText>
      </ThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">150€</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle" style={styles.fiveColour}>5</ThemedText>
        <ThemedText type="subtitle" style={styles.amount}>0</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle" style={styles.tenColour}>10</ThemedText>
        <ThemedText type="subtitle" style={styles.amount}>0</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle" style={styles.twentyColour}>20</ThemedText>
        <ThemedText type="subtitle" style={styles.amount}>0</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle" style={styles.fiftyColour}>50</ThemedText>
        <ThemedText type="subtitle" style={styles.amount}>0</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: "center",
    marginBottom: 24
  },
  stepContainer: {
    gap: 24,
    marginBottom: 24,
    flexDirection: 'row'
  },
  logo: {
    height: "100%",
    width: "100%",
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  fiveColour: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 28,
    marginTop: 10,
    width: 100,
    backgroundColor: 'gray',
    color: 'white'
  },
  tenColour: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 28,
    marginTop: 10,
    width: 100,
    backgroundColor: 'red',
    color: 'white'
  },
  twentyColour: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 28,
    marginTop: 10,
    width: 100,
    backgroundColor: 'blue',
    color: 'white'
  },
  fiftyColour: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 28,
    marginTop: 10,
    width: 100,
    backgroundColor: 'orange',
    color: 'white'
  },
  amount: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 28,
    marginTop: 10,
    width: 100,
    color: 'black'
  },
});
