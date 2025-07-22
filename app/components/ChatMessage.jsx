import { StyleSheet, Text, View } from "react-native";

const ChatMessage = ({ message }) => {
  if (message.role === "error") {
    return (
      <View className="w-[80%] h-auto border border-slate-500 rounded-xl mt-6 ml-6">
        <Text className="text-red-700 px-4 py-3">
          An error occurred. Please try again later.
        </Text>
      </View>
    );
  }
  if (message.role === "user") {
    return (
      <View className="items-end">
        <View className="w-[65%] h-auto bg-slate-500 rounded-xl mt-6 mr-6">
          <Text className="text-white px-4 py-3">{message.content}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="w-[80%] h-auto border border-slate-500 rounded-xl mt-6 ml-6">
      <Text className="text-white text-justify leading-6 tracking-wide px-4 py-3">
        {message.content}
      </Text>
    </View>
  );
};

export default ChatMessage;

const styles = StyleSheet.create({});
