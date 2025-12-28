import crypto from "crypto";
import { handleIncomingMessage } from "./messageController.js";

export const verifyWebhook = (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
};

// Validate signature
const verifySignature = (req) => {
  const signature = req.headers["x-hub-signature-256"];
  if (!signature) return false;
  const hmac = crypto.createHmac("sha256", process.env.WHATSAPP_APP_SECRET);
  hmac.update(JSON.stringify(req.body), "utf-8");
  const digest = `sha256=${hmac.digest("hex")}`;
  return signature === digest;
};

export const receiveMessage = async (req, res) => {
  try {
    if (!verifySignature(req)) return res.sendStatus(403);

    const entry = req.body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (message) await handleIncomingMessage(message);

    return res.sendStatus(200);
  } catch (err) {
    console.error("Webhook receiveMessage error:", err);
    return res.sendStatus(500);
  }
};
