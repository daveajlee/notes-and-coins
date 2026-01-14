import { open, QueryResult } from '@op-engineering/op-sqlite';
import { Category } from '../models/Category';

/**
 * Define the file where the database will be stored by SQLite.
 */
export const database = open({
  name: 'notes-and-coins.db'
});

/**
 * Initialise the database by creating required tables
 * and returning whether it was successful.
 * @returns a promise with either a success result or an error message.
 */
export async function init(): Promise<void> {
  console.log('Initializing database...');
  // Create balance table.
  await database.execute(`CREATE TABLE IF NOT EXISTS balances (
                id INTEGER PRIMARY KEY NOT NULL,
                value INTEGER NOT NULL,
                amount INTEGER NOT NULL
            )`);
  // Create categories table.
  await database.execute(`CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                colour TEXT NOT NULL
  )`);
  // Create history table.
  await database.execute(`CREATE TABLE IF NOT EXISTS history (
                id INTEGER PRIMARY KEY NOT NULL,
                sum INTEGER NOT NULL,
                description TEXT NOT NULL,
                categoryName TEXT NOT NULL,
                datetime DATETIME NOT NULL
  )`);
  // Create settings table.
  await database.execute(`CREATE TABLE IF NOT EXISTS settings (
                id INTEGER PRIMARY KEY NOT NULL,
                minimum_balance INTEGER NOT NULL
  )`);
  console.log('Database initialized.');
}

/**
 * Insert a value and amount to the database.
 * @param {number} value the value of the note to be saved.
 * @param {number} amount the amount of the note that should be saved.
 * @returns a promise with either a success result or an error message.
 */
export async function insertValueAmount(value: number, amount: number): Promise<number> {
    let insertResult: QueryResult = await database.execute(`INSERT INTO balances (value, amount) VALUES (?, ?)`, [value, amount]);
    console.log('Insert id is: ' + insertResult.insertId);
    return insertResult.insertId ? insertResult.insertId : 0;
}

/**
 * Update the amount for a value in the database.
 * @param {number} value the value of the note to be saved.
 * @param {number} amount the amount of the note that should be saved.
 * @returns a promise with either a success result or an error message.
 */
export async function updateValueAmount(value: number, amount: number): Promise<void> {
  console.log(`Updating value amount: ${amount} + value ${value}` );
  await database.execute(`UPDATE balances SET amount = ? WHERE value = ?`, [amount, value]);
}

/**
 * Retrieve the amount of the specified note value.
 * @param value the note value to retrieve.
 * @returns a promise with the amount or an error message if something bad happens
 */
export async function fetchAmount(value: number): Promise<number> {
    try {
      let {rows} = await database.execute('SELECT * FROM balances WHERE value = ' + value);
      console.log('Fetch amount is ' + rows.length);
      if ( rows.length > 0 ) {
        return rows[rows.length-1].amount;
      }
      return 0;
    } catch ( error ) {
        await insertValueAmount(value, 0);
        console.error(error);
        return 0;
    }

}

/**
 * Delete an amount based on the supplied note value.
 * @param value the note value to retrieve.
 */
export async function deleteAmount(value: number): Promise<void> {
    await database.execute('DELETE FROM balances WHERE value = ?', [value]);
}

/**
 * Insert a category name and colour to the database.
 * @param {string} name the name of the category to be saved.
 * @param {string} colour the colour of the category that should be saved.
 * @returns a promise with either a success result or an error message.
 */
export async function insertCategory(name: string, colour: string): Promise<boolean> {
    // Check if the name already exists.
    let categories = await fetchCategories();
    for ( let i = 0; i < categories.length; i++ ) {
        if ( categories[i].name.toLowerCase() === name.toLowerCase() ) {
            return false;
        }
    }
    // Add it to the db.
    let insertResult: QueryResult = await database.execute(`INSERT INTO categories (name, colour) VALUES (?, ?)`, [name, colour]);
    return insertResult.insertId ? true : false;
}

/**
 * Retrieve all categories from the database.
 * @returns an array of categories.
 */
export async function fetchCategories(): Promise<Category[]> {
    let {rows} = await database.execute('SELECT * FROM categories');
    return rows;
}

/**
 * Delete a category based on the supplied name from the database.
 * Change any history entries with this category to Unassigned.
 */
export async function deleteCategory(name: string): Promise<void> {
    await database.execute('DELETE FROM categories WHERE name = ?', [name]);
    await database.execute('UPDATE history SET categoryName = ? WHERE categoryName = ?', ['Unassigned', name]);
}

/**
 * Insert the minimum balance to the database.
 * @param minimumBalance A string representing the minimum balance.
 * @returns a promise with either the inserted id or 0 if insert was not successful.
 */
export async function insertMinimumBalance(minimumBalance: string): Promise<number> {
    let insertResult: QueryResult = await database.execute(`INSERT INTO settings (minimum_balance) VALUES (?)`, [minimumBalance]);
    console.log('Insert id is: ' + insertResult.insertId);
    return insertResult.insertId ? insertResult.insertId : 0;
}

/**
 * Retrieve the minimum balance from the database.
 * @returns a promise with the minimum balance or "0,00" if no value is found.
 */
export async function fetchMinimumBalance(): Promise<string> {
    let {rows} = await database.execute('SELECT * FROM settings');
    console.log('Fetch minimum balance length is ' + rows.length);
    if ( rows.length > 0 ) {
        console.log('Minimum balance is ' + rows[rows.length-1].minimum_balance);
        return rows[rows.length-1].minimum_balance;
    }
    return "0,00";
}