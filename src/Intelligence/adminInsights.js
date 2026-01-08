import User from "../models/userr.js";

export const generateAdminInsights = async () => {
  const users = await User.find();

  const totalUsers = users.length;
  const activeDeals = users.filter(u => u.meetings?.length).length;

  // Count frequency of industries
  const industryCounts = {};
  users.forEach(u => {
    const ind = u.onboardingData?.industry;
    if (ind) industryCounts[ind] = (industryCounts[ind] || 0) + 1;
  });

  // Top industries sorted by count
  const topIndustries = Object.entries(industryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([industry]) => industry);

  return {
    totalUsers,
    activeDeals,
    topIndustries
  };
};

