import User from "../models/user.js";
import Message from "../models/messagemodel.js";

export const evaluatePerformance = async () => {
  const users = await User.find();
  const totalUsers = users.length;

  const onboardingCompleted = users.filter(u => u.conversationState !== "idle").length;
  const onboardingCompletionRate = totalUsers ? (onboardingCompleted / totalUsers) : 0;

  const meetingsScheduled = users.filter(u => u.meetings?.length > 0).length;
  const meetingConversionRate = totalUsers ? (meetingsScheduled / totalUsers) : 0;

  // Average messages per user
  const messages = await Message.find();
  const avgMessagesPerUser = totalUsers ? (messages.length / totalUsers).toFixed(1) : 0;

  return {
    totalUsers,
    onboardingCompletionRate: onboardingCompletionRate.toFixed(2),
    meetingConversionRate: meetingConversionRate.toFixed(2),
    avgMessagesPerUser
  };
};