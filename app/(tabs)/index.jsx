import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Searchbar from "../components/Searchbar";

const Index = () => {
  return (
    <View className="bg-[#f2f2f2]">
      <View className="bg-white py-2 px-3 flex-row">
        <Searchbar />
        <TouchableOpacity className="bg-blue-500 w-[18%] ml-2 items-center justify-center rounded-xl">
          <Text className="text-white text-center">Add +</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({});
