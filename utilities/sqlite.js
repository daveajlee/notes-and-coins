import * as SQLite from 'expo-sqlite';

/**
 * Define the file where the database will be stored by SQLite.
 */
let database;

/**
 * Initialise the database by creating all of the required tables
 * and returning whether or not it was successful.
 */
export async function initializeDatabase() {

    database = await SQLite.openDatabaseAsync('notes-and-coins.db');

    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS balances (
                id INTEGER PRIMARY KEY NOT NULL,
                value INTEGER NOT NULL,
                amount INTEGER NOT NULL
            )`, []);

}

/**
 * Insert a value and amount to the database.
 * @param {number} value the value of the note to be saved.
 * @param {number} amount the amount of the note that should be saved.
 * @returns a promise with either a success result or an error message.
 */
export async function insertValueAmount(value, amount) {
    await database.runAsync(`INSERT INTO balances (value, amount) VALUES (?, ?)`, [value, amount]);
}

/**
 * Update the amount for a value in the database.
 * @param {number} value the value of the note to be saved.
 * @param {number} amount the amount of the note that should be saved.
 * @returns a promise with either a success result or an error message.
 */
export async function updateValueAmount(value, amount) {
    await database.runAsync(`UPDATE balances SET amount = ? WHERE value = ?`, [amount, value]);
}

/**
 * Retrieve the amount of the specified note value.
 * @param value the note value to retrieve.
 * @returns a promise with the amount or an error message if something bad happens
 */
export async function fetchAmount(value) {
    try {
        var result = await database.getFirstAsync('SELECT * FROM balances WHERE value = ' + value);
        if ( result ) {
            return result.amount;
        }
        return 0;
    } catch ( error ) {
        insertValueAmount(value, 0);
        console.error(error);
        return 0;
    }
    
}

/**
 * Delete an amount based on the supplied note value.
 * @param value the note value to retrieve.
 */
export async function deleteAmount(value) {
    await database.execAsync('DELETE FROM balances WHERE value = ?', [value]);
}