import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { barcodeSearch } from "../../services/openFood";

const scanner = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

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

  const handleBarcode = async ({ data }) => {
    if (scanned) return;
    setScanned(true);

    const food = await barcodeSearch(data);
    if (food) {
    }
  };

  if (permission.granted) {
    return (
      <View className="flex-1 bg-[#000030]">
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e"],
          }}
          onBarcodeScanned={handleBarcode}
        />
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
