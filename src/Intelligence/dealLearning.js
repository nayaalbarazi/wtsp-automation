export const adjustScoreByFeedback = (score, feedback) => {
  if (feedback === "positive") return score + 10;
  if (feedback === "negative") return score - 15;
  return score;
};
