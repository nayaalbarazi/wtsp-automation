import { askGPT } from "./gptService.js";
import { enqueueMessage } from "./whatsappQueue.js";
import User from "../models/user.js";

export const sendAIFollowups = async () => {
  try {
    const users = await User.find({ conversationState: "completed" });

    for (const user of users) {
      const prompt = `
        Generate a friendly follow-up WhatsApp message for a user who has completed onboarding 
        but hasn't scheduled a meeting yet. 
        User info: ${JSON.stringify(user.onboardingData)}
      `;

      const message = await askGPT(prompt);
      await enqueueMessage(user.phone, message);
    }
  } catch (err) {
    console.error("AI Follow-up error:", err);
  }
};
