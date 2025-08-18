// server.js

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import notesRoutes from "./routes/noteRoutes.js";

const app = express();

// ✅ Configure CORS explicitly
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev (vite default)
      "https://notesapp-frontend-hfwm.onrender.com", // your Render frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

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
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
