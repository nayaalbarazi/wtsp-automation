import cron from "node-cron";
import { generateAdminInsights } from "../intelligence/adminInsights.js";

export const startAdminReportJob = () => {
  cron.schedule("0 9 * * 1", async () => {
    const report = await generateAdminInsights();
    console.log("📊 Weekly Admin Report:", report);
  });
};
