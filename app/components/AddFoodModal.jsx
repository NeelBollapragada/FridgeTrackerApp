import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-paper";

const AddFoodModal = ({ modalVisible, setModalVisible }) => {
  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      transparent
      onRequestClose={() => setModalVisible(false)}
    >
      <View className="flex-1 items-center justify-center bg-black/40">
        <View className="bg-navy w-[80%] h-[75%] rounded-xl shadow-2xl">
          <TouchableOpacity
            className="self-end mt-1 mr-1"
            onPress={() => setModalVisible(false)}
          >
            <Icon source="close" color="#9ca3af" size={25} />
          </TouchableOpacity>
          <Text className="text-center text-white font-bold text-4xl mb-4">
            Add Food
          </Text>
          <View className="h-[0.4px] bg-white w-full" />
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#9ca3af"
            className="ml-4 text-white"
          />
          <View className="h-[0.4px] bg-white w-full" />
        </View>
      </View>
    </Modal>
  );
};

export default AddFoodModal;

const styles = StyleSheet.create({});
