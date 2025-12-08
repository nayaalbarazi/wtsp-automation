import cron from "node-cron";
import Message from "../models/Message.js";


cron.schedule("0 3 * * *", async () => {

  await Message.deleteMany({
    timestamp: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
  });
});
