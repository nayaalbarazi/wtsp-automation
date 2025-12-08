import Message from "../models/messagemodel.js";
import User from "../models/userr.js";
import { sendTextMessage } from "../services/whatsappServices.js";


export const handleIncomingMessage = async (msg) => {
  const from = msg.from;
  const text = msg.text?.body?.toLowerCase() || "";

  let reply = "";

  if (text.includes("hi") || text.includes("hello")) {
    reply = "👋 Hi! How can I help you?";
  } else if (text.includes("help")) {
    reply = "You can ask about:\n1. Opening hours\n2. Services\n3. Contact";
  } else if (text.includes("1") || text.includes("hours")) {
    reply = "🕘 We are open from 9AM to 6PM.";
  } else if (text.includes("2") || text.includes("services")) {
    reply = "📦 We offer support, automation, and consulting services.";
  } else if (text.includes("3") || text.includes("contact")) {
    reply = "📞 You can contact support@example.com";
  } else {
    reply = "❓ I didn't understand that. Type 'help' to see options.";
  }


  await Message.create({
    from,
    to: "BOT",
    text,
    timestamp: new Date(),
    direction: "incoming",
    status: "pending"
  });

  
  const user = await User.findOne({ phone: from });
  if (user?.isHumanHandoff) {
    
    return;
  }

  
  if (text.includes("human") || text.includes("agent")) {
    await User.updateOne({ phone: from }, { isHumanHandoff: true });
    await sendTextMessage(from, "🧑‍💼 A human agent will contact you soon.");
    return;
  }

  
  await sendTextMessage(from, reply);

};
