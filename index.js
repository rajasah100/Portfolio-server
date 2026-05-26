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

// ============================================
// CORS configuration — local + all Vercel URLs
// ============================================
const allowedOrigins = [
  "http://localhost:5173",      // Vite dev server
  "http://localhost:3000",      // alternative local port
  "http://localhost:4173",      // Vite preview
  process.env.CORS_ORIGIN,      // production URL (env बाट)
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // No-origin requests (Postman, mobile, server-to-server) allow
      if (!origin) return callback(null, true);

      // Explicit allowed list मा छ
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // सबै *.vercel.app subdomains allow (preview + production)
      try {
        const hostname = new URL(origin).hostname;
        if (hostname.endsWith(".vercel.app")) {
          return callback(null, true);
        }
      } catch (err) {
        console.error("Invalid origin URL:", origin);
      }

      console.log("❌ Blocked by CORS:", origin);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

// Root route — Vercel deploy verify गर्न
app.get("/", (req, res) => {
  res.json({
    message: "Portfolio server is running ✅",
    status: "ok",
    time: new Date().toISOString(),
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

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/upload", uploadRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

// Local development मा मात्र listen
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  connectDB(process.env.MONGO_URI).then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  });
}

// Vercel को लागि — अनिवार्य
export default app;