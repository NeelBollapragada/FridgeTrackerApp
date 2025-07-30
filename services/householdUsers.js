import { checkNetwork } from "./netinfo";

const USERNAME_CHECK_URL =
  "https://fridgetrackerbackend.onrender.com/api/users/check";

const USER_ADD_URL = "https://fridgetrackerbackend.onrender.com/api/users/add";

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
