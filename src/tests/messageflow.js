import { Worker } from "bullmq";
import { sendTextMessage } from "../services/whatsappService.js";
import { askGPT } from "../services/gptService.js";
import Message from "../models/Message.js";

export const messageWorker = new Worker(
  "messages",
  async (job) => {
    const { from, text } = job.data;

    try {
      
      let reply = text.includes("human") || text.includes("agent")
        ? "🧑‍💼 A human will contact you."
        : await askGPT(text);

      
      await sendTextMessage(from, reply);

      
      await Message.create({
        from: "BOT",
        to: from,
        text: reply,
        timestamp: new Date(),
        direction: "outgoing",
        status: "sent"
      });

    } catch (error) {
      
      await Message.create({
        from: "BOT",
        to: from,
        text,
        timestamp: new Date(),
        direction: "outgoing",
        status: "failed",
        errorReason: error.message
      });

      // Throwing the error triggers BullMQ retries
      throw error;
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
    }
  }
);
