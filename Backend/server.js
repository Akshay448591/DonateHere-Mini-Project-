import dotenv from "dotenv";
dotenv.config(); // ✅ must be first

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Routes
import authRoutes from "./routes/auth.js";
import fundraiserRoutes from "./routes/fundraisers.js";
import usersRoute from "./routes/users.js"; // ✅ users route
import adminRoutes from "./routes/admin.js"; // ✅ admin dashboard analytics
import paymentsRoute from "./routes/payments.js"; // ✅ Stripe payments

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000", // fallback for local dev
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/fundraisers", fundraiserRoutes);
app.use("/api/users", usersRoute); // ✅ mount users route
app.use("/api/admin", adminRoutes); // ✅ mount admin routes
app.use("/api/payments", paymentsRoute); // ✅ mount Stripe payments route

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
