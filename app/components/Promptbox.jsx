import { useState } from "react";
import {
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-paper";

const Promptbox = ({ chats, setChats }) => {
  const [input, setInput] = useState("");

  const handleInput = () => {
    if (input.trim() === "") return;

    setChats(
      chats.concat([
        {
          role: "error",
          content: input,
        },
      ])
    );
    setInput("");
    Keyboard.dismiss();
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
