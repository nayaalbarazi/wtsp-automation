import Message from "../models/messagemodel.js";

export const requestIntro = async ({ user, deal }) => {
  await Message.create({
    from: user.phone,
    to: "ADMIN",
    text: `Intro request: ${user.phone} → ${deal.title}`,
    direction: "system"
  });

  return true;
};
