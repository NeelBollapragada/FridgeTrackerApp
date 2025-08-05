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
import { useAuth } from "../../contexts/AuthContext";
import {
  removeCloudFridge,
  updateCloudFridge,
} from "../../services/fridgeSync";
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
  household,
}) => {
  const [visible, setVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [quantityInput, setQuantityInput] = useState("");
  const [useInput, setUseInput] = useState(false);
  const [unit, setUnit] = useState("");
  const [expiry, setExpiry] = useState("");
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const { user } = useAuth();

  const handleClose = () => {
    Alert.alert(
      "Remove Fridge Item",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const currData = fridgeData.filter((item) => {
              if (household) {
                return item.sqlite_id !== fridge_item.sqlite_id;
              } else {
                return item.id !== fridge_item.id;
              }
            });
            setFridgeData(currData);
            const currQuery = filteredData.filter((item) => {
              if (household) {
                return item.sqlite_id !== fridge_item.sqlite_id;
              } else {
                return item.id !== fridge_item.id;
              }
            });
            setFilteredData(currQuery);
            if (household) {
              await deleteFridgeItemDB(db, fridge_item.sqlite_id);
              await removeCloudFridge(fridge_item.sqlite_id);
            } else {
              await deleteFridgeItemDB(db, fridge_item.id);
              await removeCloudFridge(fridge_item.id);
            }
          },
        },
      ]
    );
  };
  useEffect(() => {
    setQuantity(fridge_item.quantity);
    setUnit(fridge_item.unit);
    setExpiry(dayExpiry(fridge_item.expiry_date));
  }, []);

  const handleQuantity = async (newQuantity) => {
    setQuantity(newQuantity);
    fridge_item.quantity = newQuantity;
    if (household) {
      await updateFridgeQuantityDB(db, fridge_item.sqlite_id, newQuantity);
      await updateCloudFridge(fridge_item.sqlite_id, newQuantity, "quantity");
    } else {
      await updateFridgeQuantityDB(db, fridge_item.id, newQuantity);
      await updateCloudFridge(fridge_item.id, newQuantity, "quantity");
    }
  };

  const handleUnit = async (newUnit) => {
    setUnit(newUnit);
    fridge_item.unit = newUnit;
    if (household) {
      await updateFridgeUnitDB(db, fridge_item.sqlite_id, newUnit);
      await updateCloudFridge(fridge_item.sqlite_id, newUnit, "unit");
    } else {
      await updateFridgeUnitDB(db, fridge_item.id, newUnit);
      await updateCloudFridge(fridge_item.id, newUnit, "unit");
    }
  };

  const handleDate = async (newDate) => {
    const expires = newDate
      .toISOString()
      .slice(0, 10)
      .split("-")
      .reverse()
      .join("/");

    fridge_item.expiry_date = expires;
    setExpiry(dayExpiry(expires));
    if (household) {
      await updateFridgeExpiryDB(db, fridge_item.sqlite_id, expires);
    } else {
      await updateFridgeExpiryDB(db, fridge_item.id, expires);
    }
    setDatePickerVisible(false);
    if (household) {
      await updateCloudFridge(fridge_item.sqlite_id, expires, "expiry_date");
    } else {
      await updateCloudFridge(fridge_item.id, expires, "expiry_date");
    }
  };

  const checkExpiry = (expiry) => {
    const expiry_date = new Date(
      expiry.split("/").reverse().join("-")
    ).getTime();
    const current = new Date().getTime();

    if (expiry_date < current - 86400000) {
      return "expired";
    }

    if (expiry_date < current + 86400000 * 2) {
      return "red";
    } else if (expiry_date < current + 86400000 * 5) {
      return "yellow";
    } else {
      return "green";
    }
  };

  const dayExpiry = (expiry) => {
    const current = new Date();

    const days = {
      0: "Sunday",
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday",
    };

    const expiryDate = expiry.split("/").reverse().join("-");
    const checkingDate = new Date(expiryDate);

    if (checkingDate.getTime() < current.getTime() - 86400000) {
      return "Expired";
    }

    if (
      current.getTime() >= checkingDate.getTime() &&
      current.getTime() <= checkingDate.getTime() + 86400000
    ) {
      return "Today";
    } else if (
      current.getTime() + 86400000 >= checkingDate.getTime() &&
      current.getTime() <= checkingDate.getTime()
    ) {
      return "Tomorrow";
    }

    if (checkingDate.getTime() - current.getTime() > 86400000 * 6) {
      return expiry;
    } else {
      return days[checkingDate.getDay()];
    }
  };

  return (
    <View className="flex-row border border-gray-500 border-[2px] rounded-lg m-2">
      <Image
        source={
          fridge_item.image_url !== ""
            ? { uri: fridge_item.image_url }
            : undefined
        }
        className="w-32 h-32 rounded-lg bg-gray-300"
        resizeMode="contain"
      />
      <View className="flex-1 flex-col ml-3 mr-1 mt-1">
        <View className="flex-row justify-between">
          <Text className="text-black font-bold mb-2 w-[90%]" numberOfLines={1}>
            {fridge_item.name}
          </Text>
          {!(household && user && user.$id !== fridge_item.user_id) && (
            <TouchableOpacity onPress={handleClose}>
              <Icon source="close" size={22} />
            </TouchableOpacity>
          )}
        </View>
        <View className="flex-row justify-between items-center mb-2">
          {household && user && user.$id !== fridge_item.user_id ? (
            <View>
              <Text className="mr-2">{`Quantity: ${fridge_item.quantity} ${fridge_item.unit}`}</Text>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setVisible(true)}>
              <Text className="mr-2">{`Quantity: ${fridge_item.quantity} ${fridge_item.unit}`}</Text>
            </TouchableOpacity>
          )}
          {household && user && user.$id !== fridge_item.user_id ? (
            <View
              className={`border border-[1px] rounded-full ${fridge_item.expiry_date === "" ? "mr-16" : "mr-4 w-[54%]"} ${fridge_item.expiry_date !== "" ? (checkExpiry(fridge_item.expiry_date) === "red" ? "border-red-950 bg-red-300" : checkExpiry(fridge_item.expiry_date) === "yellow" ? "border-amber-950 bg-amber-100" : checkExpiry(fridge_item.expiry_date) === "expired" ? "border-orange-950 bg-orange-300" : "border-green-950 bg-green-300") : "border-gray-500"}`}
            >
              {fridge_item.expiry_date === "" ? (
                <Text className="px-3 py-1">Add Expiry</Text>
              ) : (
                <View className="flex-row px-3 py-1">
                  <Text>Expires: </Text>
                  <Text
                    className={
                      expiry === "Today" || expiry === "Expired"
                        ? "font-bold"
                        : ""
                    }
                  >
                    {expiry}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <TouchableOpacity
              className={`border border-[1px] rounded-full ${fridge_item.expiry_date === "" ? "mr-16" : "mr-4 w-[54%]"} ${fridge_item.expiry_date !== "" ? (checkExpiry(fridge_item.expiry_date) === "red" ? "border-red-950 bg-red-300" : checkExpiry(fridge_item.expiry_date) === "yellow" ? "border-amber-950 bg-amber-100" : checkExpiry(fridge_item.expiry_date) === "expired" ? "border-orange-950 bg-orange-300" : "border-green-950 bg-green-300") : "border-gray-500"}`}
              onPress={() => setDatePickerVisible(true)}
            >
              {fridge_item.expiry_date === "" ? (
                <Text className="px-3 py-1">Add Expiry</Text>
              ) : (
                <View className="flex-row px-3 py-1">
                  <Text>Expires: </Text>
                  <Text
                    className={
                      expiry === "Today" || expiry === "Expired"
                        ? "font-bold"
                        : ""
                    }
                  >
                    {expiry}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
        <Menu
          visible={visible}
          onDismiss={() => {
            if (useInput) {
              const value = parseFloat(quantityInput);
              if (!isNaN(value)) {
                handleQuantity(value);
              }
            }
            setUseInput(false);
            setVisible(false);
          }}
          anchor={
            fridge_item.energy_kcal ? (
              <Text className="">Energy: {fridge_item.energy_kcal} kcal</Text>
            ) : (
              <Text className="text-[#f2f2f2]">Energy</Text>
            )
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
              value={quantityInput}
              onChangeText={(text) => {
                setQuantityInput(text);
                setUseInput(true);
              }}
              className="text-black border border-gray-900 mb-2 h-8 py-0"
              keyboardType="numeric"
            />
            <View className="flex-row">
              <View className="bg-white">
                <TouchableOpacity
                  className="bg-white"
                  onPress={() => {
                    handleQuantity(1);
                    setUseInput(false);
                    setQuantityInput("");
                  }}
                >
                  <Text className="text-center pb-2">1</Text>
                </TouchableOpacity>
                <View className="h-px bg-gray-800 w-full opacity-50" />
                <TouchableOpacity
                  className="bg-white"
                  onPress={() => {
                    handleQuantity(2);
                    setUseInput(false);
                    setQuantityInput("");
                  }}
                >
                  <Text className="text-center py-2">2</Text>
                </TouchableOpacity>
                <View className="h-px bg-gray-800 w-full opacity-50" />
                <TouchableOpacity
                  className="bg-white"
                  onPress={() => {
                    handleQuantity(5);
                    setUseInput(false);
                    setQuantityInput("");
                  }}
                >
                  <Text className="text-center py-2">5</Text>
                </TouchableOpacity>
                <View className="h-px bg-gray-800 w-full opacity-50" />
                <TouchableOpacity
                  className="bg-white px-2"
                  onPress={() => {
                    handleQuantity(100);
                    setUseInput(false);
                    setQuantityInput("");
                  }}
                >
                  <Text className="text-center py-2">100</Text>
                </TouchableOpacity>
                <View className="h-px bg-gray-800 w-full opacity-50" />
                <TouchableOpacity
                  className="bg-white"
                  onPress={() => {
                    handleQuantity(200);
                    setUseInput(false);
                    setQuantityInput("");
                  }}
                >
                  <Text className="text-center py-2">200</Text>
                </TouchableOpacity>
                <View className="h-px bg-gray-800 w-full opacity-50" />
                <TouchableOpacity
                  className="bg-white"
                  onPress={() => {
                    handleQuantity(400);
                    setUseInput(false);
                    setQuantityInput("");
                  }}
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
          {(fridge_item.carbohydrates != null ||
            fridge_item.protein != null ||
            fridge_item.fat_total != null) && (
            <Text className="mr-3 text-gray-600">Macros:</Text>
          )}
          {fridge_item.carbohydrates != null && (
            <Text className="mr-2 text-gray-600">
              C: {fridge_item.carbohydrates}g
            </Text>
          )}
          {fridge_item.protein != null && (
            <Text className="mr-2 text-gray-600">
              P: {fridge_item.protein}g
            </Text>
          )}
          {fridge_item.fat_total != null && (
            <Text className="mr-2 text-gray-600">
              F: {fridge_item.fat_total}g
            </Text>
          )}
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
