
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

export const receiveMessage = async (req, res) => {
  try {
    
    const entry = req.body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (message) {
      
      await handleIncomingMessage(message);
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error("Webhook receiveMessage error:", err);
    return res.sendStatus(500);
  }
};
