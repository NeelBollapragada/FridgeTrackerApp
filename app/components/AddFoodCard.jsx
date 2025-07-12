import { Image, StyleSheet, Text, View } from "react-native";

const AddFoodCard = ({ food_item }) => {
  console.log(food_item.image_url);
  return (
    <View className="border border-gray-600 border-width-[2px] rounded-md">
      <Image
        source={{ uri: food_item.image_url }}
        style={{ width: 80, height: 80, backgroundColor: "lightgray" }}
        onError={() =>
          console.warn("⚠️ Image failed to load:", food_item.image_url)
        }
      />
      <Text className="text-white">{food_item.name}</Text>
    </View>
  );
};

export default AddFoodCard;

const styles = StyleSheet.create({});
