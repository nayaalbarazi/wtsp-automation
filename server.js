import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import webhookRoutes from "./src/routes/webhookRoutes.js";
import { limiter } from "./src/utils/limit.js";
import { connectDB } from "./src/services/db.js";
import helmet from "helmet";
import cors from "cors";

dotenv.config();

const app = express(); 


connectDB();


app.use(limiter);
app.use(helmet());
app.use(cors());


app.use(bodyParser.json());


app.use("/webhook", webhookRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ Server running on port " + PORT));
