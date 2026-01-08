
import axios from "axios";
import { scoreMatch } from "../intelligence/scoringEngine.js";

export const sendForMatching = async (userData) => {
  const res = await axios.post(process.env.MATCHING_API_URL, userData);
  const deals = res.data || [];

  return deals.map(deal => {
    const { score, reasons } = scoreMatch(userData, deal);
    return {
      ...deal,
      matchScore: score,
      matchReasons: reasons
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
};







