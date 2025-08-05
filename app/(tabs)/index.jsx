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
import { useAuth } from "../../contexts/AuthContext";
import { getHouseholdItems } from "../../services/householdUsers";
import { getDB, readFridgeDB, setDB } from "../../services/sqlite";
import AddFoodModal from "../components/AddFoodModal";
import FridgeCard from "../components/FridgeCard";
import Searchbar from "../components/Searchbar";

const Index = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const { user } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [database, setDatabase] = useState(null);
  const [fridgeData, setFridgeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [menuVisible, setMenuVisible] = useState(false);
  const [personal, setPersonal] = useState(true);
  const [householdFridgeData, setHouseholdFridgeData] = useState([]);
  const [householdFilteredData, setHouseholdFilteredData] = useState([]);

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
                  setHouseholdFridgeData(items);
                  setHouseholdFilteredData(items);
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
      if (personal) {
        const results = await readFridgeDB(database);
        setFridgeData(results);
        setFilteredData(results);
      }
    };
    readData();
  }, [database, personal]);

  return (
    <View className="flex-1 bg-[#f2f2f2]">
      <View className="bg-white py-2 px-3 flex-row shadow-xl">
        <Searchbar
          fridgeData={personal ? fridgeData : householdFridgeData}
          setFilteredData={
            personal ? setFilteredData : setHouseholdFilteredData
          }
          household={!personal}
        />
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
          fridgeData={personal ? fridgeData : householdFridgeData}
          setFridgeData={personal ? setFridgeData : setHouseholdFridgeData}
          filteredData={personal ? filteredData : householdFilteredData}
          setFilteredData={
            personal ? setFilteredData : setHouseholdFilteredData
          }
          household={!personal}
        />
      )}
      {personal ? (
        fridgeData.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-700 font-normal">
              Nothing in fridge.
            </Text>
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
        )
      ) : householdFridgeData.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-700 font-normal">
            Nothing in household fridge.
          </Text>
        </View>
      ) : (
        <FlatList
          data={householdFilteredData}
          renderItem={({ item }) => (
            <View>
              <View className="flex-row">
                <Text className="font-semibold text-xl ml-4 mt-2">
                  {item.name}
                </Text>
                {user.name === item.name && (
                  <Text className="italic font-semibold text-xl mt-2">
                    {" "}
                    (You)
                  </Text>
                )}
              </View>
              {item.items.map((fridgeItem) => (
                <FridgeCard
                  key={`${item.name}_${fridgeItem.sqlite_id}`}
                  fridge_item={fridgeItem}
                  db={database}
                  fridgeData={householdFridgeData}
                  setFridgeData={setHouseholdFridgeData}
                  filteredData={householdFilteredData}
                  setFilteredData={setHouseholdFilteredData}
                  household
                />
              ))}
            </View>
          )}
          keyExtractor={(item) => item.name}
          ListFooterComponent={<View className="h-32" />}
        />
      )}
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({});
