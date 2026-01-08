# WhatsApp Automation Bot

This bot automates deal matching, follow-ups, meeting scheduling, and weekly reporting for users via WhatsApp.

## Features
- **Onboarding flow:** Captures user role, industry, ticket size, and geography.
- **Deal matching:** Retrieves deals from an external API and scores them based on user data.
- **Meeting scheduling:** Integrates with Google Calendar.
- **AI-powered follow-ups:** Optional GPT-based follow-up messages.
- **Weekly reports:** Bot and admin performance summaries.
- **Cron jobs:**
  - Follow-up messages (`followupJob.js`)
  - Weekly user summary (`weeklySummaryJob.js`)
  - Meeting reminders (`meetingReminderJob.js`)
  - Weekly bot performance report (`weeklyBotReport.js`)

## Prerequisites
- Node.js 18+
- Docker & Docker Compose
- MongoDB & Redis (can run in Docker)
- `.env` file with credentials

