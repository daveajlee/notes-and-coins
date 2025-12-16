import { open, QueryResult } from '@op-engineering/op-sqlite';

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
  // Create history table.
  await database.execute(`CREATE TABLE IF NOT EXISTS history (
                id INTEGER PRIMARY KEY NOT NULL,
                sum INTEGER NOT NULL,
                description TEXT NOT NULL,
                datetime DATETIME NOT NULL
            )`);
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
