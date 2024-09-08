import * as SQLite from 'expo-sqlite';

/**
 * Define the file where the database will be stored by SQLite.
 */
const database = SQLite.openDatabase('notes-and-coins.db');

/**
 * Initialise the database by creating all of the required tables
 * and returning whether or not it was successful.
 * @returns a promise with either a success result or an error message.
 */
export function init() {

    // Create table with balances i.e. value and amount as key/value pair.
    var promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS balances (
                id INTEGER PRIMARY KEY NOT NULL,
                value INTEGER NOT NULL,
                amount INTEGER NOT NULL,
            )`,
            [],
            () => {
                resolve();
            },
            (_, error) => {
                reject(error);
            }
            );
        });
    });

    return promise;

}

/**
 * Insert a value and amount to the database.
 * @param {number} value the value of the note to be saved.
 * @param {number} amount the amount of the note that should be saved.
 * @returns a promise with either a success result or an error message.
 */
export function insertValueAmount(value, amount) {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(`INSERT INTO balances (value, amount) VALUES (?, ?)`,
            [value, amount],
            (_, result) => {

                resolve(result);
            },
            (_, error) => {
                reject(error);
            })
        })
    });

    return promise;
}

/**
 * Retrieve the amount of the specified note value.
 * @param value the note value to retrieve.
 * @returns a promise with the amount or an error message if something bad happens
 */
export function fetchAmount(value) {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql('SELECT * FROM balances where value = ?', [value],
            (_, result) => {
                const balances = [];
                for (const balance of result.rows._array) {
                    balances.push(balance.amount);
                }
                resolve(games);
            }, (_, error) => { reject(error); });
        })
    })

    return promise;
}

/**
 * Delete an amount based on the supplied note value.
 * @param value the note value to retrieve.
 * @returns a promise with either a success result or error message
 */
export function deleteAmount(value) {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql('DELETE FROM balances WHERE value = ?', [value],
            (_, result) => {
                console.log(result);
                resolve(result);
            },
            (_, error) => {
                reject(error);
            })
        })
    })
    
    return promise;
}