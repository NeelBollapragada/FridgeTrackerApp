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
          headerStyle: {
            borderBottomColor: "gray",
            borderBottomWidth: 0.2,
          },
          headerTitleStyle: {
            marginLeft: 15,
          },
          headerShadowVisible: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="fridge" title="Fridge" />
          ),
        }}
      />
      <Tabs.Screen
        name="assistant"
        options={{
          title: "Recipe Assistant",
          headerShown: true,
          headerTitleStyle: {
            marginLeft: 15,
            color: "#fff",
          },
          headerStyle: {
            backgroundColor: "#000022",
            borderBottomColor: "#bfe1f5",
            borderBottomWidth: 0.2,
          },
          headerShadowVisible: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="chef-hat" title="Chef" />
          ),
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: "Shopping List",
          headerShown: true,
          headerTitleStyle: {
            marginLeft: 15,
          },
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
