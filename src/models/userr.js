import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  name: String,

  conversationState: {
    type: String,
    enum: ["idle", "onboarding", "matching", "completed", "human"],
    default: "idle"
  },

  onboardingData: {
    role: String,
    industry: String,
    ticketSize: String,
    geography: String
  },

  isHumanHandoff: {
    type: Boolean,
    default: false
  },

  lastSeen: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("User", UserSchema);

