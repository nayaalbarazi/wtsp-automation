// src/routes/webhookRoutes.js
import express from "express";
import { verifyWebhook, receiveMessage } from "../controllers/webhookController.js";
import { handleIncomingMessage } from "../controllers/messageController.js";

const router = express.Router();

// Meta verification endpoint (GET)
router.get("/", verifyWebhook);

// Meta webhook POSTs events here
router.post("/", receiveMessage);

// Local test endpoint to simulate an incoming WhatsApp message.
// Useful for demos when you don't have Meta credentials.
router.get("/test", async (req, res) => {
  try {
    const fakeMsg = {
      from: "1234567890",
      text: { body: "hi" }
    };

    await handleIncomingMessage(fakeMsg);
    return res.status(200).send("✅ Test message processed");
  } catch (err) {
    console.error("Test route error:", err);
    return res.status(500).send("❌ Test failed");
  }
});

// Health check
router.get("/health", (req, res) => res.status(200).send("✅ OK"));

export default router;
