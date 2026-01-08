import { adjustScoreByFeedback } from "./dealLearning.js";

/**
 * Example function to compute final match score
 * @param {number} baseScore - Score from matching algorithm (0-100)
 * @param {"positive"|"negative"|null} feedback
 * @param {Object} userData - optional user data to influence scoring
 */
export const computeFinalScore = (baseScore, feedback, userData = {}) => {
  let score = baseScore;

  
  score = adjustScoreByFeedback(score, feedback);

  //This is only an example
  if (userData.role === "investor") score += 2;
  if (userData.ticketSize === "5–10M") score += 1;

  return Math.min(Math.max(score, 0), 100); // Clamp 0-100
};
