import { StyleSheet, TextInput, View } from "react-native";
import { Icon } from "react-native-paper";

const Searchbar = () => {
  return (
    <View className="bg-gray-400 rounded-full flex-row justify-between w-[80%]">
      <TextInput
        placeholder="Search"
        className="flex-1 ml-3"
        placeholderTextColor="#222937"
      />
      <View className="mt-1 mr-2">
        <Icon source="magnify" color="#3a4151" size={30} />
      </View>
    </View>
  );
};

export default Searchbar;

const styles = StyleSheet.create({});
