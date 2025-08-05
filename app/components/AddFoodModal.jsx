import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon, Portal, Snackbar } from "react-native-paper";
import uuid from "react-native-uuid";
import { useAuth } from "../../contexts/AuthContext";
import { addCloudFridge } from "../../services/fridgeSync";
import { searchFood } from "../../services/openFood";
import {
  getDB,
  insertFoodItemDB,
  insertFridgeItem,
  readFoodItemDB,
  readFoodItemSpecificDB,
} from "../../services/sqlite";
import AddFoodCard from "./AddFoodCard";

const AddFoodModal = ({
  modalVisible,
  setModalVisible,
  fridgeData,
  setFridgeData,
  filteredData,
  setFilteredData,
  household,
}) => {
  const [database, setDatabase] = useState(null);
  const [query, setQuery] = useState([]);
  const [text, setText] = useState("");
  const [seeMoreBtn, setSeeMoreBtn] = useState(true);
  const [newFood, setNewFood] = useState(false);

  const [error, setError] = useState("");
  const [newName, setNewName] = useState("");
  const [newProtein, setNewProtein] = useState("");
  const [newCarbohydrates, setNewCarbohydrates] = useState("");
  const [newFat, setNewFat] = useState("");
  const [newEnergy, setNewEnergy] = useState("");
  const [newImage, setNewImage] = useState("");

  const [snackbar, setSnackbar] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    const init = async () => {
      const dbInstance = await getDB();
      setDatabase(dbInstance);
    };
    init();
  }, []);

  useEffect(() => {
    const changeQuery = async () => {
      if (!database) return;
      const results = await readFoodItemDB(database, 20);
      setQuery(results);
    };
    changeQuery();
  }, [database]);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (!database) return;
      if (text.trim()) {
        const results = await readFoodItemSpecificDB(database, text, 20);
        if (results.length < 5) {
          const products = await searchFood(text.trim());
          const newResults = results.concat(products);
          let seen = new Set();
          const uniqueResults = newResults.filter((item) => {
            if (seen.has(item.code)) return false;
            seen.add(item.code);
            return true;
          });
          setQuery(uniqueResults);
          setSeeMoreBtn(false);
        } else {
          setQuery(results);
          setSeeMoreBtn(true);
        }
      } else {
        const results = await readFoodItemDB(database, 20);
        setQuery(results);
        setSeeMoreBtn(true);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [text]);

  const seeMore = async () => {
    const results = await searchFood(text.trim());
    const newQuery = query.concat(results);
    setQuery(newQuery);
    setSeeMoreBtn(false);
  };

  const createNew = async () => {
    const uuidCode = uuid.v4();
    const newCode = `custom_${uuidCode}`;

    if (!newName.trim()) {
      setError("Name cannot be empty");
      return;
    } else if (
      parseFloat(newProtein) < 0 ||
      parseFloat(newCarbohydrates) < 0 ||
      parseFloat(newFat) < 0 ||
      parseFloat(newEnergy) < 0
    ) {
      setError("Macros cannot be less than 0");
      return;
    }

    setError("");

    const newItem = {
      code: newCode,
      name: newName.trim(),
      image_url: newImage ?? null,
      energy_kcal: parseFloat(newEnergy) ?? null,
      protein: parseFloat(newProtein) ?? null,
      carbohydrates: parseFloat(newCarbohydrates) ?? null,
      fat_total: parseFloat(newFat) ?? null,
      fat_saturated: null,
      fat_unsaturated: null,
    };

    const newFridgeItem = await insertFridgeItem(database, newItem);
    await insertFoodItemDB(database, newItem);
    if (household) {
      const currData = fridgeData.map((elem) => {
        if (elem.name === user.name) {
          elem.items.push(newItem[0]);
        }

        return elem;
      });
      setFridgeData(currData);
      const currQuery = filteredData.map((elem) => {
        if (elem.name === user.name) {
          elem.items.push(newItem[0]);
        }

        return elem;
      });
      setFilteredData(currQuery);
    } else {
      const currData = [...fridgeData, newFridgeItem[0]];
      setFridgeData(currData);
      const currQuery = [...filteredData, newFridgeItem[0]];
      setFilteredData(currQuery);
    }
    setNewFood(false);
    setSnackbar(true);
    if (user) {
      await addCloudFridge(newFridgeItem[0]);
    }
  };

  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      transparent
      onRequestClose={() => setModalVisible(false)}
    >
      <View className="flex-1 items-center justify-center bg-black/40">
        <View className="bg-navy w-[80%] h-[75%] rounded-xl shadow-2xl">
          <TouchableOpacity
            className="self-end mt-1 mr-1"
            onPress={() => setModalVisible(false)}
          >
            <Icon source="close" color="#9ca3af" size={25} />
          </TouchableOpacity>
          <Text className="text-center text-white font-bold text-4xl mb-4">
            Add Food
          </Text>
          <View className="h-px bg-white w-full opacity-50" />
          <View className="flex-row">
            <TextInput
              placeholder="Search..."
              placeholderTextColor="#9ca3af"
              value={text}
              onChangeText={setText}
              onPress={() => setNewFood(false)}
              className="ml-4 text-white flex-1"
            />
            <TouchableOpacity className="my-auto mx-4">
              <Text
                className="text-white bg-slate-500 px-2 py-1 rounded-md"
                onPress={() => {
                  const newFoodToggle = !newFood;
                  setNewFood(newFoodToggle);
                }}
              >
                {newFood ? " Back " : "New + "}
              </Text>
            </TouchableOpacity>
          </View>
          <View className="h-px bg-white w-full opacity-50" />
          {newFood ? (
            <>
              <Text className="text-white text-2xl font-bold text-center mt-4">
                Create New Food Item
              </Text>
              <View>
                <View className="flex-row mt-10 px-8 items-center">
                  <Text className="text-gray-200">Name: </Text>
                  <TextInput
                    value={newName}
                    onChangeText={setNewName}
                    className="border border-width-[1px] border-gray-200 flex-1 text-white rounded-md h-8 py-0"
                  />
                </View>
                <View className="flex-row mt-8 px-8">
                  <Text className="text-gray-200">Macros: </Text>
                  <Text className="text-gray-500 italic">(optional)</Text>
                </View>
                <View className="flex-col px-8">
                  <View className="flex-row items-center mt-2 px-2">
                    <Text className="text-gray-200">Protein: </Text>
                    <TextInput
                      value={newProtein}
                      onChangeText={setNewProtein}
                      className="border border-width-[1px] border-gray-200 text-white rounded-md h-8 py-0 w-24"
                      keyboardType="numeric"
                    />
                  </View>
                  <View className="flex-row items-center mt-2 px-2">
                    <Text className="text-gray-200">Carbohydrates: </Text>
                    <TextInput
                      value={newCarbohydrates}
                      onChangeText={setNewCarbohydrates}
                      className="border border-width-[1px] border-gray-200 text-white rounded-md h-8 py-0 w-24"
                      keyboardType="numeric"
                    />
                  </View>
                  <View className="flex-row items-center mt-2 px-2">
                    <Text className="text-gray-200">Fat: </Text>
                    <TextInput
                      value={newFat}
                      onChangeText={setNewFat}
                      className="border border-width-[1px] border-gray-200 text-white rounded-md h-8 py-0 w-24"
                      keyboardType="numeric"
                    />
                  </View>
                  <View className="flex-row items-center mt-2 px-2">
                    <Text className="text-gray-200">Energy (kcal): </Text>
                    <TextInput
                      value={newEnergy}
                      onChangeText={setNewEnergy}
                      className="border border-width-[1px] border-gray-200 text-white rounded-md h-8 py-0 w-24"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                <View className="flex-row mt-10 ml-8">
                  <Text className="text-gray-200">Image URL: </Text>
                  <Text className="text-gray-500 italic">(optional)</Text>
                </View>
                <TextInput
                  value={newImage}
                  onChangeText={setNewImage}
                  className="border border-width-[1px] border-gray-200 text-white rounded-md h-8 py-0 mx-8 mt-1"
                  keyboardType="url"
                />
                <Text className="text-red-700 text-center mt-8">{error}</Text>
                <TouchableOpacity
                  className="bg-gray-500 mx-auto px-4 py-2 rounded-lg mt-1"
                  onPress={() => createNew()}
                >
                  <Text className="text-gray-200 text-lg">Create</Text>
                </TouchableOpacity>
                <Text className="text-gray-500 text-sm ml-8 mt-8">
                  Note: This will also add your item to your fridge.
                </Text>
              </View>
            </>
          ) : (
            <FlatList
              data={query}
              renderItem={({ item }) => (
                <AddFoodCard
                  food_item={item}
                  db={database}
                  fridgeData={fridgeData}
                  setFridgeData={setFridgeData}
                  filteredData={filteredData}
                  setFilteredData={setFilteredData}
                  household={household}
                />
              )}
              keyExtractor={(item) => item.code}
              ListFooterComponent={
                seeMoreBtn ? (
                  <TouchableOpacity
                    className="mt-5 mb-12 mx-auto"
                    onPress={() => seeMore()}
                  >
                    <Text className="text-white bg-slate-700 px-3 py-2 rounded-lg">
                      See more
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View className="mt-16" />
                )
              }
            />
          )}
        </View>
      </View>
      <Portal>
        <Snackbar visible={snackbar} onDismiss={() => setSnackbar(false)}>
          <Text className="text-white z-10">{`${newName} added to fridge!`}</Text>
        </Snackbar>
      </Portal>
    </Modal>
  );
};

export default AddFoodModal;

const styles = StyleSheet.create({});
