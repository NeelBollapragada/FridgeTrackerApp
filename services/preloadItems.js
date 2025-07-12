import AsyncStorage from "@react-native-async-storage/async-storage";
import filteredFood from "../assets/json/filtered_food.json";
import { getDB } from "./sqlite";

export const preloadFoodItems = async () => {
  try {
    const alreadyLoaded = await AsyncStorage.getItem("foods_preloaded");
    if (alreadyLoaded === "true") {
      console.log("Food items already preloaded.");
      return;
    }

    const db = await getDB();
    console.log(`Inserting ${filteredFood.length} food items...`);

    for (const item of filteredFood) {
      await db.runAsync(
        `INSERT OR REPLACE INTO food_items 
         (code, name, image_url, energy_kcal, protein, carbohydrates, fat_total, fat_saturated, fat_unsaturated)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.code,
          item.name,
          item.image,
          item.nutriments.energy_kcal,
          item.nutriments.protein,
          item.nutriments.carbohydrates,
          item.nutriments.fat_total,
          item.nutriments.fat_saturated,
          item.nutriments.fat_unsaturated,
        ]
      );
    }

    await AsyncStorage.setItem("foods_preloaded", "true");
    console.log("✅ Finished preloading food items.");
  } catch (err) {
    console.error("❌ preloadFoodItems failed:", err);
  }
};
