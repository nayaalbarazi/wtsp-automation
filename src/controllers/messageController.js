import User from "../models/userr.js";
import Message from "../models/messagemodel.js";
import { enqueueMessage } from "../services/whatsappQueue.js";
import { sendForMatching } from "../services/matchingService.js";

export const handleIncomingMessage = async (msg) => {
  const from = msg.from;
  const text = msg.text?.body?.trim();
  if (!text) return;

  let user = await User.findOne({ phone: from });
  if (!user) user = await User.create({ phone: from });

  user.lastSeen = new Date();

  let reply = "";

  // Button-based onboarding flow
  if (user.conversationState === "idle") {
    reply = "👋 Welcome! Are you a Buyer, Seller, or Investor?";
    user.conversationState = "onboarding";
  } 
  else if (!user.onboardingData.role) {
    if (!["buyer", "seller", "investor"].includes(text.toLowerCase())) {
      reply = "Please select one: Buyer, Seller, or Investor";
    } else {
      user.onboardingData.role = text.toLowerCase();
      reply = "🏭 Which industry are you interested in?";
    }
  } 
  else if (!user.onboardingData.industry) {
    user.onboardingData.industry = text;
    reply = "💰 What is your target ticket size? (e.g., 1–5M, 5–10M)";
  } 
  else if (!user.onboardingData.ticketSize) {
    user.onboardingData.ticketSize = text;
    reply = "🌍 Which geography are you focused on?";
  } 
  else if (!user.onboardingData.geography) {
    user.onboardingData.geography = text;
    user.conversationState = "matching";
    reply = "🔍 Finding the best matches…";

    sendForMatching({ phone: user.phone, ...user.onboardingData }).then(async (matches) => {
      if (!matches?.length) {
        await enqueueMessage(from, "❌ No matches found.");
        return;
      }

      let msg = "✅ Matches found:\n\n";
      matches.forEach((m, i) => {
        msg += `${i + 1}️⃣ ${m.title}\n👉 ${m.url}\n\n`;
      });

      await enqueueMessage(from, msg);
      user.conversationState = "completed";
      await user.save();
    });
  }

  await user.save();

  await Message.create({ from, to: "BOT", text, direction: "incoming" });

  if (reply) await enqueueMessage(from, reply);
};


