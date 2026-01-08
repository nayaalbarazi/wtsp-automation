import cron from "node-cron";


export const startNewDealJob = () => {
  cron.schedule("*/30 * * * *", async () => {
  
  });
};
