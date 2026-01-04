// jobs/followupJob.js
import cron from "node-cron";
import User from "../models/userr.js";
import { enqueueMessage } from "../services/whatsappQueue.js";
import { askGPT } from "../services/gptService.js";

/**
 * Sends follow-up messages to users who have completed onboarding or meetings.
 * Runs weekly on Mondays at 10:00 AM by default.
 */
export const startFollowupJob = () => {
  cron.schedule("0 10 * * 1", async () => { // Every Monday at 10:00
    try {
      const users = await User.find({ conversationState: "completed" });

      for (const user of users) {
        try {
          const prompt = `
            Generate a friendly WhatsApp follow-up message for a user who completed onboarding or meetings.
            Include encouragement, tips, or suggestions for next steps.
            User data: ${JSON.stringify(user.onboardingData)}
          `;
          const followUp = await askGPT(prompt);

          if (followUp) {
            await enqueueMessage(user.phone, followUp);
            console.log(`✅ Sent follow-up to ${user.phone}`);
          }
        } catch (err) {
          console.error(`❌ Failed to send follow-up to ${user.phone}:`, err);
        }
      }

    } catch (err) {
      console.error("Follow-up job error:", err);
    }
  });

  console.log("🕒 Follow-up job scheduled (weekly)");
};
