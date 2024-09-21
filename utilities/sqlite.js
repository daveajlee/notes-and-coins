import * as SQLite from 'expo-sqlite';

/**
 * Define the file where the database will be stored by SQLite.
 */
let database;

/**
 * Initialise the database by creating all of the required tables
 * and returning whether or not it was successful.
 * @returns a promise with either a success result or an error message.
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
    await database.execAsync(`INSERT INTO balances (value, amount) VALUES (?, ?)`,
            [value, amount]);
}

/**
 * Retrieve the amount of the specified note value.
 * @param value the note value to retrieve.
 * @returns a promise with the amount or an error message if something bad happens
 */
export async function fetchAmount(value) {
    await database.execAsync('SELECT * FROM balances where value = ?', [value]);
}

/**
 * Delete an amount based on the supplied note value.
 * @param value the note value to retrieve.
 * @returns a promise with either a success result or error message
 */
export async function deleteAmount(value) {
    await database.execAsync('DELETE FROM balances WHERE value = ?', [value]);
}