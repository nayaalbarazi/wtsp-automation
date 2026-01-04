import User from "../models/userr.js";
import Message from "../models/messagemodel.js";
import { enqueueMessage } from "../services/whatsappQueue.js";
import { sendForMatching } from "../services/matchingService.js";
import { scheduleMeeting } from "../services/calendarService.js";
import { askGPT } from "../services/gptService.js";

export const handleIncomingMessage = async (msg) => {
  const from = msg.from;
  const text = msg.text?.body?.trim();
  if (!text) return;

  let user = await User.findOne({ phone: from });
  if (!user) user = await User.create({ phone: from });

  user.lastSeen = new Date();
  let reply = "";

  // === Onboarding Flow ===
  if (user.conversationState === "idle") {
    reply = "👋 Welcome! Are you a Buyer, Seller, or Investor?";
    user.conversationState = "onboarding";

  } else if (!user.onboardingData.role) {
    if (!["buyer", "seller", "investor"].includes(text.toLowerCase())) {
      reply = "Please select one: Buyer, Seller, or Investor";
    } else {
      user.onboardingData.role = text.toLowerCase();
      reply = "🏭 Which industry are you interested in?";
    }

  } else if (!user.onboardingData.industry) {
    user.onboardingData.industry = text;
    reply = "💰 What is your target ticket size? (e.g., 1–5M, 5–10M)";

  } else if (!user.onboardingData.ticketSize) {
    user.onboardingData.ticketSize = text;
    reply = "🌍 Which geography are you focused on?";

  } 
  // === Matching Flow ===
  else if (!user.onboardingData.geography) {
    user.onboardingData.geography = text;
    user.conversationState = "matching";
    reply = "🔍 Finding the best matches…";

    const matches = await sendForMatching({ phone: user.phone, ...user.onboardingData });

    if (!matches?.length) {
      await enqueueMessage(from, "❌ No matches found.");
      user.conversationState = "completed";
    } else {
      let msgText = "✅ Matches found:\n\n";
      matches.forEach((m, i) => {
        msgText += `${i + 1}️⃣ ${m.title}\n👉 ${m.url}\n\n`;
      });
      await enqueueMessage(from, msgText);
      await enqueueMessage(
        from, 
        "Do you want to schedule a meeting with any of these companies? Reply with 'Company Name at YYYY-MM-DDTHH:MM'"
      );
      user.conversationState = "scheduling";
    }
  } 
  // === Scheduling Flow ===
  else if (user.conversationState === "scheduling") {
    try {
      const [company, dateTimeStr] = text.split(" at ");
      if (!company || !dateTimeStr) throw new Error("Invalid format");

      const startTime = new Date(dateTimeStr);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // +1 hour

      const meeting = await scheduleMeeting({
        userEmail: "user@example.com", // TODO: map real emails
        title: company,
        startTime,
        endTime
      });

      if (meeting) {
        if (!user.meetings) user.meetings = [];
        user.meetings.push({ company, dateTime: startTime });
        reply = `✅ Meeting with ${company} scheduled for ${startTime.toISOString()}`;
        user.conversationState = "completed";
      } else {
        reply = "❌ Failed to schedule meeting. Check format and try again.";
      }

    } catch (err) {
      console.error("Scheduling error:", err);
      reply = "❌ Invalid format. Please reply like 'Company Name at 2026-01-10T15:00'";
    }
  }

  // === AI Follow-up for completed users ===
  else if (user.conversationState === "completed") {
    try {
      const prompt = `
        Generate a friendly WhatsApp follow-up message for a user who completed onboarding and/or meetings.
        User data: ${JSON.stringify(user.onboardingData)}
      `;
      const followUp = await askGPT(prompt);
      if (followUp) await enqueueMessage(from, followUp);
    } catch (err) {
      console.error("AI follow-up error:", err);
    }
  }

  await user.save();

  // Save incoming message
  await Message.create({ from, to: "BOT", text, direction: "incoming" });

  // Send reply if any
  if (reply) await enqueueMessage(from, reply);
};
