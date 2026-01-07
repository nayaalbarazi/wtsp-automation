import mongoose from "mongoose";

const AnalyticsEventSchema = new mongoose.Schema({
  userId: { type: String, index: true },
  event: { type: String, index: true },
  metadata: Object,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("AnalyticsEvent", AnalyticsEventSchema);
