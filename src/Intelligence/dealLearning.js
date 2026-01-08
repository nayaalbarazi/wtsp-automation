/**
 * Adjusts a match score based on user or admin feedback
 * @param {number} score - Original match score (0-100)
 * @param {"positive"|"negative"|null} feedback
 * @returns {number} Adjusted score
 */
export const adjustScoreByFeedback = (score, feedback) => {
  if (feedback === "positive") return Math.min(score + 10, 100);
  if (feedback === "negative") return Math.max(score - 15, 0);
  return score;
};
