import paperBg from "@/assets/images/lined-paper-3.png";
import { useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-paper";
import { getDB, readDB } from "../../services/sqlite";

const List = () => {
  const navigation = useNavigation();
  const [text, setText] = useState("");
  const [database, setDatabase] = useState(null);

  useEffect(() => {
    const init = async () => {
      const dbInstance = await getDB();
      setDatabase(dbInstance);
    };
    init();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View className="flex-row justify-center items-center">
          <TouchableOpacity
            className="mr-1"
            onPress={async () => {
              console.log(text.split("\n"));
              const dbContents = await readDB(database);
              console.log(dbContents);
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
    </ImageBackground>
  );
};

export default List;

const styles = StyleSheet.create({});
