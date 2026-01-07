import AnalyticsEvent from "./metricsModel.js";

export const trackEvent = async ({
  userId,
  event,
  metadata = {}
}) => {
  try {
    await AnalyticsEvent.create({
      userId,
      event,
      metadata,
      timestamp: new Date()
    });
  } catch (err) {
    console.error("Analytics error:", err.message);
  }
};
