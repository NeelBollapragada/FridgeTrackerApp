import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { readFridgeDB } from "../../services/sqlite";
import AddFoodModal from "../components/AddFoodModal";
import Searchbar from "../components/Searchbar";

const Index = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [database, setDatabase] = useState(null);
  const [fridgeData, setFridgeData] = useState([]);

  useEffect(() => {
    const init = async () => {
      const dbInstance = await getDB();
      setDatabase(dbInstance);
    };
    init();
  }, []);

  useEffect(() => {
    const readData = async () => {
      const results = await readFridgeDB(database);
      setFridgeData(results);
    };
    readData();
  }, [database]);

  return (
    <View className="flex-1 bg-[#f2f2f2]">
      <View className="bg-white py-2 px-3 flex-row shadow-xl">
        <Searchbar />
        <TouchableOpacity
          className="bg-blue-500 w-[18%] ml-2 items-center justify-center rounded-xl"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-white text-center">Add +</Text>
        </TouchableOpacity>
      </View>
      {modalVisible && (
        <AddFoodModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      )}
      {fridgeData.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-700 font-normal">Nothing in fridge.</Text>
        </View>
      ) : (
        <FlatList
          data={fridgeData}
          renderItem={({ item }) => <Text>{item.name}</Text>}
        />
      )}
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({});
