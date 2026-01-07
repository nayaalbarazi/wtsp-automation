import express from "express";
import bodyParser from "body-parser";
import cors from "cors"; 
import dotenv from "dotenv";

import webhookRoutes from "./routes/webhookRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { connectDB } from "./services/db.js";
import { initQueueWorkers } from "./services/whatsappQueue.js";

import { startFollowupJob } from "./jobs/followupJob.js";
import { startWeeklySummaryJob } from "./jobs/weeklySummaryJob.js";
import { startMeetingReminderJob } from "./jobs/meetingReminderJob.js";
import { startBotPerformanceJob } from "./jobs/weeklyBotReport.js";

startBotPerformanceJob();

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/webhook", webhookRoutes);
app.use("/admin", adminRoutes);

// Health endpoint
app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  initQueueWorkers(); // Redis queue
  startFollowupJob();
  startWeeklySummaryJob();
  startMeetingReminderJob();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
