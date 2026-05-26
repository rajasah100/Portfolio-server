import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import projectRoutes from "./routes/projects.js";
import skillRoutes from "./routes/skills.js";
import experienceRoutes from "./routes/experience.js";
import testimonialRoutes from "./routes/testimonials.js";
import messageRoutes from "./routes/messages.js";
import uploadRoutes from "./routes/upload.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

// Root route — Vercel मा deploy verify गर्न
app.get("/", (req, res) => {
  res.json({ 
    message: "Portfolio server is running ✅",
    status: "ok",
    time: new Date().toISOString()
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// MongoDB connection middleware (serverless को लागि)
let dbConnected = false;
app.use(async (req, res, next) => {
  try {
    if (!dbConnected) {
      await connectDB(process.env.MONGO_URI);
      dbConnected = true;
    }
    next();
  } catch (err) {
    console.error("DB connection error:", err);
    res.status(500).json({ message: "Database connection failed" });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/upload", uploadRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});


if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  connectDB(process.env.MONGO_URI).then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  });
}


export default app;