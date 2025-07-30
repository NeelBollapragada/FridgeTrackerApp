import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-paper";

const HouseholdModal = ({
  visible,
  setVisible,
  error,
  codeInput,
  setCodeInput,
  handleHouseholdJoin,
  handleHouseholdCreate,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={() => setVisible(false)}
    >
      <View className="flex-1 items-center bg-black/40">
        <View className="bg-white w-[80%] mt-[60%] h-auto rounded-lg">
          <View className="flex-row justify-between items-center">
            <Text className="text-xl font-semibold px-6 py-4">
              Create or Join Household
            </Text>
            <TouchableOpacity
              className="mr-4"
              onPress={() => setVisible(false)}
            >
              <Icon source="close" size={24} />
            </TouchableOpacity>
          </View>
          <Text className="px-6 text-justify leading-5 mb-8">
            Households let you share a fridge with others - perfect for
            housemates, partners, or families. Everyone in the household can
            view, add, and update items in the shared fridge, making it easy to
            keep track of what's in stock, avoid duplicates, and plan meals
            together. Whether you're living with others or just want a shared
            grocery system, households help you stay organized as a team.
          </Text>
          <TouchableOpacity
            className="bg-blue-500 rounded-lg ml-10 mr-auto mb-6"
            onPress={() => {
              handleHouseholdCreate();
              setVisible(false);
            }}
          >
            <Text className="text-white px-3 py-2">Create a Household</Text>
          </TouchableOpacity>
          <View className="flex-row items-center mx-10 mb-2">
            <Text>Code: </Text>
            <TextInput
              value={codeInput}
              onChangeText={setCodeInput}
              className="border border-black w-32 mr-4 py-0 h-8"
            />
            <TouchableOpacity
              className="bg-blue-500 rounded-lg"
              onPress={() => {
                handleHouseholdJoin();
                setVisible(false);
              }}
            >
              <Text className="text-white px-3 py-2">Join Household</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-red-700 text-center mb-6">{error}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default HouseholdModal;
