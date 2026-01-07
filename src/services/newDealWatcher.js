import User from "../models/userr.js";
import { enqueueMessage } from "./whatsappQueue.js";

export const notifyUsersOfNewDeal = async (deal) => {
  const users = await User.find({
    "onboardingData.industry": deal.industry
  });

  for (const user of users) {
    await enqueueMessage(
      user.phone,
      `🚨 New deal available: ${deal.title}\nIndustry: ${deal.industry}`
    );
  }
};
