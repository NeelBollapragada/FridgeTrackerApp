import * as SQLite from "expo-sqlite";

let dbInstance = null;

export const getDB = async () => {
  try {
    if (!dbInstance) {
      dbInstance = await SQLite.openDatabaseAsync("listDB");
    }
    return dbInstance;
  } catch (error) {
    console.error("1", error);
  }
};

export const setDB = async (db) => {
  try {
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
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS fridge_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    image_url TEXT,
    energy_kcal REAL,
    protein REAL,
    carbohydrates REAL,
    fat_total REAL,
    fat_saturated REAL,
    fat_unsaturated REAL,
    expiry_date TEXT,
    quantity INTEGER,
    unit TEXT
    )`
    );
  } catch (error) {
    console.error("2", error);
  }
};

export const readShoppingDB = async (db) => {
  try {
    const results = await db.getAllAsync("SELECT item FROM shopping");
    return results.map((elem) => elem.item);
  } catch (error) {
    console.error("3", error);
  }
};

export const clearShoppingDB = async (db) => {
  try {
    await db.runAsync(`DELETE FROM shopping`);
  } catch (error) {
    console.error("4", error);
  }
};

export const insertShoppingDB = async (db, elem) => {
  try {
    await db.runAsync("INSERT INTO shopping (item) VALUES (?)", `${elem}`);
  } catch (error) {
    console.error("5", error);
  }
};

export const readFoodItemDB = async (db, lim) => {
  try {
    const results = await db.getAllAsync(
      `SELECT code, name, image_url, energy_kcal, protein, carbohydrates, fat_total, fat_saturated, fat_unsaturated FROM food_items LIMIT ${lim}`
    );
    return results;
  } catch (error) {
    console.error("6", error);
  }
};

export const insertFridgeItem = async (db, foodItem) => {
  try {
    const result = await db.runAsync(
      "INSERT INTO fridge_items (code, name, image_url, energy_kcal, protein, carbohydrates, fat_total, fat_saturated, fat_unsaturated, expiry_date, quantity, unit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        foodItem.code,
        foodItem.name,
        foodItem.image_url,
        foodItem.energy_kcal,
        foodItem.protein,
        foodItem.carbohydrates,
        foodItem.fat_total,
        foodItem.fat_saturated,
        foodItem.fat_unsaturated,
        "",
        1,
        "",
      ]
    );
    const id = result.lastInsertRowId;

    const lastRow = await db.getAllAsync(
      `SELECT * FROM fridge_items WHERE id = ?`,
      [id]
    );

    return lastRow;
  } catch (error) {
    console.error("7", error);
  }
};

export const readFridgeDB = async (db) => {
  try {
    const results = await db.getAllAsync(
      `SELECT id, code, name, image_url, energy_kcal, protein, carbohydrates, fat_total, fat_saturated, fat_unsaturated, expiry_date, quantity, unit FROM fridge_items`
    );

    return results;
  } catch (error) {
    console.error("8", error);
  }
};

export const deleteFridgeItemDB = async (db, id) => {
  try {
    await db.runAsync("DELETE FROM fridge_items WHERE id = $id", { $id: id });
  } catch (error) {
    console.error("9", error);
  }
};

export const updateFridgeQuantityDB = async (db, id, newQuantity) => {
  try {
    await db.runAsync("UPDATE fridge_items SET quantity = ? WHERE id = ?", [
      newQuantity,
      id,
    ]);
  } catch (error) {
    console.error("10", error);
  }
};

export const updateFridgeUnitDB = async (db, id, newUnit) => {
  try {
    await db.runAsync("UPDATE fridge_items SET unit = ? WHERE id = ?", [
      newUnit,
      id,
    ]);
  } catch (error) {
    console.error("11", error);
  }
};

export const updateFridgeExpiryDB = async (db, id, newDate) => {
  try {
    await db.runAsync("UPDATE fridge_items SET expiry_date = ? WHERE id = ?", [
      newDate,
      id,
    ]);
  } catch (error) {
    console.error("12", error);
  }
};
