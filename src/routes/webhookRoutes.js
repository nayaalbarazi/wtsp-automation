import express from "express";
import { handleIncomingMessage } from "../controllers/messageController.js";
import { verifyWebhook, receiveMessage } from "../controllers/webhookController.js";

const router = express.Router();

router.get("/", verifyWebhook);
router.post("/", receiveMessage);

router.get("/test", async (req, res) => {
  try {
    await handleIncomingMessage({ from: "1234567890", text: { body: "Buyer" } });
    return res.status(200).send("✅ Test message processed");
  } catch (err) {
    return res.status(500).send("❌ Test failed");
  }
});

export default router;

