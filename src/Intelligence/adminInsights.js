import User from "../models/userr.js";

export const generateAdminInsights = async () => {
  const users = await User.find();

  return {
    totalUsers: users.length,
    activeDeals: users.filter(u => u.meetings?.length).length,
    topIndustries: [...new Set(users.map(u => u.onboardingData?.industry))]
  };
};
