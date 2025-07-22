import { StyleSheet, Text, View } from "react-native";

const ChatMessage = ({ message }) => {
  if (message.role === "user") {
    return (
      <View className="items-end">
        <View className="w-[65%] h-auto bg-slate-500 rounded-xl mt-6 mr-6">
          <Text className="text-white px-4 py-3">{message.content}</Text>
        </View>
      </View>
    );
  }
};

export default ChatMessage;

const styles = StyleSheet.create({});
