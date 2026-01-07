import cron from "node-cron";
import { notifyUsersOfNewDeal } from "../services/newDealWatcher.js";

export const startNewDealJob = () => {
  cron.schedule("*/30 * * * *", async () => {
    // Call matching site for new deals
    // If new → notifyUsersOfNewDeal(deal)
  });
};
