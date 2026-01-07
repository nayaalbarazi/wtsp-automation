import features from "../config/features.js";
import { askGPT } from "./gptService.js";

export const getNextQuestion = async (context) => {
  if (!features.ENABLE_GPT) {
    return "Can you share more about your investment focus?";
  }

  return await askGPT(
    `Ask a smart follow-up question for this context: ${JSON.stringify(context)}`
  );
};
