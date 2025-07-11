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
};

export const readDB = async (db) => {
  const results = await db.getAllAsync("SELECT item from shopping");
  return results.map((elem) => elem.item);
};

export const clearDB = async (db) => {
  await db.execAsync(`DELETE FROM shopping`);
};

export const insertDB = async (db, elem) => {
  await db.runAsync("INSERT INTO shopping (item) VALUES (?)", `${elem}`);
};
