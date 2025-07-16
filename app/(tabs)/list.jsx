import paperBg from "@/assets/images/lined-paper-3.png";
import { useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-paper";
import {
  clearShoppingDB,
  getDB,
  insertShoppingDB,
  readFridgeDB,
  readShoppingDB,
} from "../../services/sqlite";

const List = () => {
  const navigation = useNavigation();
  const [text, setText] = useState("");
  const [database, setDatabase] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const init = async () => {
      const dbInstance = await getDB();
      setDatabase(dbInstance);
      const dbContents = await readShoppingDB(dbInstance);
      setText(dbContents.join("\n"));
    };
    init();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      const shoppingItems = text
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      await clearShoppingDB(database);
      for (const item of shoppingItems) {
        await insertShoppingDB(database, item);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [text]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View className="flex-row justify-center items-center">
          <TouchableOpacity
            className="mr-1"
            onPress={async () => {
              setModalVisible(true);
            }}
          >
            <Icon source="playlist-check" color="#000" size={30} />
          </TouchableOpacity>
          <TouchableOpacity
            className="mr-3"
            onPress={() => {
              if (text.length > 0) {
                clearList();
              }
            }}
          >
            <Text className="text-black font-medium px-3 py-2">CLEAR</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, text]);

  const clearList = () => {
    Alert.alert(
      "Clear Shopping List",
      "Are you sure you want to clear your shopping list",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            setText("");
          },
        },
      ]
    );
  };

  const checkList = async () => {
    const results = await readFridgeDB(database);
    const fridgeItems = results.map((item) => item.name);

    const list = text
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    let newList = [];
    let flag = false;

    for (let listItem of list) {
      flag = false;
      for (let fridgeItem of fridgeItems) {
        if (fridgeItem.toLowerCase().includes(listItem.toLowerCase())) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        newList.push(listItem);
      }
    }

    setText(newList.join("\n"));
  };

  return (
    <ImageBackground source={paperBg} className="flex-1 bg-yellow-100">
      <TextInput
        placeholder="Add your items here..."
        value={text}
        onChangeText={setText}
        multiline={true}
        textAlignVertical="top"
        autoCapitalize="none"
        className="text-black mx-10 mt-12 text-xl"
      />
      <Modal
        animationType="fade"
        visible={modalVisible}
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/40">
          <View className="bg-white w-[70%] h-auto rounded-lg">
            <Text className="font-semibold text-xl px-4 py-3">
              Check List against Fridge
            </Text>
            <Text className="px-4 text-justify">
              This action will check your shopping list against the items in
              your fridge and remove any that are already in your fridge.
            </Text>
            <Text className="px-4 text-sm text-gray-500 mt-1 text-justify">
              Note: This action may not be perfect, please double-check your
              list.
            </Text>
            <View className="flex-row justify-between items-centers mt-1">
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text className="text-lg text-blue-500 font-medium px-4 py-2">
                  CANCEL
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  checkList();
                  setModalVisible(false);
                }}
              >
                <Text className="text-lg text-blue-500 font-medium px-4 py-2">
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

export default List;

const styles = StyleSheet.create({});
