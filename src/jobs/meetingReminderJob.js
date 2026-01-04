import cron from "node-cron";
import User from "../models/user.js";
import { enqueueMessage } from "../services/whatsappQueue.js";

export const startMeetingReminderJob = () => {
  // Run every hour
  cron.schedule("0 * * * *", async () => {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    const users = await User.find({ "meetings.0": { $exists: true } });
    for (const user of users) {
      user.meetings.forEach(async (m) => {
        const meetingTime = new Date(m.dateTime);
        if (
          meetingTime > now &&
          meetingTime <= oneHourLater &&
          !m.reminderSent
        ) {
          await enqueueMessage(user.phone, `⏰ Reminder: You have a meeting with ${m.company} at ${meetingTime}`);
          m.reminderSent = true;
          await user.save();
        }
      });
    }
  });
};
