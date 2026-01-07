import cron from "node-cron";
import { evaluatePerformance } from "../analytics/performanceEvaluator.js";

export const startBotPerformanceJob = () => {
  cron.schedule("0 10 * * 1", async () => {
    const report = await evaluatePerformance();

    console.log("🤖 Bot Performance Report:");
    console.table(report);
  });
};
