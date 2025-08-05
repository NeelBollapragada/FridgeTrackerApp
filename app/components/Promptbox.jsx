import { useState } from "react";
import {
  Alert,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-paper";
import { aiChat } from "../../services/openRouter";
import { insertChatDB } from "../../services/sqlite";

const Promptbox = ({ chats, setChats, setLoading, db }) => {
  const [input, setInput] = useState("");

  const handleInput = async () => {
    if (chats.length >= 10) {
      Alert.alert(
        "Maximum Chats Reached",
        "You have reached your chat limit for today. Check in tomorrow to talk to the recipe assistant.",
        [{ text: "Ok", style: "cancel" }]
      );
      return;
    }

    console.log(chats.length);

    if (input.trim() === "") return;

    const newChat = input.trim();

    setChats((chats) =>
      chats.concat([
        {
          role: "user",
          content: newChat,
        },
      ])
    );
    setInput("");
    Keyboard.dismiss();

    await insertChatDB(db, "user", newChat);

    setLoading(true);

    const response = await aiChat(newChat, chats);

    if (response) {
      setChats((chats) =>
        chats.concat([
          {
            role: "assistant",
            content: response.trim(),
          },
        ])
      );
      await insertChatDB(db, "assistant", response.trim());
    } else {
      setChats((chats) =>
        chats.concat([
          {
            role: "error",
          },
        ])
      );
      await insertChatDB(db, "error", "");
    }

    setLoading(false);
  };

  return (
    <View className="w-auto h-auto min-h-16 max-h-48 rounded-3xl bg-slate-600 flex-row justify-between items-center mx-2 mb-4">
      <TextInput
        placeholder="Ask a question"
        placeholderTextColor="#cbd5e1"
        value={input}
        onChangeText={setInput}
        multiline
        className="flex-1 text-white px-6 py-4"
      />
      <TouchableOpacity className="mr-4" onPress={handleInput}>
        <Icon
          source="arrow-up-box"
          size={32}
          color={input.trim() === "" ? "#1c1b1f" : "white"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Promptbox;

const styles = StyleSheet.create({});
