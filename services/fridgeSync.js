import { account } from "./appwrite";
import { getDB, readFridgeDB } from "./sqlite";

const FRIDGE_READ_URL = "https://fridgetrackerbackend.onrender.com/api/fridge";

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
  try {
    const db = await getDB();
    const localFridgeItems = await readFridgeDB(db);
    const jwt = await account.getJWT();

    const res = await fetch(FRIDGE_READ_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt.jwt}`,
      },
    });

    const appwriteFridgeItems = await res.json();

    const isSame = areFridgesEqual(localFridgeItems, appwriteFridgeItems);
    return isSame;
  } catch (error) {
    console.error("Error checking fridge sync:", error);
    return true;
  }
};
