import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const FridgeCard = ({ fridge_item }) => {
  return (
    <View className="flex-row border border-gray-500 border-[2px] rounded-lg m-2">
      <Image
        source={{ uri: fridge_item.image_url }}
        className="w-32 h-32 rounded-lg bg-gray-300"
        resizeMode="contain"
      />
      <View className="flex-1 flex-col mx-3 mt-1">
        <Text className="text-black font-bold mb-2" numberOfLines={2}>
          {fridge_item.name}
        </Text>
        <View className="flex-row items-center mb-2">
          <Text className="mr-12">{`Quantity: ${fridge_item.quantity}${fridge_item.unit}`}</Text>
          <TouchableOpacity className="border border-gray-500 border-[1px] rounded-full">
            <Text className="px-3 py-1">
              {fridge_item.expiry_date === ""
                ? "Add Expiry"
                : `Expires: ${fridge_item.expiry_date}`}
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row">
          <Text className="mr-3">Macros:</Text>
          <Text className="mr-2">C: {fridge_item.carbohydrates}g</Text>
          <Text className="mr-2">P: {fridge_item.protein}g</Text>
          <Text className="mr-2">F: {fridge_item.fat_total}g</Text>
        </View>
      </View>
    </View>
  );
};

export default FridgeCard;

const styles = StyleSheet.create({});
