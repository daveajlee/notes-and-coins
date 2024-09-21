import { Image, StyleSheet, Platform,} from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TouchableOpacity } from 'react-native';
import { Text } from 'react-native';

export default function HomeScreen() {

  function getBalance() {
    return (getNoteAmount(5) * 5) + (getNoteAmount(10) * 10) + (getNoteAmount(20) * 20) + (getNoteAmount(50) * 50);
  }

  function getNoteAmount(noteValue: number) {
    return 0;
  }

  function onIncreaseNote(noteValue: number) {
    console.log('Increase Note amount ' + noteValue);
  }

  function onDecreaseNote(noteValue: number) {
    console.log('Decrease Note amount ' + noteValue);
  }

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
        <ThemedText type="title">{getBalance()}€</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle" style={styles.fiveColour}>5</ThemedText>
        <ThemedText type="subtitle" style={styles.amount}>{getNoteAmount(5)}</ThemedText>
        <TouchableOpacity style={styles.fiveButton} onPress={() => onIncreaseNote(5)}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fiveButton} onPress={() => onDecreaseNote(5)}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle" style={styles.tenColour}>10</ThemedText>
        <ThemedText type="subtitle" style={styles.amount}>{getNoteAmount(10)}</ThemedText>
        <TouchableOpacity style={styles.tenButton} onPress={() => onIncreaseNote(10)}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tenButton} onPress={() => onDecreaseNote(10)}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle" style={styles.twentyColour}>20</ThemedText>
        <ThemedText type="subtitle" style={styles.amount}>{getNoteAmount(20)}</ThemedText>
        <TouchableOpacity style={styles.twentyButton} onPress={() => onIncreaseNote(20)}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.twentyButton} onPress={() => onDecreaseNote(20)}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle" style={styles.fiftyColour}>50</ThemedText>
        <ThemedText type="subtitle" style={styles.amount}>{getNoteAmount(50)}</ThemedText>
        <TouchableOpacity style={styles.fiftyButton} onPress={() => onIncreaseNote(50)}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fiftyButton} onPress={() => onDecreaseNote(50)}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
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
  fiveButton: {
    alignItems: "center",
    backgroundColor: "gray",
    width: '10%',
    padding: 0,
    marginTop: 10,
    height: 30
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
  tenButton: {
    alignItems: "center",
    backgroundColor: "red",
    width: '10%',
    padding: 0,
    marginTop: 10,
    height: 30
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
  twentyButton: {
    alignItems: "center",
    backgroundColor: "blue",
    width: '10%',
    padding: 0,
    marginTop: 10,
    height: 30
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
  fiftyButton: {
    alignItems: "center",
    backgroundColor: "orange",
    width: '10%',
    padding: 0,
    marginTop: 10,
    height: 30
  },
  amount: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 28,
    marginTop: 10,
    width: 100,
    color: 'black'
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
