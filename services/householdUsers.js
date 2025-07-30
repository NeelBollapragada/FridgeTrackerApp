import { account } from "./appwrite";
import { checkNetwork } from "./netinfo";

const USERNAME_CHECK_URL =
  "https://fridgetrackerbackend.onrender.com/api/users/check";
const USER_ADD_URL = "https://fridgetrackerbackend.onrender.com/api/users/add";
const HOUSEHOLD_CREATE =
  "https://fridgetrackerbackend.onrender.com/api/household/create";
const HOUSEHOLD_MEMBERS =
  "https://fridgetrackerbackend.onrender.com/api/household/members";

export const checkUserName = async (name) => {
  const online = await checkNetwork();
  if (!online) {
    console.warn("No internet connection. Skipping user check.");
    return false;
  }

  try {
    const res = await fetch(USERNAME_CHECK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: name }),
    });

    if (!res?.ok) {
      const data = await res.json();
      if (data?.error === "Username already exists") {
        return false;
      }
      console.error("Error checking username:", data.error);
      return false;
    }

    console.log("Username free");
    return true;
  } catch (error) {
    console.error("Error checking username:", error);
    return false;
  }
};

export const addUserToCloud = async (id, username) => {
  const online = await checkNetwork();
  if (!online) {
    console.warn("No internet connection. Skipping add user.");
    return false;
  }

  try {
    const res = await fetch(USER_ADD_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: id, username }),
    });

    if (!res?.ok) {
      const data = await res.json();
      console.error("Error adding user:", data.error);
      return;
    }

    console.log("User added successfully.");
  } catch (error) {
    console.error("Error caught adding user:", error);
  }
};

export const createHousehold = async () => {
  const online = await checkNetwork();
  if (!online) {
    console.warn("No internet connection. Skipping household creation.");
    return;
  }

  try {
    const user = await account.get();
    const res = await fetch(HOUSEHOLD_CREATE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user.$id, username: user.name }),
    });

    const code = await res.json();
    return code;
  } catch (error) {
    console.error("Error caught creating household", error);
  }
};

export const getHouseholdMembers = async () => {
  const online = await checkNetwork();
  if (!online) {
    console.warn("No internet connection. Skipping get household members.");
    return false;
  }

  try {
    const user = await account.get();
    const res = await fetch(HOUSEHOLD_MEMBERS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user.$id }),
    });

    if (!res.ok) {
      const data = await res.json();
      console.error("Error fetching household members", data.error);
      return;
    }

    const members = await res.json();
    return members;
  } catch (error) {
    console.error("Error caught fetching members", error);
    return false;
  }
};
