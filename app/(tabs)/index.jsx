import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AddFoodModal from "../components/AddFoodModal";
import Searchbar from "../components/Searchbar";

const Index = () => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View className="bg-[#f2f2f2]">
      <View className="bg-white py-2 px-3 flex-row shadow-xl">
        <Searchbar />
        <TouchableOpacity
          className="bg-blue-500 w-[18%] ml-2 items-center justify-center rounded-xl"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-white text-center">Add +</Text>
        </TouchableOpacity>
        {modalVisible && (
          <AddFoodModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          />
        )}
      </View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({});
