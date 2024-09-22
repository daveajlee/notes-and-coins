import { Image, StyleSheet} from 'react-native';
import { useEffect, useState } from 'react';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { updateValueAmount, fetchAmount } from '@/utilities/sqlite';

/**
 * Show the home screen with the various categories of notes and the quantities to increase and decrease the amount of notes.
 */
export default function HomeScreen() {

  const [balance, setBalance] = useState(0);
  const [fiveAmount, setFiveAmount] = useState(0);
  const [tenAmount, setTenAmount] = useState(0);
  const [twentyAmount, setTwentyAmount] = useState(0);
  const [fiftyAmount, setFiftyAmount] = useState(0);

  /**
   * Whenever we visit the screen, we want to retrieve the current balance.
   */
  useEffect(() => {

    async function prepare() {
      await getBalance();
    }

    prepare();
    
  }, []);

  /**
   * Get the balance by multiplying the various categories.
   */
  async function getBalance() {
    setBalance((await (getNoteAmount(5)) * 5) + ((await getNoteAmount(10)) * 10) + ((await getNoteAmount(20)) * 20) + ((await getNoteAmount(50)) * 50));
  }

  /**
   * Retrieve the amount of a particular note.
   * @param noteValue the value of the note to retrieve the amount for.
   * @returns the amount of the note currently saved in the database and update the UI.
   */
  async function getNoteAmount(noteValue: number) {
    if ( noteValue === 5 ) {
      setFiveAmount(await fetchAmount(noteValue));
    } else if ( noteValue === 10 ) {
      setTenAmount(await fetchAmount(noteValue));
    } else if ( noteValue === 20 ) {
      setTwentyAmount(await fetchAmount(noteValue));
    } else if ( noteValue === 50 ) {
      setFiftyAmount(await fetchAmount(noteValue));
    }
    return await(fetchAmount(noteValue));
  }

  /**
   * Incresse the amount of a particular note by 1.
   * @param noteValue the value of the note to increase the amount for.
   */
  async function onIncreaseNote(noteValue: number) {
    let currentValue:number = await fetchAmount(noteValue);
    if ( currentValue ) {
      await updateValueAmount(noteValue, currentValue + 1);
    } else {
      await updateValueAmount(noteValue, 1);
    }
    await getNoteAmount(noteValue);
    await getBalance();
  }

  /**
   * Decrease the amount of a particular note by 1.
   * @param noteValue the value of the note to decrease the amount for.
   */
  async function onDecreaseNote(noteValue: number) {
    let currentValue:number = await fetchAmount(noteValue);
    if ( currentValue ) {
      await updateValueAmount(noteValue, currentValue - 1);
    } else {
      await updateValueAmount(noteValue, 0);
    }
    await getNoteAmount(noteValue);
    await getBalance();
  }

  /**
   * Display the screen to the user.
   */
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
        <ThemedText type="title">{balance}€</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle" style={styles.fiveColour}>5</ThemedText>
        <ThemedText type="subtitle" style={styles.amount}>{fiveAmount}</ThemedText>
        <TouchableOpacity style={styles.fiveButton} onPress={() => onIncreaseNote(5)}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fiveButton} onPress={() => onDecreaseNote(5)}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle" style={styles.tenColour}>10</ThemedText>
        <ThemedText type="subtitle" style={styles.amount}>{tenAmount}</ThemedText>
        <TouchableOpacity style={styles.tenButton} onPress={() => onIncreaseNote(10)}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tenButton} onPress={() => onDecreaseNote(10)}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle" style={styles.twentyColour}>20</ThemedText>
        <ThemedText type="subtitle" style={styles.amount}>{twentyAmount}</ThemedText>
        <TouchableOpacity style={styles.twentyButton} onPress={() => onIncreaseNote(20)}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.twentyButton} onPress={() => onDecreaseNote(20)}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle" style={styles.fiftyColour}>50</ThemedText>
        <ThemedText type="subtitle" style={styles.amount}>{fiftyAmount}</ThemedText>
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
    marginBottom: 24,
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
