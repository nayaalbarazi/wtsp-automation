export const saveDealFeedback = async (user, dealId, feedback) => {
  user.feedback = user.feedback || [];
  user.feedback.push({
    dealId,
    feedback,
    date: new Date()
  });
};
