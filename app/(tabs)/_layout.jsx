import { Tabs } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-paper";

const TabIcon = ({ focused, icon, title }) => {
  return (
    <View className="justify-center items-center mt-4">
      <Icon source={icon} size={20} color={focused ? "#5780fc" : "#68748c"} />
      <Text
        className={`text-xs font-medium ${focused ? "text-blue-500" : "text-[#68748c]"}`}
      >
        {title}
      </Text>
    </View>
  );
};

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Fridge",
          headerShown: true,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="fridge" title="Fridge" />
          ),
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: "List",
          headerShown: true,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="invoice-list" title="List" />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;

const styles = StyleSheet.create({});
