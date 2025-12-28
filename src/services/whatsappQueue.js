import { Queue, Worker } from "bullmq";
import { sendTextMessage } from "./whatsappServices.js";

export const messageQueue = new Queue("whatsappMessages", {
  connection: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT }
});

new Worker(
  "whatsappMessages",
  async (job) => {
    const { to, text } = job.data;
    await sendTextMessage(to, text);
  },
  { connection: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT } }
);

export const enqueueMessage = async (to, text) => {
  await messageQueue.add("sendMessage", { to, text });


};
