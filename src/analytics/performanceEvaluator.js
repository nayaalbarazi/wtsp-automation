import AnalyticsEvent from "./metricsModel.js";

export const evaluatePerformance = async () => {
  const totalUsers = await AnalyticsEvent.distinct("userId");

  const onboardingCompleted = await AnalyticsEvent.countDocuments({
    event: "onboarding_completed"
  });

  const meetings = await AnalyticsEvent.countDocuments({
    event: "meeting_scheduled"
  });

  const matchesShown = await AnalyticsEvent.countDocuments({
    event: "matches_shown"
  });

  return {
    totalUsers: totalUsers.length,
    onboardingCompletionRate:
      onboardingCompleted / totalUsers.length || 0,

    meetingConversionRate:
      meetings / matchesShown || 0
  };
};
