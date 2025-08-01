import { useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon, Menu } from "react-native-paper";
import { getHouseholdItems } from "../../services/householdUsers";
import { getDB, readFridgeDB, setDB } from "../../services/sqlite";
import AddFoodModal from "../components/AddFoodModal";
import FridgeCard from "../components/FridgeCard";
import Searchbar from "../components/Searchbar";

const Index = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [database, setDatabase] = useState(null);
  const [fridgeData, setFridgeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [menuVisible, setMenuVisible] = useState(false);
  const [personal, setPersonal] = useState(true);

  useEffect(() => {
    const init = async () => {
      const dbInstance = await getDB();
      await setDB(dbInstance);
      console.log("set db");
      setDatabase(dbInstance);
      console.log("loaded food items");
    };

    console.log("loading");
    init();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View className="flex-1 flex-row justify-between items-center">
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TouchableOpacity
                className="flex-row pt-[1px]"
                onPress={() => setMenuVisible(true)}
              >
                <Icon source="chevron-down" color="#000" size={24} />
                <Text className="ml-1 pt-[1px]">
                  {personal ? "Personal" : "Household"}
                </Text>
              </TouchableOpacity>
            }
          >
            <View>
              <TouchableOpacity
                className={`${personal ? "bg-slate-300" : ""}`}
                onPress={() => {
                  setPersonal(true);
                  setMenuVisible(false);
                }}
              >
                <Text className="px-3 py-1">Personal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`${personal ? "" : "bg-slate-300"}`}
                onPress={async () => {
                  setPersonal(false);
                  const items = await getHouseholdItems();
                  console.log(items);
                  setMenuVisible(false);
                }}
              >
                <Text className="px-3 py-1">Household</Text>
              </TouchableOpacity>
            </View>
          </Menu>
          <TouchableOpacity
            className="mr-6"
            onPress={() => router.push("./scan/scanner")}
          >
            <Icon source="barcode-scan" color="#000" size={30} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, menuVisible]);

  useEffect(() => {
    const readData = async () => {
      if (!database) return;
      const results = await readFridgeDB(database);
      setFridgeData(results);
      setFilteredData(results);
    };
    readData();
  }, [database]);

  return (
    <View className="flex-1 bg-[#f2f2f2]">
      <View className="bg-white py-2 px-3 flex-row shadow-xl">
        <Searchbar fridgeData={fridgeData} setFilteredData={setFilteredData} />
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
          fridgeData={fridgeData}
          setFridgeData={setFridgeData}
          filteredData={filteredData}
          setFilteredData={setFilteredData}
        />
      )}
      {fridgeData.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-700 font-normal">Nothing in fridge.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={({ item }) => (
            <FridgeCard
              fridge_item={item}
              db={database}
              fridgeData={fridgeData}
              setFridgeData={setFridgeData}
              filteredData={filteredData}
              setFilteredData={setFilteredData}
            />
          )}
          keyExtractor={(item) => item.id}
          ListFooterComponent={<View className="h-32" />}
        />
      )}
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({});
