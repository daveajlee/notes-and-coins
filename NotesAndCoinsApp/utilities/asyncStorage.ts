import { createAsyncStorage } from "@react-native-async-storage/async-storage";
import { getCountry } from "react-native-localize";

const storage = createAsyncStorage("notesAndCoinsSettings");

/**
 * Retrieve the language from the database.
 * @returns a promise with the language or current language on the device if no value is found.
 */
export async function fetchLanguage(): Promise<string> {
    const language = await storage.getItem("language");
    console.log('Language is: ' + language);
    if ( language ) {
        return language;
    } else {
        return getCountry();
    }
}

/**
 * Retrieve the minimum balance from the database.
 * @returns a promise with the minimum balance or "0,00" if no value is found.
 */
export async function fetchMinimumBalance(): Promise<string> {
    const minimumBalance = await storage.getItem("minimumBalance");
    console.log('Minimum Balance is: ' + minimumBalance);
    if ( minimumBalance ) {
        return minimumBalance;
    } else {
        return "0.00";
    }
}

/**
 * Save the settings to the database by deleting any existing entries and inserting the minimum balance and language.
 */
export async function saveSettingsToDatabase(minimumBalance: string, language: string): Promise<void> {
    console.log('Saving sttings to databse');
    await storage.setItem("minimumBalance", minimumBalance);
    await storage.setItem("language", language);
    const language2 = await storage.getItem("language");
    console.log('Language2 is: ' + language2);
}