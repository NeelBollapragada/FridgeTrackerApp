import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { insertFridgeItem } from "../../services/sqlite";

const AddFoodCard = ({
  food_item,
  db,
  fridgeData,
  setFridgeData,
  filteredData,
  setFilteredData,
}) => {
  const handleAdd = async () => {
    const newItem = await insertFridgeItem(db, food_item);
    const currData = [...fridgeData, newItem[0]];
    setFridgeData(currData);
    const currQuery = [...filteredData, newItem[0]];
    setFilteredData(currQuery);
  };

  return (
    <TouchableOpacity
      className="border border-gray-600 border-width-[2px] rounded-md flex-row justify-start mx-3 my-2"
      onPress={handleAdd}
    >
      <Image
        source={{ uri: food_item.image_url }}
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
  );
};

export default AddFoodCard;

const styles = StyleSheet.create({});
