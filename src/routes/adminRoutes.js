import express from "express";
import User from "../models/user.js";

const router = express.Router();

// Example: /admin/stats
router.get("/stats", async (req, res) => {
  try {
    const users = await User.find();
    const meetings = users.reduce((acc, u) => acc + (u.meetings?.length || 0), 0);

    res.json({
      totalUsers: users.length,
      totalMeetings: meetings,
      users
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
