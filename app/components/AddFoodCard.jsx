import { memo, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Portal, Snackbar } from "react-native-paper";
import {
  checkFoodItemDB,
  insertFoodItemDB,
  insertFridgeItem,
} from "../../services/sqlite";

const AddFoodCard = memo(
  ({
    food_item,
    db,
    fridgeData,
    setFridgeData,
    filteredData,
    setFilteredData,
  }) => {
    const [snackbar, setSnackbar] = useState(false);

    const handleAdd = async () => {
      const newItem = await insertFridgeItem(db, food_item);
      const check = await checkFoodItemDB(db, food_item.code);
      if (!check) {
        await insertFoodItemDB(db, food_item);
      }
      const currData = [...fridgeData, newItem[0]];
      setFridgeData(currData);
      const currQuery = [...filteredData, newItem[0]];
      setFilteredData(currQuery);
      setSnackbar(true);
    };

    return (
      <View>
        <TouchableOpacity
          className="border border-gray-600 border-width-[2px] rounded-md flex-row justify-start mx-3 my-2"
          onPress={handleAdd}
        >
          <Image
            source={
              food_item.image_url !== ""
                ? { uri: food_item.image_url }
                : undefined
            }
            className="w-20 h-20 bg-slate-500 rounded-md"
            resizeMode="contain"
            onError={() =>
              console.warn("Image failed to load:", food_item.image_url)
            }
          />
          <View className="flex-1 px-2">
            <Text
              className="text-slate-400 font-bold mt-3 capitalize"
              numberOfLines={2}
            >
              {food_item.name}
            </Text>
          </View>
        </TouchableOpacity>
        <Portal>
          <Snackbar visible={snackbar} onDismiss={() => setSnackbar(false)}>
            <Text className="text-white z-10">{`${food_item.name} added to fridge!`}</Text>
          </Snackbar>
        </Portal>
      </View>
    );
  }
);

export default AddFoodCard;
