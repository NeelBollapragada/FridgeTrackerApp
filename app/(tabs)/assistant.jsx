import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import ChatMessage from "../components/ChatMessage";
import Promptbox from "../components/Promptbox";

const Assistant = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

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
          ListFooterComponent={
            loading ? (
              <View className="items-start mv-6 ml-6">
                <ActivityIndicator animating color="#64748b" />
              </View>
            ) : (
              <View className="h-12" />
            )
          }
          className="flex-1 mb-4"
        />
        <Promptbox setChats={setChats} setLoading={setLoading} />
        <View className="h-4" />
      </View>
    </KeyboardAvoidingView>
  );
};

export default Assistant;

const styles = StyleSheet.create({});
