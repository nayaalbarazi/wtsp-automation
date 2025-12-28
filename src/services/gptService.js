import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const askGPT = async (userText) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful WhatsApp assistant." },
        { role: "user", content: userText }
      ],
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.error("GPT Error:", err);
    return "Sorry, I couldn't process that.";
  }
};