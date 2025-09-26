import express from "express";
import { signup, login, getDashboard } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected dashboard
router.get("/dashboard", authMiddleware(["user","admin","superadmin"]), getDashboard);

export default router;
