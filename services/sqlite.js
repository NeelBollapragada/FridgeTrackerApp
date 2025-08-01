import AsyncStorage from "@react-native-async-storage/async-storage";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";

const DB_NAME = "food_prebuilt.db";
let dbInstance = null;

export const getDB = async () => {
  try {
    if (dbInstance) return dbInstance;

    const alreadyCopied = await AsyncStorage.getItem("prebuilt_db_copied");
    const dbDir = `${FileSystem.documentDirectory}SQLite`;
    const dbFile = `${dbDir}/${DB_NAME}`;
    const dirInfo = await FileSystem.getInfoAsync(dbDir);

    if (alreadyCopied !== "true" || !dirInfo.exists) {
      const asset = Asset.fromModule(require("../assets/db/food_prebuilt.db"));
      await asset.downloadAsync();

      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(dbDir, { intermediates: true });
      }
      await FileSystem.copyAsync({
        from: asset.localUri,
        to: dbFile,
      });
      await AsyncStorage.setItem("prebuilt_db_copied", "true");
      console.log("✅ Copied prebuilt DB to device");
    }

    dbInstance = await SQLite.openDatabaseAsync(DB_NAME);

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

    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS assistant_chats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role TEXT NOT NULL,
      content TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    );

    const today = new Date().toISOString().split("T")[0];
    const lastReset = await AsyncStorage.getItem("lastChatsResetDate");

    if (today !== lastReset) {
      await clearChatsDB(db);
      await AsyncStorage.setItem("lastChatsResetDate", today);
    }
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

export const readFoodItemSpecificDB = async (db, searchQuery, lim) => {
  try {
    const results = await db.getAllAsync(
      `SELECT * FROM food_items WHERE name LIKE ? LIMIT ${lim}`,
      [`%${searchQuery}%`]
    );
    return results;
  } catch (error) {
    console.error("13", error);
  }
};

export const checkFoodItemDB = async (db, code) => {
  try {
    const results = await db.getAllAsync(
      `SELECT * FROM food_items WHERE code = ? LIMIT 1`,
      [code]
    );

    return results.length > 0;
  } catch (error) {
    console.error("14", error);
  }
};

export const insertFoodItemDB = async (db, foodItem) => {
  try {
    await db.runAsync(
      "INSERT INTO food_items (code, name, image_url, energy_kcal, protein, carbohydrates, fat_total, fat_saturated, fat_unsaturated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        foodItem.code,
        foodItem.name,
        foodItem.image_url,
        foodItem.energy_kcal,
        foodItem.protein,
        foodItem.carbohydrates,
        foodItem.fat_total,
        null,
        null,
      ]
    );
  } catch (error) {
    console.error("15", error);
  }
};

export const readChatsDB = async (db) => {
  try {
    const results = await db.getAllAsync(
      `SELECT role, content FROM assistant_chats ORDER BY timestamp ASC`
    );
    return results;
  } catch (error) {
    console.error("16", error);
  }
};

export const insertChatDB = async (db, role, message) => {
  try {
    await db.runAsync(
      "INSERT INTO assistant_chats (role, content) VALUES (?, ?)",
      [role, message]
    );
  } catch (error) {
    console.error("17", error);
  }
};

export const tableLayout = async (db) => {
  try {
    const results = await db.getAllAsync("PRAGMA table_info(assistant_chats)");
    console.log("table info", results);
  } catch (error) {
    console.error("table info error: ", error);
  }
};

export const clearChatsDB = async (db) => {
  try {
    await db.runAsync(`DELETE FROM assistant_chats`);
  } catch (error) {
    console.error("18", error);
  }
};

export const syncCloudFridgeDB = async (db, fridgeItems) => {
  try {
    await db.runAsync(`DELETE FROM fridge_items`);

    for (const item of fridgeItems) {
      await db.runAsync(
        "INSERT INTO fridge_items (id, code, name, image_url, energy_kcal, protein, carbohydrates, fat_total, fat_saturated, fat_unsaturated, expiry_date, quantity, unit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          item.sqlite_id,
          item.code,
          item.name,
          item.image_url,
          item.energy_kcal,
          item.protein,
          item.carbohydrates,
          item.fat_total,
          item.fat_saturated,
          item.fat_unsaturated,
          item.expiry_date || "",
          item.quantity || 1,
          item.unit || "",
        ]
      );
    }
  } catch (error) {
    console.error("19", error);
  }
};
