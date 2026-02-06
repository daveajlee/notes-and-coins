import { open, QueryResult } from '@op-engineering/op-sqlite';
import { Category } from '../models/Category';
import { HistoryEntryResult } from '../models/HistoryEntryResult';

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
                type TEXT NOT NULL,
                categoryName TEXT NOT NULL,
                datetime DATETIME NOT NULL
  )`);
  // Create settings table.
  await database.execute(`CREATE TABLE IF NOT EXISTS settings (
                id INTEGER PRIMARY KEY NOT NULL,
                minimum_balance INTEGER NOT NULL
  )`);
  // Ensure backward compatibility by adding the type column to history table.
  await database.execute(`ALTER TABLE history ADD COLUMN type TEXT NOT NULL DEFAULT 'debit'`);
  // Print that database has been created.
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
    return insertResult.insertId ? insertResult.insertId : 0;
}

/**
 * Update the amount for a value in the database.
 * @param {number} value the value of the note to be saved.
 * @param {number} amount the amount of the note that should be saved.
 * @returns a promise with either a success result or an error message.
 */
export async function updateValueAmount(value: number, amount: number): Promise<void> {
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
    return insertResult.insertId ? insertResult.insertId : 0;
}

/**
 * Retrieve the minimum balance from the database.
 * @returns a promise with the minimum balance or "0,00" if no value is found.
 */
export async function fetchMinimumBalance(): Promise<string> {
    let {rows} = await database.execute('SELECT * FROM settings');
    if ( rows.length > 0 ) {
        return rows[rows.length-1].minimum_balance;
    }
    return "0,00";
}

/**
 * Insert a history entry to the database.
 * @param sum the sum of the history entry.
 * @param description the description of the history entry.
 * @param categoryName the category name of the history entry.
 * @param datetime the date and time of the history entry.
 * @param type the type of the history entry (debit or credit).
 * @returns a promise with either the inserted id or 0 if insert was not successful.  
 */
export async function insertHistoryEntry(sum: string, description: string, categoryName: string, datetime: string, type: string): Promise<boolean> {
    let insertResult: QueryResult = await database.execute(`INSERT INTO history (sum, description, categoryName, datetime, type) VALUES (?, ?, ?, ?, ?)`, [sum, description, categoryName, datetime, type]);
    return insertResult.insertId ? true : false;
} 

/**
 * Retrieve all history from the database.
 * @returns an array of categories.
 */
export async function fetchHistory(): Promise<HistoryEntryResult[]> {
    let {rows} = await database.execute('SELECT * FROM history order by datetime DESC');
    for ( let i = 0; i < rows.length; i++ ) {
        let categoryColour = await getCategoryColour(rows[i].categoryName);
        rows[i].categoryColour = categoryColour;
    }
    return rows;
}

/**
 * Retrieve history from the database with the specified category.
 * @param categoryName the category name to filter by.
 * @returns an array of categories.
 */
export async function fetchHistoryForCategory(categoryName: string): Promise<HistoryEntryResult[]> {
    let {rows} = await database.execute('SELECT * FROM history WHERE categoryName = ? order by datetime DESC', [categoryName]);
    return rows;
}

/**
 * Delete 
 * @param categoryName 
 * @returns 
 */
export async function deleteHistoryEntry(id: number): Promise<void> {
  await database.execute('DELETE FROM history WHERE id = ?', [id]);
}

export async function getCategoryColour(categoryName: string): Promise<string> {
    let {rows} = await database.execute('SELECT * FROM categories WHERE name = ?', [categoryName]);
    if ( rows.length > 0 ) {
        return rows[0].colour;
    }
    return 'darkgray'; // Default dark gray colour.
}