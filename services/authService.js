import { ID } from "react-native-appwrite";
import { account } from "./appwrite";
import { addUserToCloud } from "./householdUsers";

const authService = {
  async register(email, password, username) {
    try {
      const uniqueId = ID.unique();
      const response = await account.create(
        uniqueId,
        email,
        password,
        username
      );

      await addUserToCloud(uniqueId, username);
      return response;
    } catch (error) {
      return {
        error: error.message || "Registration failed",
      };
    }
  },

  async login(email, password) {
    try {
      const response = await account.createEmailPasswordSession(
        email,
        password
      );
      return response;
    } catch (error) {
      return {
        error: error.message || "Login failed",
      };
    }
  },

  async getUser() {
    try {
      return await account.get();
    } catch (error) {
      return null;
    }
  },

  async logout() {
    try {
      await account.deleteSession("current");
    } catch (error) {
      return {
        error: error.message || "Logout failed",
      };
    }
  },
};

export default authService;
