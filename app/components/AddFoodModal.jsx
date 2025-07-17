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
import { Icon } from "react-native-paper";
import { searchFood } from "../../services/openFood";
import {
  getDB,
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
}) => {
  const [database, setDatabase] = useState(null);
  const [query, setQuery] = useState([]);
  const [text, setText] = useState("");
  const [seeMoreBtn, setSeeMoreBtn] = useState(true);
  const [newFood, setNewFood] = useState(false);

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
              <Text className="text-white text-2xl font-bold text-center mt-2">
                Create New Food Item
              </Text>
              <View>
                <View className="flex-row mt-10 px-4 items-center">
                  <Text className="text-gray-200">Name: </Text>
                  <TextInput className="border border-width-[1px] border-gray-200 flex-1 text-white rounded-md h-8 py-0" />
                </View>
                <View className="flex-row mt-8 px-4">
                  <Text className="text-gray-200">Macros: </Text>
                  <Text className="text-gray-500 italic">(optional)</Text>
                </View>
                <View className="flex-col px-4">
                  <View className="flex-row items-center">
                    <Text className="text-gray-200">Carbohydrates: </Text>
                    <TextInput className="border border-width-[1px] border-gray-200 flex-1 text-white rounded-md h-8 py-0" />
                  </View>
                </View>
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
    </Modal>
  );
};

export default AddFoodModal;

const styles = StyleSheet.create({});
