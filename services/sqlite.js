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
  await db.execAsync(`DELETE FROM shopping`);
  await db.runAsync("INSERT INTO shopping (item) VALUES (?)", "roast lamb");
  await db.runAsync("INSERT INTO shopping (item) VALUES (?)", "squash");
};

export const readDB = async (db) => {
  const results = await db.getAllAsync("SELECT * from shopping");
  return results;
};
