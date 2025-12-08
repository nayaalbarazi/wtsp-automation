import { Queue } from "bullmq";

export const messageQueue = new Queue("messages", {
  connection: { host: "localhost", port: 6379 }
});
