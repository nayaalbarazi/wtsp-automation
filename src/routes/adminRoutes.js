import express from "express";
import User from "../models/user.js";

const router = express.Router();

// GET /admin/stats
router.get("/stats", async (req, res) => {
  try {
    const users = await User.find();
    const totalMeetings = users.reduce((acc, u) => acc + (u.meetings?.length || 0), 0);

    res.json({
      totalUsers: users.length,
      totalMeetings,
      // remove users array in production if privacy is a concern
      users: users.map(u => ({
        phone: u.phone,
        role: u.onboardingData?.role,
        industry: u.onboardingData?.industry,
        meetings: u.meetings?.length || 0
      }))
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

