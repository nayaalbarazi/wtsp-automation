import axios from "axios";

const token = process.env.WHATSAPP_TOKEN;
const phoneId = process.env.WHATSAPP_PHONE_ID;

export const sendTextMessage = async (to, text) => {
    await axios.post(
        `https://graph.facebook.com/v18.0/${phoneId}/messages`,
        {
            messaging_product: "whatsapp",
            to,
            type: "text",
            text: { body: text }
        },
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
};
