import { CameraView, useCameraPermissions } from "expo-camera";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const scanner = () => {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View className="flex-1 bg-[#000030]" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-[#000030]">
        <TouchableOpacity
          className="bg-blue-600 rounded-md m-auto"
          onPress={requestPermission}
        >
          <Text className="text-white px-4 py-3">Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (permission.granted) {
    return (
      <View className="flex-1 bg-[#000030]">
        <CameraView style={styles.camera} facing="back" />
      </View>
    );
  }
};

export default scanner;

const styles = StyleSheet.create({
  camera: {
    width: "65%",
    height: "20%",
    marginHorizontal: "auto",
    marginTop: "60%",
    borderRadius: "8px",
  },
});
