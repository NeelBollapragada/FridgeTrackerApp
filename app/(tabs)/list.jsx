import paperBg from "@/assets/images/lined-paper-3.png";
import { ImageBackground, StyleSheet, TextInput } from "react-native";

const List = () => {
  return (
    <ImageBackground source={paperBg} className="flex-1 bg-yellow-100">
      <TextInput
        placeholder="Add your items here..."
        multiline={true}
        autoCapitalize="none"
        className="text-black mx-10 my-12 text-xl"
      />
    </ImageBackground>
  );
};

export default List;

const styles = StyleSheet.create({});
