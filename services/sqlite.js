import * as SQLite from "expo-sqlite";

let dbInstance = null;

export const getDB = async () => {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync("listDB");
  }
  return dbInstance;
};

export const setDB = async (db) => {
  await db.execAsync(`PRAGMA journal_mode = WAL;`);
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS shopping (id INTEGER PRIMARY KEY NOT NULL, item TEXT NOT NULL);`
  );
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS food_items (
        code TEXT PRIMARY KEY NOT NULL, 
        name TEXT NOT NULL,
        image_url TEXT, 
        energy_kcal REAL,
        protein REAL,
        carbohydrates REAL,
        fat_total REAL,
        fat_saturated REAL,
        fat_unsaturated REAL
    );`
  );
};

export const readShoppingDB = async (db) => {
  const results = await db.getAllAsync("SELECT item FROM shopping");
  return results.map((elem) => elem.item);
};

export const clearShoppingDB = async (db) => {
  await db.execAsync(`DELETE FROM shopping`);
};

export const insertShoppingDB = async (db, elem) => {
  await db.runAsync("INSERT INTO shopping (item) VALUES (?)", `${elem}`);
};

export const readFoodItemDB = async (db, lim) => {
  const results = await db.getAllAsync(
    `SELECT name, image_url, energy_kcal, protein, carbohydrates, fat_total, fat_saturated, fat_unsaturated FROM food_items LIMIT ${lim}`
  );
  return results;
};
