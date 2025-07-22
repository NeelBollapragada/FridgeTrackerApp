import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Promptbox from "../components/Promptbox";

const Assistant = () => {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 110}
    >
      <View className="flex-1 justify-end bg-[#000022]">
        <FlatList
          data={["test", "test2", "test3", "test4", "test5", "test6"]}
          renderItem={({ item }) => (
            <Text className="text-white text-6xl mb-8">{item}</Text>
          )}
          keyExtractor={(item, index) => index.toString()}
          className="flex-1 mb-4"
        />
        <Promptbox />
        <View className="h-4" />
      </View>
    </KeyboardAvoidingView>
  );
};

export default Assistant;

const styles = StyleSheet.create({});
