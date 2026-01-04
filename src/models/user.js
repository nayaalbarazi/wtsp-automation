import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },

  conversationState: {
    type: String,
    enum: [
      "idle",
      "onboarding",
      "matching",
      "completed",
      "followup",
      "scheduling"
    ],
    default: "idle"
  },

  onboardingData: {
    role: String,
    industry: String,
    ticketSize: String,
    geography: String
  },

  lastMatches: [
    {
      title: String,
      url: String,
      shownAt: Date
    }
  ],

  meetingIntent: {
    dealTitle: String,
    availability: String,
    status: {
      type: String,
      enum: ["pending", "scheduled"],
      default: "pending"
    }
  },

  lastSeen: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("User", UserSchema);
