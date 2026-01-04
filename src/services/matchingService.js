import axios from "axios";

export const sendForMatching = async (payload) => {
  try {
    const res = await axios.post(`${process.env.MATCHING_API_URL}/match`, payload, {
      headers: { Authorization: `Bearer ${process.env.MATCHING_API_KEY}` },
    });
    return res.data.matches;
  } catch (err) {
    console.error("Matching API error:", err.message);
    // Mock matches if API is not ready
    return [
      { title: "Mock Company A", url: "https://example.com/A" },
      { title: "Mock Company B", url: "https://example.com/B" },
    ];
  }
};




