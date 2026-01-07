export const scoreMatch = (user, deal) => {
  let score = 0;
  const reasons = [];

  if (user.industry === deal.industry) {
    score += 30;
    reasons.push("Industry match");
  }

  if (user.geography === deal.geography) {
    score += 20;
    reasons.push("Geography match");
  }

  if (deal.ticketSize === user.ticketSize) {
    score += 25;
    reasons.push("Ticket size alignment");
  }

  if (deal.stage === user.preferredStage) {
    score += 15;
    reasons.push("Stage fit");
  }

  return {
    score: Math.min(score, 100),
    reasons
  };
};
