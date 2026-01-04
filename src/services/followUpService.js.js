import User from "../models/userr.js";
import { enqueueMessage } from "./whatsappQueue.js";

export const sendFollowUps = async () => {
  const users = await User.find({
    conversationState: "completed",
    lastMatches: { $exists: true, $ne: [] }
  });

  for (const user of users) {
    await enqueueMessage(
      user.phone,
      "👋 Just checking in — would you like to proceed with any of the deals I shared?"
    );
    user.conversationState = "followup";
    await user.save();
  }
};