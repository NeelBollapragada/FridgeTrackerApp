const AI_API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;

export const aiChat = async (prompt, chatHistory) => {
  const recentChats = chatHistory.slice(-4);
  try {
    const results = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct:free",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful and friendly recipe assistant. You only answer questions related to food, meals, and cooking. If a question is unrelated to food or recipes, politely respond that you can only help with cooking related questions.",
            },
            ...recentChats,
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    const data = await results.json();

    if (data?.choices[0]?.message?.content) {
      return data.choices[0].message.content;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};
