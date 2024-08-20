import express from "express";
import dotenv from "dotenv";

import connectDB from "./config/databaseConfig";
import { methodNotAllowedHandler } from "./middlewares/methodNotAllowedHandler";
import allRouter from "./routes";

dotenv.config();
const app = express();

connectDB(); // Database connection

app.use(express.json()); // Middleware

app.use("/api", allRouter); // Routes

// Error handling middleware
app.all("*", methodNotAllowedHandler);

export default app;
