import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Icon, Menu } from "react-native-paper";
import {
  deleteFridgeItemDB,
  updateFridgeExpiryDB,
  updateFridgeQuantityDB,
  updateFridgeUnitDB,
} from "../../services/sqlite";

const FridgeCard = ({
  fridge_item,
  db,
  fridgeData,
  setFridgeData,
  filteredData,
  setFilteredData,
}) => {
  const [visible, setVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("");
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const handleClose = () => {
    Alert.alert("Remove Fridge Item", "Would you like to log or delete", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Log",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const currData = fridgeData.filter(
            (item) => item.id !== fridge_item.id
          );
          setFridgeData(currData);
          const currQuery = filteredData.filter(
            (item) => item.id !== fridge_item.id
          );
          setFilteredData(currQuery);
          await deleteFridgeItemDB(db, fridge_item.id);
        },
      },
    ]);
  };
  useEffect(() => {
    setQuantity(fridge_item.quantity);
    setUnit(fridge_item.unit);
  }, []);

  const handleQuantity = async (newQuantity) => {
    setQuantity(newQuantity);
    fridge_item.quantity = newQuantity;
    await updateFridgeQuantityDB(db, fridge_item.id, newQuantity);
  };

  const handleUnit = async (newUnit) => {
    setUnit(newUnit);
    fridge_item.unit = newUnit;
    await updateFridgeUnitDB(db, fridge_item.id, newUnit);
  };

  const handleDate = async (newDate) => {
    const expires = newDate
      .toISOString()
      .slice(0, 10)
      .split("-")
      .reverse()
      .join("/");

    fridge_item.expiry_date = expires;
    await updateFridgeExpiryDB(db, fridge_item.id, expires);
    setDatePickerVisible(false);
  };

  const checkExpiry = (expiry) => {
    const expiry_date = new Date(
      expiry.split("/").reverse().join("-")
    ).getTime();
    const current = new Date().getTime();
    if (expiry_date < current + 86400000 * 2) {
      return "red";
    } else if (expiry_date < current + 86400000 * 5) {
      return "yellow";
    } else {
      return "green";
    }
  };

  return (
    <View className="flex-row border border-gray-500 border-[2px] rounded-lg m-2">
      <Image
        source={{ uri: fridge_item.image_url }}
        className="w-32 h-32 rounded-lg bg-gray-300"
        resizeMode="contain"
      />
      <View className="flex-1 flex-col ml-3 mr-1 mt-1">
        <View className="flex-row justify-between">
          <Text className="text-black font-bold mb-2 w-[90%]" numberOfLines={1}>
            {fridge_item.name}
          </Text>
          <TouchableOpacity onPress={handleClose}>
            <Icon source="close" size={22} />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between items-center mb-2">
          <TouchableOpacity onPress={() => setVisible(true)}>
            <Text className="mr-2">{`Quantity: ${fridge_item.quantity} ${fridge_item.unit}`}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`border border-[1px] rounded-full ${fridge_item.expiry_date === "" ? "mr-16" : "mr-4"} ${fridge_item.expiry_date !== "" ? (checkExpiry(fridge_item.expiry_date) === "red" ? "border-red-950 bg-red-300" : checkExpiry(fridge_item.expiry_date) === "yellow" ? "border-amber-950 bg-amber-100" : "border-green-950 bg-green-300") : "border-gray-500"}`}
            onPress={() => setDatePickerVisible(true)}
          >
            <Text className="px-3 py-1">
              {fridge_item.expiry_date === ""
                ? "Add Expiry"
                : `Expires: ${fridge_item.expiry_date}`}
            </Text>
          </TouchableOpacity>
        </View>
        <Menu
          visible={visible}
          onDismiss={() => setVisible(false)}
          anchor={
            <Text className="">Energy: {fridge_item.energy_kcal} kcal</Text>
          }
          style={{
            backgroundColor: "transparent",
            elevation: 0,
            borderWidth: 0,
            paddingVertical: 0,
          }}
        >
          <View className="flex-col justify-center">
            <TextInput
              placeholder="quantity"
              placeholderTextColor="#c0c0c0"
              className="text-black border border-gray-900 h-auto mb-2"
              style={{ textAlignVertical: "top" }}
              keyboardType="numeric"
            />
            <View className="flex-row">
              <View className="bg-white">
                <TouchableOpacity
                  className="bg-white"
                  onPress={() => handleQuantity(1)}
                >
                  <Text className="text-center pb-2">1</Text>
                </TouchableOpacity>
                <View className="h-px bg-gray-800 w-full opacity-50" />
                <TouchableOpacity
                  className="bg-white"
                  onPress={() => handleQuantity(2)}
                >
                  <Text className="text-center py-2">2</Text>
                </TouchableOpacity>
                <View className="h-px bg-gray-800 w-full opacity-50" />
                <TouchableOpacity
                  className="bg-white"
                  onPress={() => handleQuantity(5)}
                >
                  <Text className="text-center py-2">5</Text>
                </TouchableOpacity>
                <View className="h-px bg-gray-800 w-full opacity-50" />
                <TouchableOpacity
                  className="bg-white px-2"
                  onPress={() => handleQuantity(100)}
                >
                  <Text className="text-center py-2">100</Text>
                </TouchableOpacity>
                <View className="h-px bg-gray-800 w-full opacity-50" />
                <TouchableOpacity
                  className="bg-white"
                  onPress={() => handleQuantity(200)}
                >
                  <Text className="text-center py-2">200</Text>
                </TouchableOpacity>
                <View className="h-px bg-gray-800 w-full opacity-50" />
                <TouchableOpacity
                  className="bg-white"
                  onPress={() => handleQuantity(400)}
                >
                  <Text className="text-center py-2">400</Text>
                </TouchableOpacity>
              </View>
              <View className="h-full w-px bg-gray-800 opacity-30 mx-1" />
              <View>
                <View className="bg-white">
                  <TouchableOpacity
                    className="bg-white"
                    onPress={() => handleUnit("")}
                  >
                    <Text className="text-center pb-2">(none)</Text>
                  </TouchableOpacity>
                  <View className="h-px bg-gray-800 w-full opacity-50" />
                  <TouchableOpacity
                    className="bg-white"
                    onPress={() => handleUnit("g")}
                  >
                    <Text className="text-center py-2">g</Text>
                  </TouchableOpacity>
                  <View className="h-px bg-gray-800 w-full opacity-50" />
                  <TouchableOpacity
                    className="bg-white"
                    onPress={() => handleUnit("mg")}
                  >
                    <Text className="text-center py-2">mg</Text>
                  </TouchableOpacity>
                  <View className="h-px bg-gray-800 w-full opacity-50" />
                  <TouchableOpacity
                    className="bg-white px-2"
                    onPress={() => handleUnit("oz")}
                  >
                    <Text className="text-center py-2">oz</Text>
                  </TouchableOpacity>
                  <View className="h-px bg-gray-800 w-full opacity-50" />
                  <TouchableOpacity
                    className="bg-white"
                    onPress={() => handleUnit("ml")}
                  >
                    <Text className="text-center py-2">ml</Text>
                  </TouchableOpacity>
                  <View className="h-px bg-gray-800 w-full opacity-50" />
                  <TouchableOpacity
                    className="bg-white"
                    onPress={() => handleUnit("l")}
                  >
                    <Text className="text-center py-2">l</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Menu>
        <View className="flex-row">
          <Text className="mr-3 text-gray-600">Macros:</Text>
          <Text className="mr-2 text-gray-600">
            C: {fridge_item.carbohydrates}g
          </Text>
          <Text className="mr-2 text-gray-600">P: {fridge_item.protein}g</Text>
          <Text className="mr-2 text-gray-600">
            F: {fridge_item.fat_total}g
          </Text>
        </View>
      </View>
      <DateTimePickerModal
        isVisible={datePickerVisible}
        mode="date"
        onConfirm={(date) => handleDate(date)}
        onCancel={() => setDatePickerVisible(false)}
        minimumDate={new Date()}
      />
    </View>
  );
};

export default FridgeCard;

const styles = StyleSheet.create({});
