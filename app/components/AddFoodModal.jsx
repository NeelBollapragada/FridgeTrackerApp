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
import { getDB, readFoodItemDB } from "../../services/sqlite";
import AddFoodCard from "./AddFoodCard";

const AddFoodModal = ({ modalVisible, setModalVisible }) => {
  const [database, setDatabase] = useState(null);
  const [query, setQuery] = useState([]);

  useEffect(() => {
    const init = async () => {
      const dbInstance = await getDB();
      setDatabase(dbInstance);
    };
    init();
  }, []);

  useEffect(() => {
    const changeQuery = async () => {
      const results = await readFoodItemDB(database, 20);
      setQuery(results);
    };
    changeQuery();
  }, [database]);

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
          <View className="h-[0.4px] bg-white w-full" />
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#9ca3af"
            className="ml-4 text-white"
          />
          <View className="h-[0.4px] bg-white w-full" />
          <FlatList
            data={query}
            renderItem={({ item }) => <AddFoodCard food_item={item} />}
            ListFooterComponent={
              <TouchableOpacity className="mt-5 mb-12 mx-auto">
                <Text className="text-white bg-slate-700 px-3 py-2 rounded-lg">
                  See more
                </Text>
              </TouchableOpacity>
            }
          />
        </View>
      </View>
    </Modal>
  );
};

export default AddFoodModal;

const styles = StyleSheet.create({});
