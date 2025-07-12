import { StyleSheet, Text, View } from "react-native";

const AddFoodCard = ({ food_item }) => {
  return (
    <View>
      <Text className="text-white">{food_item.name}</Text>
    </View>
  );
};

export default AddFoodCard;

const styles = StyleSheet.create({});
