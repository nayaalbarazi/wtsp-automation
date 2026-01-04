import cron from "node-cron";
import User from "../models/user.js";
import { enqueueMessage } from "../services/whatsappQueue.js";

export const startWeeklySummaryJob = () => {
  // Every Sunday at 20:00
  cron.schedule("0 20 * * 0", async () => {
    try {
      const users = await User.find();
      let summary = "📊 Weekly WhatsApp Bot Summary:\n\n";

      summary += `Total users onboarded: ${users.length}\n`;
      const meetings = users.reduce((acc, u) => acc + (u.meetings?.length || 0), 0);
      summary += `Meetings scheduled: ${meetings}\n`;

      for (const user of users) {
        if (user.meetings?.length) {
          summary += `\nUser ${user.phone} meetings:\n`;
          user.meetings.forEach((m) => {
            summary += `- ${m.company} at ${m.dateTime}\n`;
          });
        }
      }

      // Send to admin number
      await enqueueMessage(process.env.ADMIN_PHONE, summary);
      console.log("✅ Weekly summary sent");
    } catch (err) {
      console.error("Weekly summary error:", err);
    }
  });
};

