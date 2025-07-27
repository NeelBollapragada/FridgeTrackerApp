import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext.js";
import { keepCloudFridge, keepLocalFridge } from "../../services/fridgeSync.js";

const Profile = () => {
  const { user, register, login, logout } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Email and password cannot be empty.");
      return;
    }

    if (isRegistering && !username.trim()) {
      setError("Username cannot be empty.");
      return;
    }

    if (isRegistering && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    let response;
    if (isRegistering) {
      response = await register(email, password, username);
    } else {
      response = await login(email, password);
      if (response?.success && !response?.fridgeSync) {
        Alert.alert(
          "Choose Fridge",
          "Your cloud and local fridges are different. Which one should we keep?",
          [
            {
              text: "Keep Local",
              onPress: async () => {
                await keepLocalFridge();
              },
            },
            {
              text: "Keep Cloud",
              onPress: async () => {
                await keepCloudFridge();
              },
            },
          ]
        );
      }
    }

    if (response?.error) {
      console.log(response.error);
      if (
        response.error ===
        "Invalid `password` param: Password must be between 8 and 265 characters long, and should not be one of the commonly used password."
      ) {
        setError("Password must be between 8 and 265 characters.");
      } else if (
        response.error ===
        "Invalid credentials. Please check the email and password."
      ) {
        setError("Invalid email or password.");
      } else {
        Alert.alert(response.error);
      }
      return;
    }

    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  const handleLogout = async () => {
    await logout();
  };

  if (!user) {
    return (
      <View>
        <Text className="text-3xl font-bold text-center mt-10">
          Currently signed out
        </Text>
        <View className="flex-col justify-center items-center mt-[30%]">
          <Text className="text-xl font-medium mb-2">
            {isRegistering ? "Sign Up" : "Login"}
          </Text>
          <Text className="text-red-700 mb-1">{error}</Text>
          {isRegistering && (
            <TextInput
              placeholder="username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              className="bg-gray-300 w-[75%] rounded-lg px-4 py-3 mb-4"
            />
          )}
          <TextInput
            placeholder="email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            className="bg-gray-300 w-[75%] rounded-lg px-4 py-3 mb-4"
          />
          <TextInput
            placeholder="password"
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            secureTextEntry
            className="bg-gray-300 w-[75%] rounded-lg px-4 py-3 mb-4"
          />
          {isRegistering && (
            <TextInput
              placeholder="confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
              secureTextEntry
              className="bg-gray-300 w-[75%] rounded-lg px-4 py-3 mb-4"
            />
          )}
          <TouchableOpacity
            className="bg-black w-[75%] rounded-lg mt-2"
            onPress={handleAuth}
          >
            <Text className="text-white text-center py-3">
              {isRegistering ? "Register" : "Sign In"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row mt-2"
            onPress={() => {
              setIsRegistering(!isRegistering);
              setError("");
              setUsername("");
              setEmail("");
              setPassword("");
              setConfirmPassword("");
            }}
          >
            <Text className="text-gray-500">
              {isRegistering
                ? "Already have an account? "
                : "Don't have an account? "}
            </Text>
            <Text className="text-blue-500">
              {isRegistering ? "Log in." : "Register."}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="bg-gray-300">
        <Text className="text-3xl font-bold text-center mt-10">
          Welcome, {user && user.name}
        </Text>
        <View className="flex-row items-center mt-8 justify-center mb-6">
          <Text className="text-gray-700 font-medium">Email: </Text>
          <Text>{user && user.email}</Text>
        </View>
      </View>
      <TouchableOpacity
        className="bg-red-700 mx-auto mt-4 rounded-lg"
        onPress={handleLogout}
      >
        <Text className="text-white px-4 py-3">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});
