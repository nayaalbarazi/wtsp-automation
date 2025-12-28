import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../services/db.js";
import { handleIncomingMessage } from "../controllers/messageController.js";

dotenv.config();

async function testFlow() {
  await connectDB();

  const messages = ["Buyer", "Fintech", "5-10M", "MENA"];
  for (const msg of messages) {
    await handleIncomingMessage({ from: "1234567890", text: { body: msg } });
  }

  console.log("✅ Test flow finished");
  process.exit(0);
}

testFlow();
