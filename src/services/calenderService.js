import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const auth = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  SCOPES
);
const calendar = google.calendar({ version: "v3", auth });

export const scheduleMeeting = async ({ userEmail, title, startTime, endTime }) => {
  try {
    const event = {
      summary: title,
      start: { dateTime: startTime },
      end: { dateTime: endTime },
      attendees: [{ email: userEmail }],
    };
    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });
    return response.data;
  } catch (err) {
    console.error("Calendar scheduling error:", err);
    return null;
  }
};
