import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import webhookRoutes from "./routes/webhookRoutes.js";
import { connectDB } from "./services/db.js";
import "./jobs/cleanupJob.js"; // starts scheduled cleanup automatically
import { logger } from "./config/logger.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/webhook", webhookRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("WhatsApp Automation Backend is running 🚀");
});

// Connect to DB & start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`Server started on port ${PORT}`);
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    console.error("Startup error:", error);
    process.exit(1);
  }
};

startServer();
