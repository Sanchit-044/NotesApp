// server.js

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// import your routes (adjust paths if needed)
import authRoutes from "./routes/authRoutes.js";
import notesRoutes from "./routes/noteRoutes.js";

const app = express();

// ✅ CORS setup - allow your frontend to talk to backend
app.use(
  cors({
    origin: ["https://notesapp-frontend-hfwm.onrender.com"], // your frontend site
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("✅ Notes App Backend is running...");
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    // Start server only after DB is connected
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
