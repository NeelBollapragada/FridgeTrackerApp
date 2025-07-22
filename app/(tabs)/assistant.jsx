import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import ChatMessage from "../components/ChatMessage";
import Promptbox from "../components/Promptbox";

const Assistant = () => {
  const [chats, setChats] = useState([]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 110}
    >
      <View className="flex-1 justify-end bg-[#000022]">
        <FlatList
          data={chats}
          renderItem={({ item }) => <ChatMessage message={item} />}
          keyExtractor={(item, index) => index.toString()}
          className="flex-1 mb-4"
        />
        <Promptbox chats={chats} setChats={setChats} />
        <View className="h-4" />
      </View>
    </KeyboardAvoidingView>
  );
};

export default Assistant;

const styles = StyleSheet.create({});
