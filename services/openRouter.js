import { checkNetwork } from "./netinfo";

const API_URL = "https://fridgetrackerbackend.onrender.com/api/chat";

export const aiChat = async (prompt, chatHistory) => {
  const online = await checkNetwork();
  if (!online) {
    console.warn("No internet connection. Returning null.");
    return null;
  }
  const recentChats = chatHistory.slice(-4);
  try {
    const results = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, recentChats }),
    });

    const data = await results.json();

    return data.reply || null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
