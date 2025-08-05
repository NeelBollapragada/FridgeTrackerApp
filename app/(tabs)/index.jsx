import { useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator, Icon, Menu } from "react-native-paper";
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

  const [loading, setLoading] = useState(false);
  const [fullLoading, setFullLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [database, setDatabase] = useState(null);
  const [fridgeData, setFridgeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [menuVisible, setMenuVisible] = useState(false);
  const [personal, setPersonal] = useState(true);
  const [householdFridgeData, setHouseholdFridgeData] = useState([]);
  const [householdFilteredData, setHouseholdFilteredData] = useState([]);
  const [messageVisible, setMessageVisible] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const dbInstance = await getDB();
      await setDB(dbInstance);
      setDatabase(dbInstance);
      setFullLoading(false);
      setLoading(false);
    };

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
                  if (!user) {
                    setMessageVisible(true);
                    return;
                  }
                  setLoading(true);
                  const items = await getHouseholdItems();
                  if (!items || items.error) {
                    setMessageVisible(true);
                    setLoading(false);
                    setMenuVisible(false);
                    return;
                  }
                  setPersonal(false);
                  setHouseholdFridgeData(items);
                  setHouseholdFilteredData(items);
                  setMenuVisible(false);
                  setLoading(false);
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
      setLoading(true);
      if (personal) {
        const results = await readFridgeDB(database);
        setFridgeData(results);
        setFilteredData(results);
      }
      setLoading(false);
    };
    readData();
  }, [database, personal]);

  if (fullLoading) {
    return (
      <View className="flex-1 bg-blue-500 z-999 justify-center items-center">
        <ActivityIndicator animating color="#fff" size="large" />
        <Text className="text-white text-2xl mt-2">Preloading items</Text>
        <Text className="text-white">
          This may take a few minutes on first launch.
        </Text>
      </View>
    );
  }

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
      {loading ? (
        <View className="m-auto">
          <ActivityIndicator animating color="#6b7280" />
        </View>
      ) : personal ? (
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
      {messageVisible && (
        <Modal
          animationType="fade"
          visible={messageVisible}
          transparent
          onRequestClose={() => setMessageVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/40">
            <View className="bg-white w-[70%] h-auto rounded-lg">
              <View className="flex-row justify-between">
                <Text className="font-semibold text-xl px-4 py-3">
                  Not part of Household
                </Text>
                <TouchableOpacity
                  className="mt-1 mr-1"
                  onPress={() => {
                    setMessageVisible(false);
                  }}
                >
                  <Icon source="close" size={24} />
                </TouchableOpacity>
              </View>
              <Text className="px-4 text-justify">
                You need to be logged in and a part of a household to use this
                feature.
              </Text>
              <TouchableOpacity
                className="bg-blue-500 rounded-lg ml-4 my-4 mr-auto"
                onPress={() => {
                  setMenuVisible(false);
                  setMessageVisible(false);
                  router.replace("./profile");
                }}
              >
                <Text className="text-white px-3 py-2">Go to Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({});
