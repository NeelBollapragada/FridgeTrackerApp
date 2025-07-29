import { account } from "./appwrite";
import { checkNetwork } from "./netinfo";
import { getDB, readFridgeDB, syncCloudFridgeDB } from "./sqlite";

const FRIDGE_READ_URL = "https://fridgetrackerbackend.onrender.com/api/fridge";
const FRIDGE_SYNC_URL =
  "https://fridgetrackerbackend.onrender.com/api/fridge/sync";

const areFridgesEqual = (localFridge, appwriteFridge) => {
  if (localFridge.length !== appwriteFridge.length) {
    return false;
  }

  const normalize = (items) =>
    items
      .map((item) =>
        JSON.stringify({
          code: item.code,
          quantity: item.quantity,
          expiry_date: item.expiry_date,
          unit: item.unit,
        })
      )
      .sort();

  return (
    JSON.stringify(normalize(localFridge)) ===
    JSON.stringify(normalize(appwriteFridge))
  );
};

export const checkFridgeSync = async () => {
  const online = await checkNetwork();
  if (!online) {
    console.warn("No internet connection. Skipping fridge sync check.");
    return true;
  }

  try {
    const db = await getDB();
    const localFridgeItems = await readFridgeDB(db);
    const user = await account.get();

    const res = await fetch(FRIDGE_READ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user.$id }),
    });
    const appwriteFridgeItems = await res.json();

    const isSame = areFridgesEqual(localFridgeItems, appwriteFridgeItems);
    return isSame;
  } catch (error) {
    console.error("Error checking fridge sync:", error);
    return true;
  }
};

export const keepLocalFridge = async () => {
  const online = await checkNetwork();
  if (!online) {
    console.warn("No internet connection. Skipping local fridge sync.");
    return;
  }

  try {
    const db = await getDB();
    const localFridgeItems = await readFridgeDB(db);
    const user = await account.get();

    const res = await fetch(FRIDGE_SYNC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user.$id, items: localFridgeItems }),
    });

    if (!res?.ok) {
      const data = await res.json();
      console.error("Error", data.error);
    }

    console.log("Local fridge synced successfully.");
  } catch (error) {
    console.error("Error keeping local fridge:", error);
  }
};

export const keepCloudFridge = async () => {
  const online = await checkNetwork();
  if (!online) {
    console.warn("No internet connection. Skipping cloud fridge sync.");
    return;
  }

  try {
    const user = await account.get();
    const res = await fetch(FRIDGE_READ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user.$id }),
    });

    const appwriteFridgeItems = await res.json();

    const db = await getDB();
    await syncCloudFridgeDB(db, appwriteFridgeItems);
    console.log("Cloud fridge synced successfully.");
  } catch (error) {
    console.error("Error keeping cloud fridge:", error);
  }
};
