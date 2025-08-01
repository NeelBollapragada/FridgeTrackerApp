import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Icon } from "react-native-paper";

const Searchbar = ({ fridgeData, setFilteredData, household }) => {
  const [input, setInput] = useState("");

  return (
    <View className="bg-gray-400 rounded-full flex-row justify-between w-[80%]">
      <TextInput
        placeholder="Search"
        value={input}
        onChangeText={(newInput) => {
          setInput(newInput.trim().toLowerCase());
          if (household) {
            const query = fridgeData.map((item) => {
              const filtered = item.items.filter((food) =>
                food.name.toLowerCase().includes(newInput.toLowerCase())
              );
              return {
                name: item.name,
                items: filtered,
              };
            });

            setFilteredData(query);
          } else {
            const query = fridgeData.filter((item) =>
              item.name.toLowerCase().includes(newInput.toLowerCase())
            );
            setFilteredData(query);
          }
        }}
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
